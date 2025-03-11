# core/views.py

from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings
from django.views.generic import TemplateView
from django.http import JsonResponse
from .forms import ContactForm
import os 
from .calendar_integration import create_calendar_event
from datetime import datetime, timedelta
from django.shortcuts import redirect


class HomePageView(TemplateView):
    template_name = 'core/home-page.html'
    
    def post(self, request, *args, **kwargs):
        form = ContactForm(request.POST)
        if form.is_valid():
            try:
                # Get form data
                first_name = form.cleaned_data['firstName']
                last_name = form.cleaned_data['lastName']
                email = form.cleaned_data['email']
                interest = form.cleaned_data['interest']
                message = form.cleaned_data['message']
                
                # Create calendar event
                event_details = {
                    'summary': f'Consultation with {first_name} {last_name}',
                    'description': f'Interest: {interest}\nMessage: {message}',
                    'start': {
                        'dateTime': (datetime.now() + timedelta(days=1)).isoformat(),
                        'timeZone': 'Europe/Bucharest',
                    },
                    'end': {
                        'dateTime': (datetime.now() + timedelta(days=1, hours=1)).isoformat(),
                        'timeZone': 'Europe/Bucharest',
                    },
                    'attendees': [
                        {'email': email},
                        {'email': settings.EMAIL_HOST_USER},  # Your email
                    ],
                }
                
                # Create the calendar event
                calendar_event = create_calendar_event(event_details)
                
                # Send email to admin (myself)
                admin_subject = f'New Request: {interest}'
                admin_message = f"""
                Form Details:
                First Name: {first_name}
                Last Name: {last_name}
                Email: {email}
                Interest: {interest}
                Message: {message}
                
                Calendar Event: {calendar_event['htmlLink'] if calendar_event else 'Failed to create event'}
                """
                
                # Send email to user
                user_subject = 'PsychED: Mesaj Trimis'
                user_message = f"""
                Salut {first_name},

                Multumesc ca m-ai contactat, voi reveni cu o programare.
                
                {f"Calendar Event: {calendar_event['htmlLink']}" if calendar_event else ''}

                Cu drag,
                Francesca Raileanu
                """
                
                # Send email to admin
                send_mail(
                    admin_subject,
                    admin_message,
                    settings.EMAIL_HOST_USER,
                    [settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )
                
                # Send email to user
                send_mail(
                    user_subject,
                    user_message,
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                )
                
                return JsonResponse({
                    'success': True,
                    'calendar_event': calendar_event['htmlLink'] if calendar_event else None
                })
                
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'error': str(e)
                })
                
        return JsonResponse({
            'success': False,
            'errors': form.errors
        })

def home_page(request):
    return render(request, 'core/home-page.html')
