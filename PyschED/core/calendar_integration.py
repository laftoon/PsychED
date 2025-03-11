# core/calendar_integration.py
from google.oauth2 import service_account
from googleapiclient.discovery import build
from django.conf import settings

def get_calendar_service():
    """
    Get a Google Calendar service instance using service account
    """
    SCOPES = ['https://www.googleapis.com/auth/calendar']
    
    credentials = service_account.Credentials.from_service_account_file(
        settings.GOOGLE_CALENDAR_SERVICE_ACCOUNT_FILE, 
        scopes=SCOPES
    )
    
    # Delegate to your personal account
    delegated_credentials = credentials.with_subject(settings.GOOGLE_CALENDAR_USER_EMAIL)
    
    return build('calendar', 'v3', credentials=delegated_credentials)

def create_calendar_event(event_details):
    """
    Create a calendar event
    """
    try:
        service = get_calendar_service()
        event = service.events().insert(
            calendarId='primary',
            body=event_details,
            sendUpdates='all'  # This will send email notifications to attendees
        ).execute()
        return event
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
