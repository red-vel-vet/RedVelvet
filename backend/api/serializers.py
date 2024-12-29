from django.contrib.auth.models import User
from rest_framework import serializers
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from .models import *
from datetime import date

class EmailLoginRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
class UserSerializer(serializers.ModelSerializer):
    dob = serializers.DateField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'dob']
        extra_kwargs = {'username': {'required': False}}

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate_dob(self, value):
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise serializers.ValidationError("You must be at least 18 years old to register.")
        return value

    def create(self, validated_data):
        dob = validated_data.pop('dob')
        validated_data['is_active'] = False
        user = User.objects.create(**validated_data)
        UserProfile.objects.create(user=user, dob=dob)
        token = get_random_string(length=32)
        EmailVerificationToken.objects.create(user=user, token=token)
        self.send_verification_email(user.email, token, is_registration=True)
        return user

    def send_verification_email(self, email, token, is_registration):
        if is_registration:
            subject = 'Verify your email address'
            message = f'Please click the link to verify your email address: https://red-vel.vet/verify-email/?token={token}\n'
            message += f'Please click the link to verify your email address: localhost:3000/verify-email/?token={token}\n'
            message += f'Please click the link to verify your email address: 192.168.1.185:3000/verify-email/?token={token}'
        else:
            subject = 'Log in to your account'
            message = f'Please click the link to log in: https://red-vel.vet/verify-email/?token={token}\n'
            message += f'Please click the link to log in: localhost:3000/verify-email/?token={token}\n'
            message += f'Please click the link to log in: 192.168.1.185:3000/verify-email/?token={token}'

        send_mail(
            subject,
            message,
            'info@red-vel.vet',
            [email],
            fail_silently=False,
        )

class UserProfileSerializer(serializers.ModelSerializer):
    age_display_value = serializers.ReadOnlyField()
    sexuality_display = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'first_name', 'last_name', 'dob', 'display_name','age_display', 'gender', 'sexuality', 'sexuality_display',
            'about_you', 'relationship_status', 'personal_background', 'experience',
            'community_contribution', 'philosophy_views', 'fantasy_preferences', 'age_display_value'
        ]

    def get_sexuality_display(self, obj):
        return SexualityType[obj.sexuality].value

    def validate_first_name(self, value):
        # Ensure first_name can only be set once
        if self.instance and self.instance.first_name and self.instance.first_name != value:
            raise serializers.ValidationError("First name cannot be changed once set.")
        return value

    def validate_last_name(self, value):
        # Ensure last_name can only be set once
        if self.instance and self.instance.last_name and self.instance.last_name != value:
            raise serializers.ValidationError("Last name cannot be changed once set.")
        return value

    def validate_dob(self, value):
        # Ensure the DOB cannot be changed once set
        if self.instance and self.instance.dob != value:
            raise serializers.ValidationError("DOB cannot be changed once set.")
        return value

class UserResponseSerializer(serializers.ModelSerializer):
    question_id = serializers.PrimaryKeyRelatedField(
        queryset=QuizQuestion.objects.all(),
        source='question'
    )

    class Meta:
        model = UserResponse
        fields = ['question_id', 'response_value']

class QuizCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizCategory
        fields = ['id', 'name', 'description']

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['id', 'text', 'category']    

class HostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Host
        fields = '__all__'  

    def validate(self, data):
        return data

from .models import HostApplication

class HostApplicationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    host = serializers.ReadOnlyField(source='host.name')

    class Meta:
        model = HostApplication
        fields = ['id', 'user', 'host', 'status']

class MembershipSerializer(serializers.ModelSerializer):
    host = serializers.PrimaryKeyRelatedField(queryset=Host.objects.all())

    class Meta:
        model = Membership
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    host = serializers.StringRelatedField()
    host_logo_url = serializers.SerializerMethodField()
    host_website_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_host_logo_url(self, obj):
        return obj.host.logo_url if obj.host else None
    
    def get_host_website_url(self, obj):
        return obj.host.website_url if obj.host else None

class ListEventSerializer(serializers.ModelSerializer):
    host = serializers.StringRelatedField()

    class Meta:
        model = Event
        fields = ('id', 'title', 'host', 'start', 'city', 'state', 'image_url', 'description', 'requires_approval_for_view')

class LimitedEventSerializer(serializers.ModelSerializer):
    host = serializers.StringRelatedField()

    class Meta:
        model = Event
        fields = ('id', 'host', 'start', 'city', 'state', 'requires_approval_for_view')

class PriceSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = Price
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'