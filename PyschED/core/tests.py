from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
from .calendar_integration import get_calendar_service
import json

@patch('core.views.get_calendar_service')
def test_get_time_slots(self, mock_get_calendar_service):
    # Setup the mock as before
    service = mock_get_calendar_service.return_value
    service.events.return_value.list.return_value.execute.return_value = {
        'items': [
            {'start': {'dateTime': '2025-03-15T10:00:00Z'}, 'end': {'dateTime': '2025-03-15T11:00:00Z'}},
            {'start': {'dateTime': '2025-03-15T12:00:00Z'}, 'end': {'dateTime': '2025-03-15T13:00:00Z'}}
        ]
    }

    # Define the data to send to the endpoint
    data = {
        'date': '2025-03-15'
    }

    # Make a POST request to the get_time_slots endpoint
    response = self.client.post(reverse('get_time_slots'), data)

    # Print response data for debugging
    response_data = json.loads(response.content)
    print("Response Data:", response_data)

    # Assertions to check if the response data is as expected
    self.assertEqual(response.status_code, 200)
    self.assertIn('success', response_data)
    self.assertTrue(response_data['success'])
    self.assertIn('free_slots', response_data)
    self.assertEqual(len(response_data['free_slots']), 2)  # Expecting 2 free slots
