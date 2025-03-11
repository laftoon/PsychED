# core/views.py

from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
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
                interest = form.cleaned_data['interest']
                message = form.cleaned_data['message']
                
                # Send email to admin (myself)
                admin_subject = f'New Request: {interest}'
                admin_message = f"""
                Form Details:
                First Name: {first_name}
                Last Name: {last_name}
                Email: {email}
                Interest: {interest}
                Message: {message}
                """
                
                # Send email to user
                user_subject = 'PsychED: Mesaj Trimis'
                user_message = f"""
                Salut {first_name},

                Multumesc ca m-ai contactat, voi reveni cu o programare.

                Cu drag,
                Francesca Raileanu
                """
                
                # Send email to admin
                send_mail(
                    admin_subject,
                    admin_message,
                    settings.EMAIL_HOST_USER,
                    [settings.EMAIL_HOST_USER],  # Your email address
                    fail_silently=False,
                )
                
                # Send email to user
                send_mail(
                    user_subject,
                    user_message,
                    settings.EMAIL_HOST_USER,
                    [email],  # User's email address
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
