from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from django.views.i18n import set_language
from core.views import get_time_slots, submit_time_slot

urlpatterns = [
    path('i18n/setlang/', set_language, name='set_language'),
    path('admin/', admin.site.urls),
    # Add non-prefixed API endpoints
    path('get_time_slots/', get_time_slots, name='get_time_slots_api'),
    path('submit_time_slot/', submit_time_slot, name='submit_time_slot_api'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += i18n_patterns(
    path('', include('core.urls')),
    prefix_default_language=True
)
