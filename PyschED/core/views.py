# core/views.py

from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from django.views.generic import TemplateView
from django.http import JsonResponse
from .forms import ContactForm

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
                
                # Send email to admin
                admin_subject = 'New Contact Form Submission'
                admin_message = f"""
                New contact form submission received:
                Name: {first_name} {last_name}
                Email: {email}
                """
                
                # Send email to user
                user_subject = 'Thank you for contacting PsychED Lab'
                user_message = f"""
                Dear {first_name},

                Thank you for reaching out to PsychED Lab. We have received your message and will get back to you shortly.

                Best regards,
                PsychED Lab Team
                """
                
                # Send emails using settings directly
                send_mail(
                    admin_subject,
                    admin_message,
                    settings.EMAIL_HOST_USER,
                    [settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )
                
                send_mail(
                    user_subject,
                    user_message,
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                )
                
                return JsonResponse({'success': True})
                
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
