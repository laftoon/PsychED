from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages  # Add this import

def home_page(request):
    if request.method == 'POST':
        # Get form data
        first_name = request.POST.get('firstName')
        last_name = request.POST.get('lastName')
        email = request.POST.get('email')
        
        try:
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
            
            messages.success(request, 'Thank you for your message. We will contact you soon!')
            
        except Exception as e:
            print(f"Error sending email: {str(e)}")  # For debugging
            messages.error(request, 'There was an error sending your message. Please try again later.')
            
        return redirect('home')
        
    return render(request, 'core/home-page.html')
