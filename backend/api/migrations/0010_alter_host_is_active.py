# Generated by Django 5.0.6 on 2024-07-24 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0009_alter_userprofile_first_name_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="host",
            name="is_active",
            field=models.BooleanField(blank=True, default=True),
        ),
    ]
