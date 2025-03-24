# PyschED/core/urls.py
from django.urls import path
from . import views  
from .views import HomePageView, AboutPageView, ServicesPageView, BlogPageView, BlogDetailView, get_time_slots, submit_time_slot, privacy_policy

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('privacy-policy/', privacy_policy, name='privacy-policy'),
    path('despre-mine/', AboutPageView.as_view(), name='about'),
    path('servicii/', ServicesPageView.as_view(), name='services'),
    path('blog/', BlogPageView.as_view(), name='blog'),
    path('get_time_slots/', get_time_slots, name='get_time_slots'),
    path('submit_time_slot/', submit_time_slot, name='submit_time_slot'),
    path('blog/<slug:slug>/', BlogDetailView.as_view(), name='blog_detail'),
]

