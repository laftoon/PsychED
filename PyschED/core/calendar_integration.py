# core/calendar_integration.py
from google.oauth2 import service_account
from googleapiclient.discovery import build
from django.conf import settings
import logging
import pytz
from datetime import datetime, timedelta

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
    try:
        service = get_calendar_service()
        if not service:
            raise Exception("Calendar service not available")
            
        # Parse the datetime strings and ensure UTC timezone
        start_time = datetime.fromisoformat(event_details['start']['dateTime'])
        if start_time.tzinfo is None:
            start_time = pytz.UTC.localize(start_time)
        else:
            start_time = start_time.astimezone(pytz.UTC)
            
        end_time = start_time + timedelta(minutes=50)
        
        # Debug logging
        logger.info(f"Creating event for: {start_time} - {end_time} (UTC)")
        madrid_tz = pytz.timezone('Europe/Madrid')
        madrid_time = start_time.astimezone(madrid_tz)
        logger.info(f"Creating event in Madrid time: {madrid_time}")
        logger.info(f"Working hours: 11:00-20:00 Madrid time")
        
        # Verify if time is within working hours
        hour = madrid_time.hour
        if hour < 11 or hour >= 19:
            raise Exception("Programările se pot face doar între orele 11:00-19:00 (GMT+1)")

        # Check for existing events
        events_result = service.events().list(
            calendarId=settings.GOOGLE_CALENDAR_ID,
            timeMin=(start_time - timedelta(minutes=1)).isoformat(),
            timeMax=(end_time + timedelta(minutes=1)).isoformat(),
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        
        existing_events = events_result.get('items', [])
        logger.info(f"Found {len(existing_events)} existing events")
        
        for event in existing_events:
            event_start = datetime.fromisoformat(event['start']['dateTime'].replace('Z', '+00:00'))
            event_end = datetime.fromisoformat(event['end']['dateTime'].replace('Z', '+00:00'))
            
            # Ensure UTC timezone for comparison
            event_start = event_start.astimezone(pytz.UTC)
            event_end = event_end.astimezone(pytz.UTC)
            
            logger.info(f"Checking overlap with existing event: {event_start} - {event_end}")
            
            # Check for overlap in UTC time
            if (max(start_time, event_start) < min(end_time, event_end)):
                logger.info(f"Overlap detected with event: {event['summary']}")
                logger.info(f"Requested slot (UTC): {start_time} - {end_time}")
                logger.info(f"Existing event (UTC): {event_start} - {event_end}")
                raise Exception("This time slot is no longer available")
        
        # Create the event
        event_body = {
            'summary': event_details['summary'],
            'description': event_details['description'],
            'start': {
                'dateTime': start_time.isoformat(),
                'timeZone': 'UTC'
            },
            'end': {
                'dateTime': end_time.isoformat(),
                'timeZone': 'UTC'
            }
        }
        
        event = service.events().insert(
            calendarId=settings.GOOGLE_CALENDAR_ID,
            body=event_body,
            sendUpdates='none'
        ).execute()
        
        logger.info(f"Successfully created event: {start_time} - {end_time}")
        return event
        
    except Exception as e:
        logger.error(f"Error creating calendar event: {str(e)}")
        raise Exception(str(e))
