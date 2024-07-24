# Generated by Django 5.0.6 on 2024-07-24 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0010_alter_host_is_active"),
    ]

    operations = [
        migrations.AlterField(
            model_name="host",
            name="created_date",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name="host",
            name="is_active",
            field=models.BooleanField(default=True, null=True),
        ),
        migrations.AlterField(
            model_name="host",
            name="updated_date",
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]
