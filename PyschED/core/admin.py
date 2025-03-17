from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'written_on', 'date')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'content']
    list_filter = ('date', 'written_on', 'author')

