# Generated by Django 5.0.6 on 2024-09-24 01:04

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0017_alter_quizquestion_quiz_type"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Member",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("Applied", "Applied"),
                            ("Approved", "Approved"),
                            ("Rejected", "Rejected"),
                            ("Dormant", "Dormant"),
                        ],
                        default="Applied",
                        max_length=10,
                    ),
                ),
                ("rejection_count", models.IntegerField(default=0)),
                ("blocked", models.BooleanField(default=False)),
                ("blocked_count", models.IntegerField(default=0)),
                ("application_date", models.DateTimeField(auto_now_add=True)),
                ("approval_date", models.DateTimeField(blank=True, null=True)),
                ("active_date", models.DateTimeField(blank=True, null=True)),
                ("expiration_date", models.DateTimeField(blank=True, null=True)),
                ("block_date", models.DateTimeField(blank=True, null=True)),
                ("rejection_reason", models.TextField(default="[]")),
                ("blocked_reason", models.TextField(default="[]")),
                ("comments", models.TextField(default="[]")),
                ("is_active", models.BooleanField(default=False)),
                ("created_date", models.DateTimeField(auto_now_add=True)),
                ("updated_date", models.DateTimeField(auto_now=True)),
                (
                    "host",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="members",
                        to="api.host",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="memberships",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
