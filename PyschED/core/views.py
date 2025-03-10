from django.shortcuts import render

def home_page(request):
    return render(request, 'core/home-page.html')

