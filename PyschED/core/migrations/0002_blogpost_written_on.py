# Generated by Django 5.1.7 on 2025-03-17 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="blogpost",
            name="written_on",
            field=models.DateField(blank=True, null=True),
        ),
    ]
