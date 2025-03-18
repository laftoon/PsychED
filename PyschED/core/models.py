# core/models.py
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

class BlogPost(models.Model):
    title_ro = models.CharField(max_length=200, verbose_name=_('Title (Romanian)'))
    title_en = models.CharField(max_length=200, verbose_name=_('Title (English)'), blank=True, null=True)
    title_es = models.CharField(max_length=200, verbose_name=_('Title (Spanish)'), blank=True, null=True)
    
    content_ro = models.TextField(verbose_name=_('Content (Romanian)'))
    content_en = models.TextField(verbose_name=_('Content (English)'), blank=True, null=True)
    content_es = models.TextField(verbose_name=_('Content (Spanish)'), blank=True, null=True)
    
    snippet_ro = models.TextField(max_length=500, verbose_name=_('Snippet (Romanian)'))
    snippet_en = models.TextField(max_length=500, verbose_name=_('Snippet (English)'), blank=True, null=True)
    snippet_es = models.TextField(max_length=500, verbose_name=_('Snippet (Spanish)'), blank=True, null=True)
    
    slug = models.SlugField(unique=True, blank=True)
    author = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    written_on = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-date']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title_ro)
        
        # Set default translations if not provided
        if not self.title_en:
            self.title_en = self.title_ro
        if not self.title_es:
            self.title_es = self.title_ro
            
        if not self.content_en:
            self.content_en = self.content_ro
        if not self.content_es:
            self.content_es = self.content_ro
            
        if not self.snippet_en:
            self.snippet_en = self.snippet_ro
        if not self.snippet_es:
            self.snippet_es = self.snippet_ro
            
        super().save(*args, **kwargs)

    def get_title(self, language=None):
        if not language:
            language = 'ro'
        return getattr(self, f'title_{language}') or self.title_ro

    def get_content(self, language=None):
        if not language:
            language = 'ro'
        return getattr(self, f'content_{language}') or self.content_ro

    def get_snippet(self, language=None):
        if not language:
            language = 'ro'
        return getattr(self, f'snippet_{language}') or self.snippet_ro

    def __str__(self):
        return self.title_ro
