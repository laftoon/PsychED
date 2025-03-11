from django import forms

class ContactForm(forms.Form):
    firstName = forms.CharField(max_length=100)
    lastName = forms.CharField(max_length=100)
    email = forms.EmailField()

    def clean_email(self):
        email = self.cleaned_data['email']
        # Add custom email validation if needed
        return email
