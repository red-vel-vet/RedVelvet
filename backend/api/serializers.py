from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Host, Membership, Event, Price

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if "@" in value:
            raise serializers.ValidationError("Username cannot contain '@'.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

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
        fields = ('id', 'title', 'host', 'start', 'city', 'state', 'image_url')

class PriceSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = Price
        fields = '__all__'