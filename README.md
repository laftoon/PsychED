# PsychED

## Description
PsychED is a sophisticated platform designed for a professional psychotherapist to display her services, manage appointments, and serve as an online curriculum vitae. This website facilitates client interactions through an intuitive appointment booking system and will eventually host a blog to share insights and updates. With features like calendar integration and email notifications, PsychED aims to streamline the management of psychotherapy sessions and enhance the accessibility of mental health services.

## Features
- **Appointment Booking**: Allows clients to view available times and book appointments directly through the website.
- **Calendar Integration**: Syncs with Google Calendar to manage appointments and avoid scheduling conflicts. Uses a service account for authentication; JSON credentials are managed by the developer and need to be set up individually for each local machine.
- **Email Notifications**: Sends automatic confirmation emails to both the psychotherapist and the client upon booking.
- **Blog**: A planned feature to provide valuable content and updates from the psychotherapist.
- **Responsive Design**: Ensures a seamless experience across various devices and screen sizes.

## Technology Stack
- **Frontend**: HTML5, CSS3 (with compression), JavaScript
- **Backend**: Django (Python)
- **Others**: CSS Compression for optimized performance

## Technologies Used
- **HTML5**
- **CSS3** with compression for faster load times
- **JavaScript** for interactive elements
- **Django framework** for robust backend functionality
- **Python** for server-side logic

## Setup
Currently, PsychED is under development and not yet deployed. The setup steps will be updated once the site is ready for deployment. 
To run the calendar integration features:
1. You will need to set up your own Google service account and download the corresponding JSON credentials.
2. Place your JSON credentials in the expected directory and update the settings file to reflect the path to your credentials file.

## Usage
To run a local development server:
1. Ensure Python and Django are installed on your machine.
2. Navigate to the project directory.
3. Run `python manage.py runserver` to start the server.
4. Open `localhost:8000` in your web browser to view the site.

## Contact Information
For more information, please contact me at [lauravaida01@gmail.com](mailto:lauravaida01@gmail.com).
