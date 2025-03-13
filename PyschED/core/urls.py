# PyschED/core/urls.py
from django.urls import path
from .views import HomePageView, AboutPageView, get_time_slots, submit_time_slot

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('despre-mine/', AboutPageView.as_view(), name='about'),
    path('get_time_slots/', get_time_slots, name='get_time_slots'),
    path('submit_time_slot/', submit_time_slot, name='submit_time_slot'),
]
