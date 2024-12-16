# Generated by Django 5.0.6 on 2024-12-16 14:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0019_userprofile_display_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="host",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="member",
            name="blocked_reason",
            field=models.TextField(default=list),
        ),
        migrations.AlterField(
            model_name="member", name="comments", field=models.TextField(default=list),
        ),
        migrations.AlterField(
            model_name="member",
            name="rejection_reason",
            field=models.TextField(default=list),
        ),
    ]
