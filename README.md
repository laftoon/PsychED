# PsychED Lab

## Overview

PsychED Lab is a professional psychotherapy platform built with Django that serves as both a portfolio and client management system. The platform features appointment scheduling with Google Calendar integration, blog functionality, and automated email notifications.

## Features

- **Appointment Management**
  - Google Calendar integration
  - Real-time availability checking
  - Automated email notifications
  - Smart scheduling system
- **Blog System**
  - Content management through Django admin
  - SEO-friendly URLs
  - Rich text editing
- **Responsive Design**
  - Mobile view integration
  - Modern UI/UX
  - Cross-browser compatibility
- **Security Measures** 
  - Includes CSRF protection, secure session handling, XSS prevention, and detailed environment variable configuration.
- **Cookie Consent**
  - Compliant with EU standards, ensuring users' privacy and consent for cookies are properly managed.
- **Translation Features**
  - Utilizes Django’s ```bash gettext ``` for dynamic content translation, enhancing accessibility for users in different languages.

## Tech Stack

- **Backend**: Python 3.8+, Django 5.0
- **Frontend**: HTML5, CSS3, JavaScript
- **Database**: SQLite
- **APIs**: Google Calendar API
- **Email**: SMTP Integration
- **CSS Processing**: Django Compressor

## Project Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/PsychED.git
   cd PsychED

   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt

   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:

```
SECRET_KEY=your_secret_key
DEBUG=True
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_HOST_USER=your_email_user
EMAIL_HOST_PASSWORD=your_email_password
EMAIL_USE_TLS=True
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key
```

4. **Set up Google Calendar:**

   - Create a Google Cloud Project
   - Enable Google Calendar API
   - Create a service account
   - Download credentials as `calendar-key.json`
   - Place in project root

5. **Run migrations:**

   ```bash
   python manage.py migrate

   ```

6. **Create a superuser: (optional)**

   ```bash
   python manage.py createsuperuser

   ```

7. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

## Project Structure
```
PsychED/
├── core/ # Main application
│ ├── static/ # Static files
│ ├── templates/ # HTML templates
│ ├── views.py # View controllers
│ └── models.py # Database models
├── PyschED/ # Project configuration
├── templates/ # Global templates
└── manage.py # Django management script
```

## Security

- CSRF protection
- Secure session handling
- Environment variable configuration
- XSS prevention

## Contributing

This is a private project. Please contact the repository owner for contribution guidelines.

## License

This project is proprietary. All rights reserved.

## Contact

For more information or support:

**Email**: lauravaida01@gmail.com
