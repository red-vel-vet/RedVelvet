import pandas as pd
from django.core.management.base import BaseCommand
from api.models import QuizCategory, QuizQuestion

class Command(BaseCommand):
    help = 'Load quiz categories and questions from Excel files'

    def add_arguments(self, parser):
        parser.add_argument('category_file', type=str, help='The path to the category Excel file')
        parser.add_argument('question_file', type=str, help='The path to the question Excel file')

    def handle(self, *args, **kwargs):
        category_file = kwargs['category_file']
        question_file = kwargs['question_file']
        self.stdout.write(f"Loading categories from {category_file}")
        self.stdout.write(f"Loading questions from {question_file}")

        try:
            # Load categories
            category_df = pd.read_excel(category_file)
            categories = {}
            for _, row in category_df.iterrows():
                category, created = QuizCategory.objects.get_or_create(
                    name=row['Category'],  # Map 'Category' column to 'name' field
                    defaults={'description': row['Description']}  # Map 'Description' column to 'description' field
                )
                categories[row['Category']] = category
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Successfully created category: {category.name}"))
                else:
                    self.stdout.write(self.style.WARNING(f"Category {category.name} already exists"))

            # Load questions
            question_df = pd.read_excel(question_file)
            for _, row in question_df.iterrows():
                category_name = row['Category']  # Map 'Category' column to 'category' field
                if category_name in categories:
                    QuizQuestion.objects.get_or_create(
                        text=row['Activity'],  # Map 'Activity' column to 'text' field
                        category=categories[category_name]  # Use the category object
                    )
                    self.stdout.write(self.style.SUCCESS(f"Successfully created question: {row['Activity']}"))
                else:
                    self.stdout.write(self.style.ERROR(f"Category {category_name} not found for question: {row['Activity']}"))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error loading data: {e}"))