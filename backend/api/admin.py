from django.contrib import admin
from .models import EmailVerificationToken, QuizCategory, QuizQuestion

admin.site.register(EmailVerificationToken)

@admin.register(QuizCategory)
class QuizCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name',)

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'category', 'created_at', 'updated_at')
    search_fields = ('text', 'category__name')
    list_filter = ('category',)