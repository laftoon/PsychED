# core/tests.py
from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.core import mail
from django.core.cache import cache
from datetime import datetime, timedelta
import json
import pytz
from unittest.mock import patch

class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.timezone = pytz.timezone('Europe/Bucharest')
        cache.clear()

    def tearDown(self):
        cache.clear()

    def test_home_page_view(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'core/home-page.html')
        self.assertContains(response, 'PsychED Lab')

    def test_about_page_view(self):
        response = self.client.get(reverse('about'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'core/about-page.html')

    @patch('core.views.get_calendar_service')
    def test_get_time_slots(self, mock_calendar_service):
        # Mock calendar service response
        mock_calendar_service.return_value.events().list().execute.return_value = {
            'items': []
        }

        data = {
            'date': (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        }
        response = self.client.post(
            reverse('get_time_slots'),
            json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('free_slots', response_data)

    @patch('core.views.create_calendar_event')
    def test_submit_time_slot(self, mock_create_event):
        # Mock successful event creation
        mock_create_event.return_value = {'htmlLink': 'http://test.com/event'}

        data = {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'time': '10:00:00',
            'email': 'test@example.com',
            'firstName': 'Test',
            'lastName': 'User',
            'interest': 'Terapie Individuală',
            'message': 'Test message'
        }
        response = self.client.post(reverse('submit_time_slot'), data)
        self.assertEqual(response.status_code, 200)
        
        # Test email sending
        self.assertEqual(len(mail.outbox), 2)  # 2 emails: user confirmation and admin notification
        
        # Test duplicate submission prevention
        response = self.client.post(reverse('submit_time_slot'), data)
        self.assertEqual(response.status_code, 400)

class FormTests(TestCase):
    def test_contact_form_valid(self):
        form_data = {
            'firstName': 'Test',
            'lastName': 'User',
            'email': 'test@example.com',
            'interest': 'Terapie Individuală',
            'message': 'Test message'
        }
        from core.forms import ContactForm
        form = ContactForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_contact_form_invalid(self):
        form_data = {
            'firstName': '',  # Empty required field
            'lastName': 'User',
            'email': 'invalid-email',  # Invalid email
            'interest': 'Terapie Individuală',
            'message': 'Test message'
        }
        from core.forms import ContactForm
        form = ContactForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('firstName', form.errors)
        self.assertIn('email', form.errors)

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class EmailTests(TestCase):
    def test_confirmation_email_sending(self):
        from core.views import send_confirmation_email
        
        test_data = {
            'user_email': 'test@example.com',
            'appointment_time': datetime.now(),
            'event_link': 'http://test.com/event',
            'first_name': 'Test',
            'last_name': 'User',
            'interest': 'Terapie Individuală',
            'message': 'Test message'
        }
        
        send_confirmation_email(**test_data)
        
        self.assertEqual(len(mail.outbox), 2)
        self.assertIn('Confirmare Programare', mail.outbox[0].subject)
        self.assertIn('Nouă Programare', mail.outbox[1].subject)
