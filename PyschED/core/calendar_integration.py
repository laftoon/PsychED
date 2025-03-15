# core/calendar_integration.py
from google.oauth2 import service_account
from googleapiclient.discovery import build
from django.conf import settings
import logging
import pytz
from datetime import datetime

logger = logging.getLogger(__name__)

def get_calendar_service():
    """
    Get a Google Calendar service instance using service account
    """
    try:
        credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_CALENDAR_SERVICE_ACCOUNT_FILE,
            scopes=['https://www.googleapis.com/auth/calendar']
        )
        
        service = build('calendar', 'v3', credentials=credentials)
        return service
    except Exception as e:
        logger.error(f"Error creating calendar service: {str(e)}")
        raise Exception("Could not connect to calendar service")

def create_calendar_event(event_details):
    """
    Create a calendar event with a reminder to invite the user
    """
    try:
        service = get_calendar_service()
        if not service:
            raise Exception("Calendar service not available")
            
        # Get the timezone
        bucharest_tz = pytz.timezone('Europe/Bucharest')
        
        # Parse and localize the datetime strings
        start_time = datetime.fromisoformat(event_details['start']['dateTime'])
        end_time = datetime.fromisoformat(event_details['end']['dateTime'])
        
        if start_time.tzinfo is None:
            start_time = bucharest_tz.localize(start_time)
        if end_time.tzinfo is None:
            end_time = bucharest_tz.localize(end_time)
            
        # Update event details with properly formatted times
        event_details['start']['dateTime'] = start_time.isoformat()
        event_details['end']['dateTime'] = end_time.isoformat()
        
        # Add reminder to invite user in the description
        user_email = event_details.get('user_email', '')
        original_description = event_details.get('description', '')
        event_details['description'] = f"⚠️ NU UITA SĂ INVIȚI: {user_email} ⚠️\n\n{original_description}"
        
        # Check for existing events in the time slot
        events_result = service.events().list(
            calendarId=settings.GOOGLE_CALENDAR_ID,
            timeMin=start_time.isoformat(),
            timeMax=end_time.isoformat(),
            singleEvents=True
        ).execute()
        
        existing_events = events_result.get('items', [])
        if existing_events:
            raise Exception("This time slot is no longer available")
            
        event = service.events().insert(
            calendarId=settings.GOOGLE_CALENDAR_ID,
            body=event_details,
            sendUpdates='none'
        ).execute()
        
        if not event:
            raise Exception("Failed to create calendar event")
            
        return event
    except Exception as e:
        logger.error(f"Error creating calendar event: {str(e)}")
        raise Exception(str(e))

