class EmailService:
    def __init__(self, config):
        self.config = config
    
    def send_contact_email(self, contact_data):
        # Email sending logic using Django's send_mail
        pass

class ContactService:
    def __init__(self, email_service):
        self.email_service = email_service
    
    def process_contact_form(self, form_data):
        # Contact form processing logic
        self.email_service.send_contact_email(form_data)
