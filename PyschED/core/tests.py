from django.test import TestCase
from unittest import mock
from core.calendar_integration import create_calendar_event  # Adjusted import path

class CalendarIntegrationTests(TestCase):
    @mock.patch('core.calendar_integration.get_calendar_service')
    def test_create_calendar_event_success(self, mock_service):
        # Setup mock
        mock_service.return_value.events.return_value.insert.return_value.execute.return_value = {
            'id': '12345',
            'htmlLink': 'http://127.0.0.1:8000/event/12345'
        }

        # Define test event details
        event_details = {
            'summary': 'Consultation Session',
            'description': 'A session to discuss project details',
            'start': {'dateTime': '2023-01-01T10:00:00-05:00', 'timeZone': 'America/New_York'},
            'end': {'dateTime': '2023-01-01T11:00:00-05:00', 'timeZone': 'America/New_York'},
            'attendees': [{'email': 'lauravaida01@gmail.com'}],
        }

        # Call the function under test
        event = create_calendar_event(event_details)

        # Asserts
        self.assertIsNotNone(event)
        self.assertEqual(event['id'], '12345')
        self.assertIn('http://127.0.0.1:8000/event/12345', event['htmlLink'])

    @mock.patch('core.calendar_integration.get_calendar_service')
    def test_create_calendar_event_failure(self, mock_service):
        # Setup mock to raise an exception
        mock_service.return_value.events.return_value.insert.return_value.execute.side_effect = Exception("API Error")

        # Define test event details
        event_details = {
            'summary': 'Failed Event',
            'start': {'dateTime': '2023-01-01T10:00:00-05:00', 'timeZone': 'America/New_York'},
            'end': {'dateTime': '2023-01-01T11:00:00-05:00', 'timeZone': 'America/New_York'},
            'attendees': [{'email': 'lauravaida01@gmail.com'}],
        }

        # Call the function under test
        event = create_calendar_event(event_details)

        # Asserts
        self.assertIsNone(event)
