from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get("username")
        password = attrs.get("password")

        # Attempt to find the user by email or username
        user = User.objects.filter(email=identifier).first() or User.objects.filter(username=identifier).first()

        if user:
            # Check if the user is active
            if not user.is_active:
                raise ValidationError('Email not verified. Please check your email to verify your account.')
            
            # Authenticate the user using username and password
            auth_user = authenticate(username=user.username, password=password)
            if auth_user:
                # Ensure the original 'username' field is populated correctly for token generation
                attrs['username'] = user.username
                return super(MyTokenObtainPairSerializer, self).validate(attrs)
            else:
                # Authentication failed
                raise ValidationError('Unable to log in with provided credentials.')
        else:
            # No user found
            raise ValidationError('No user found with provided identifier.')