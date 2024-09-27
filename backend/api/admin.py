from django.contrib import admin
# from django.contrib.auth.models import User
from .models import (
    EmailVerificationToken,
    QuizCategory,
    QuizQuestion,
    Host,
    HostApplication,
    Membership,
    Event,
    Price,
    UserProfile,
    Feedback,
    UserResponse,
    Member
)

admin.site.register(EmailVerificationToken)

@admin.register(QuizCategory)
class QuizCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name',)

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'category', 'quiz_type', 'created_at', 'updated_at')
    search_fields = ('text', 'category__name')
    list_filter = ('category',)

# Register the remaining models
@admin.register(Host)
class HostAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_date', 'is_active')
    search_fields = ('name', 'email')
    list_filter = ('is_active', 'created_date')

@admin.register(HostApplication)
class HostApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'host', 'status')
    search_fields = ('user__username', 'host__name')
    list_filter = ('status',)

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ('host', 'tier', 'price', 'duration', 'is_active')
    search_fields = ('host__name', 'tier')
    list_filter = ('is_active', 'created_date')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'host', 'start', 'end', 'is_active')
    search_fields = ('title', 'host__name')
    list_filter = ('is_active', 'start')

@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ('ticket_type', 'price', 'event', 'valid_until', 'is_active')
    search_fields = ('event__title',)
    list_filter = ('ticket_type', 'is_active')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'sexuality', 'dob', 'age_display')
    search_fields = ('user__username', 'first_name', 'last_name')
    list_filter = ('gender', 'sexuality')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('feedback_type', 'feedback', 'user', 'created_date')
    search_fields = ('feedback', 'user__username')
    list_filter = ('feedback_type', 'created_date')

@admin.register(UserResponse)
class UserResponseAdmin(admin.ModelAdmin):
    list_display = ('user', 'question', 'response_value', 'response_version', 'created_at')
    search_fields = ('user__username', 'question__text')
    list_filter = ('response_value', 'created_at')

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'host', 'status', 'blocked', 'is_active', 'expiration_date')
    search_fields = ('user__username', 'host__name')
    list_filter = ('status', 'blocked', 'is_active', 'expiration_date')