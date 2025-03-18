# core/admin.py
from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title_ro', 'author', 'written_on', 'date')
    prepopulated_fields = {'slug': ('title_ro',)}
    search_fields = ['title_ro', 'title_en', 'title_es', 'content_ro', 'content_en', 'content_es']
    list_filter = ('date', 'written_on', 'author')
    fieldsets = (
        ('Romanian Content', {
            'fields': ('title_ro', 'content_ro', 'snippet_ro')
        }),
        ('English Content', {
            'fields': ('title_en', 'content_en', 'snippet_en')
        }),
        ('Spanish Content', {
            'fields': ('title_es', 'content_es', 'snippet_es')
        }),
        ('Other Information', {
            'fields': ('slug', 'author', 'written_on')
        }),
    )
