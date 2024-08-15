# Generated by Django 5.0.6 on 2024-08-08 00:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0012_quizcategory_quizquestion_userresponse"),
    ]

    operations = [
        migrations.AlterField(
            model_name="quizquestion",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.quizcategory"
            ),
        ),
        migrations.DeleteModel(name="UserResponse",),
    ]
