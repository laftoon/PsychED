# core/models.py
from django.db import models
from django.utils.text import slugify

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField()
    snippet = models.TextField(max_length=500)
    author = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)  # Created date
    written_on = models.DateField(null=True, blank=True)  # Written date
    
    class Meta:
        ordering = ['-date']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
