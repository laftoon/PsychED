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
from django.views.generic import ListView, DetailView
from .models import BlogPost

logger = logging.getLogger(__name__)

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
            
            # Parse the date in UTC
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # Create UTC times for work hours (9:00-18:00 Madrid time)
            madrid_tz = pytz.timezone('Europe/Madrid')
            utc_tz = pytz.UTC
            
            # Convert work hours to UTC
            work_start = madrid_tz.localize(datetime.combine(date, datetime.strptime('11:00', '%H:%M').time()))
            work_end = madrid_tz.localize(datetime.combine(date, datetime.strptime('20:00', '%H:%M').time()))
            
            # Convert to UTC for API call
            work_start_utc = work_start.astimezone(utc_tz)
            work_end_utc = work_end.astimezone(utc_tz)
            
            events_result = service.events().list(
                calendarId=settings.GOOGLE_CALENDAR_ID,
                timeMin=work_start_utc.isoformat(),
                timeMax=work_end_utc.isoformat(),
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            # Calculate available slots in UTC
            available_slots = []
            current_time = work_start_utc
            
            while current_time <= work_end_utc - timedelta(minutes=50):
                is_available = True
                slot_end = current_time + timedelta(minutes=50)
                
                for event in events_result.get('items', []):
                    event_start = datetime.fromisoformat(event['start']['dateTime'].replace('Z', '+00:00'))
                    event_end = datetime.fromisoformat(event['end']['dateTime'].replace('Z', '+00:00'))
                    
                    # Compare in UTC
                    if (event_start < slot_end and event_end > current_time):
                        is_available = False
                        break
                
                if is_available:
                    available_slots.append(current_time.isoformat())
                
                current_time += timedelta(hours=1)
            
            return JsonResponse({
                'success': True,
                'free_slots': available_slots,
                'timezone': 'UTC'
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
    try:
        from django.core.mail import send_mail
        
        # User email
        user_subject = 'Confirmare Programare PsychED'
        user_message = f'''
        Bună {first_name},

        Îți mulțumesc pentru interes! 
        Întâlnirea ta pe data de {appointment_time.strftime("%d %B %Y")} la ora {appointment_time.strftime("%H:%M")} se va confirma atunci cand vei primi o invitatie Google Calendar!
        
        În cazul în care vor exista modificări, te voi anunța pe adresa de email: {user_email}.


        Cu drag,
        Francesca Raileanu
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
        ⚠️ NU UITA SĂ INVIȚI: {user_email} ⚠️
        '''

        # Send emails using send_mail
        send_mail(
            user_subject,
            user_message,
            settings.EMAIL_HOST_USER,
            [user_email],
            fail_silently=False,
        )
        
        send_mail(
            admin_subject,
            admin_message,
            settings.EMAIL_HOST_USER,
            [settings.EMAIL_HOST_USER],
            fail_silently=False,
        )

    except Exception as e:
        logger.error(f"Error sending confirmation emails: {str(e)}")
        raise Exception("Failed to send confirmation emails")



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
            
            if cache.get(submission_key):
                return JsonResponse({
                    'success': False, 
                    'error': 'This appointment has already been submitted'
                }, status=400)
            
            try:
                # Parse the datetime in Madrid timezone (UTC+1)
                madrid_tz = pytz.timezone('Europe/Madrid')
                selected_datetime = madrid_tz.localize(
                    datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
                )
                
                # Convert to UTC for storage
                utc_datetime = selected_datetime.astimezone(pytz.UTC)
                
                # Create calendar event
                event = create_calendar_event({
                    'summary': f'Consultație cu {first_name} {last_name}',
                    'description': f'Interes: {interest}\nMesaj: {message}',
                    'start': {
                        'dateTime': utc_datetime.isoformat(),
                        'timeZone': 'UTC'
                    },
                    'end': {
                        'dateTime': (utc_datetime + timedelta(minutes=50)).isoformat(),
                        'timeZone': 'UTC'
                    },
                    'user_email': email
                })
                
                if event:
                    send_confirmation_email(
                        email, 
                        selected_datetime,  # Use Madrid time for email
                        event['htmlLink'],
                        first_name,
                        last_name,
                        interest,
                        message
                    )
                    
                    cache.set(submission_key, True, 86400)
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

class AboutPageView(TemplateView):
    template_name = 'core/about-page.html'

class ServicesPageView(TemplateView):
    template_name = 'core/services-page.html'

class BlogPageView(ListView):
    model = BlogPost
    template_name = 'core/blog-page.html'
    context_object_name = 'blog_posts'
    ordering = ['-date']
    paginate_by = 10  # Optional: adds pagination, showing 10 posts per page

class BlogDetailView(DetailView):
    model = BlogPost
    template_name = 'core/blog-detail.html'
    context_object_name = 'post'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # You can add additional context data here if needed
        return context



def test_timezone_slots():
    # Test times for different zones
    madrid_tz = pytz.timezone('Europe/Madrid')
    ny_tz = pytz.timezone('America/New_York')
    tokyo_tz = pytz.timezone('Asia/Tokyo')
    
    # Create a test date
    test_date = datetime.now().date()
    
    # Test Madrid 9:00 (working day start)
    madrid_start = madrid_tz.localize(datetime.combine(test_date, datetime.strptime('09:00', '%H:%M').time()))
    
    print(f"Madrid start: {madrid_start}")
    print(f"New York time: {madrid_start.astimezone(ny_tz)}")
    print(f"Tokyo time: {madrid_start.astimezone(tokyo_tz)}")
    print(f"UTC time: {madrid_start.astimezone(pytz.UTC)}")
    
    # Test Madrid 18:00 (working day end)
    madrid_end = madrid_tz.localize(datetime.combine(test_date, datetime.strptime('18:00', '%H:%M').time()))
    
    print(f"\nMadrid end: {madrid_end}")
    print(f"New York time: {madrid_end.astimezone(ny_tz)}")
    print(f"Tokyo time: {madrid_end.astimezone(tokyo_tz)}")
    print(f"UTC time: {madrid_end.astimezone(pytz.UTC)}")

