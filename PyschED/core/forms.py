# core/forms.py
from django import forms

class ContactForm(forms.Form):
    firstName = forms.CharField()
    lastName = forms.CharField()
    email = forms.EmailField()
    interest = forms.CharField()
    message = forms.CharField(widget=forms.Textarea)
