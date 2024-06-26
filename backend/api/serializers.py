from django.contrib.auth.models import User
from rest_framework import serializers
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from .models import Host, Membership, Event, Price, EmailVerificationToken, PasswordResetToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        print("Checking if username exists:", value)
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        print("Checking if email exists:", value)
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        validated_data['is_active'] = False
        user = User.objects.create_user(**validated_data)
        token = get_random_string(length=32)
        EmailVerificationToken.objects.create(user=user, token=token)
        self.send_verification_email(user.email, token)
        return user
    
    def send_verification_email(self, email, token):
        verification_link = f"https://www.red-vel.vet/verify-email/?token={token}"  # Points to frontend
        send_mail(
            'Verify your email address',
            f'Please click the link to verify your email address: {verification_link}',
            'info@red-vel.vet',
            [email],
            fail_silently=False,
        )

    def send_reset_password_email(self, email, token):
        reset_link = f"https://www.red-vel.vet/reset-password/?token={token}"  # Points to frontend
        send_mail(
            'Reset your password',
            f'Please click the link to reset your password: {reset_link}',
            'info@red-vel.vet',
            [email],
            fail_silently=False,
        )


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value
    
class ChangePasswordSerializer(serializers.Serializer):
    currentPassword = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value
    

class HostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Host
        fields = '__all__'

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
        fields = ('id', 'title', 'host', 'start', 'city', 'state', 'image_url', 'description')

class PriceSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = Price
        fields = '__all__'