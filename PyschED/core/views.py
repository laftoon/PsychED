# core/views.py
from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from django.views.generic import TemplateView
from django.http import JsonResponse
from .forms import ContactForm
from .calendar_integration import create_calendar_event, get_calendar_service
from datetime import datetime, timedelta
import logging
import json
import pytz
from django.core.cache import cache
from datetime import datetime

logger = logging.getLogger(__name__)

# core/views.py


def get_time_slots(request):
    if request.method == 'POST':
        try:
            service = get_calendar_service()
            if not service:
                return JsonResponse({
                    'success': False,
                    'error': 'Could not connect to calendar service'
                })

            data = json.loads(request.body)
            date_str = data.get('date')
            
            if not date_str:
                return JsonResponse({'success': False, 'error': 'Date is required'})
            
            # Parse the date and create timezone-aware datetime objects
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # Verify if the date is a working day
            if date.weekday() >= 5:  # 5 = Saturday, 6 = Sunday
                return JsonResponse({
                    'success': False,
                    'error': 'Selected date is not a working day'
                })
            
            timezone = pytz.timezone(settings.TIME_ZONE) 
            work_start = timezone.localize(datetime.combine(date, datetime.strptime('10:00', '%H:%M').time()))
            work_end = timezone.localize(datetime.combine(date, datetime.strptime('20:00', '%H:%M').time()))
            
            events_result = service.events().list(
                calendarId=settings.GOOGLE_CALENDAR_ID,
                timeMin=work_start.isoformat(),
                timeMax=work_end.isoformat(),
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            # Calculate available slots considering partial hour conflicts
            available_slots = []
            current_time = work_start
            
            while current_time < work_end:
                is_available = True
                current_hour = current_time.hour
                
                for event in events_result.get('items', []):
                    if 'dateTime' in event.get('start', {}) and 'dateTime' in event.get('end', {}):
                        event_start = datetime.fromisoformat(event['start']['dateTime'].replace('Z', '+00:00'))
                        event_end = datetime.fromisoformat(event['end']['dateTime'].replace('Z', '+00:00'))
                        
                        event_start = event_start.astimezone(timezone)
                        event_end = event_end.astimezone(timezone)
                        
                        # Check if event overlaps with current hour
                        if (event_start.hour == current_hour or 
                            event_end.hour == current_hour or
                            (event_start.hour < current_hour and event_end.hour > current_hour) or
                            (event_start.hour == current_hour and event_start.minute <= 45) or
                            (event_end.hour == current_hour and event_end.minute >= 15)):
                            is_available = False
                            break
                
                if is_available:
                    available_slots.append(current_time.isoformat())
                
                current_time += timedelta(hours=1)
            
            return JsonResponse({
                'success': True,
                'free_slots': available_slots
            })
            
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e)
            })

    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })


def send_confirmation_email(user_email, appointment_time, event_link, first_name, last_name, interest, message):
    """Send confirmation emails to user and admin"""
    # User email
    user_subject = 'Confirmare Programare PsychED'
    user_message = f'''
    Bună {first_name},

    Îți mulțumim pentru programare. Întâlnirea ta a fost programată cu succes pentru data de {appointment_time.strftime("%d %B %Y")} la ora {appointment_time.strftime("%H:%M")}.

    În cazul în care vor exista modificări, te voi anunța.

    Link către eveniment: {event_link}

    Cu stimă,
    Laura Vaida
    '''

    # Admin email
    admin_subject = 'Nouă Programare PsychED'
    admin_message = f'''
    O nouă programare a fost creată:

    Nume: {first_name} {last_name}
    Email: {user_email}
    Data: {appointment_time.strftime("%d %B %Y")}
    Ora: {appointment_time.strftime("%H:%M")}
    Interes: {interest}
    Mesaj: {message}

    Link către eveniment: {event_link}
    '''

    # Send email to user
    send_mail(
        user_subject,
        user_message,
        settings.EMAIL_HOST_USER,
        [user_email],
        fail_silently=False
    )

    # Send email to admin
    send_mail(
        admin_subject,
        admin_message,
        settings.EMAIL_HOST_USER,
        [settings.EMAIL_HOST_USER],  # Send to admin email
        fail_silently=False
    )

def submit_time_slot(request):
    if request.method == 'POST':
        try:
            # Get form data
            date_str = request.POST.get('date')
            time_str = request.POST.get('time')
            email = request.POST.get('email')
            first_name = request.POST.get('firstName')
            last_name = request.POST.get('lastName')
            interest = request.POST.get('interest')
            message = request.POST.get('message')
            
            if not all([date_str, time_str, email, first_name, last_name]):
                return JsonResponse({
                    'success': False, 
                    'error': 'Missing required fields'
                }, status=400)
            
            # Create a unique submission key
            submission_key = f"submission_{email}_{date_str}_{time_str}"
            
            # Check if this submission already exists in cache
            if cache.get(submission_key):
                return JsonResponse({
                    'success': False, 
                    'error': 'This appointment has already been submitted'
                }, status=400)
            
            try:
                # Get timezone
                bucharest_tz = pytz.timezone('Europe/Bucharest')
                
                # Parse the datetime and localize it
                selected_datetime = datetime.fromisoformat(f"{date_str}T{time_str}")
                selected_datetime = bucharest_tz.localize(selected_datetime)
                end_datetime = selected_datetime + timedelta(hours=1)
                
                # Create calendar event
                event = create_calendar_event({
                    'summary': f'Consultație cu {first_name} {last_name}',
                    'description': f'Interes: {interest}\nMesaj: {message}',
                    'start': {
                        'dateTime': selected_datetime.isoformat(),
                        'timeZone': 'Europe/Bucharest'
                    },
                    'end': {
                        'dateTime': end_datetime.isoformat(),
                        'timeZone': 'Europe/Bucharest'
                    }
                })
                
                if event:
                    # Send confirmation emails
                    send_confirmation_email(
                        email, 
                        selected_datetime, 
                        event['htmlLink'],
                        first_name,
                        last_name,
                        interest,
                        message
                    )
                    
                    # Set cache after successful submission
                    cache.set(submission_key, True, 86400)  # 24 hours
                    return JsonResponse({'success': True, 'event': event['htmlLink']})
                else:
                    raise Exception('Failed to create calendar event')
                
            except Exception as e:
                cache.delete(submission_key)
                raise e
                
        except Exception as e:
            logger.error(f"Error in submit_time_slot: {str(e)}")
            return JsonResponse({
                'success': False, 
                'error': str(e)
            }, status=400)
            
    return JsonResponse({
        'success': False, 
        'error': 'Invalid request method'
    }, status=405)




class HomePageView(TemplateView):
    template_name = 'core/home-page.html'

def home_page(request):
    return render(request, 'core/home-page.html')
