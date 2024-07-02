import uuid
from rest_framework import generics, permissions, status
from django.contrib.auth.models import User
from rest_framework.response import Response
from .models import Host, Membership, Event, Price
from .serializers import *
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import EmailVerificationToken, PasswordResetToken
import logging

logger = logging.getLogger(__name__)

class CreateUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors: ", serializer.errors)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    

class VerifyEmail(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        verification_token = get_object_or_404(EmailVerificationToken, token=token)
        user = verification_token.user
        user.is_active = True
        user.save()
        verification_token.delete()
        return Response({'message': 'Email verified successfully!'}, status=status.HTTP_200_OK)
    

class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            token = uuid.uuid4()
            PasswordResetToken.objects.create(user=user, token=token)
            user_serializer = UserSerializer()
            user_serializer.send_reset_password_email(user.email, token)
        except User.DoesNotExist:
            logger.info(f"Password reset requested for non-existent email: {email}")
            # For security reasons, you should not reveal that the email does not exist
        return Response({"message": "If your email exists in our system, you will receive a link to reset your password."}, status=status.HTTP_200_OK)

class PasswordResetView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']
        reset_token = get_object_or_404(PasswordResetToken, token=token)
        user = reset_token.user
        user.set_password(password)
        user.save()
        reset_token.delete()
        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)


class ViewUser(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UpdateUser(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class DeleteUser(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ListHosts(generics.ListAPIView):
    queryset = Host.objects.filter(is_active=True)
    serializer_class = HostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CreateHost(generics.CreateAPIView):
    queryset = Host.objects.all()
    serializer_class = HostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ViewHost(generics.RetrieveAPIView):
    queryset = Host.objects.all()
    serializer_class = HostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UserHosts(generics.ListAPIView):
    serializer_class = HostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Host.objects.filter(owner=self.request.user)

class UpdateHost(generics.UpdateAPIView):
    queryset = Host.objects.all()
    serializer_class = HostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DeleteHost(generics.DestroyAPIView):
    queryset = Host.objects.all()
    serializer_class = HostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class ListMemberships(generics.ListAPIView):
    queryset = Membership.objects.filter(is_active=True)
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CreateMembership(generics.CreateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

class ViewMembership(generics.RetrieveAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UpdateMembership(generics.UpdateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DeleteMembership(generics.DestroyAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class ListEvents(generics.ListAPIView):
    queryset = Event.objects.filter(is_active=True, end__gte=timezone.now())
    serializer_class = ListEventSerializer  
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CreateEvent(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        host = serializer.validated_data['host']
        if host.owner != self.request.user:
            raise PermissionDenied("You can only create events for hosts you own.")
        serializer.save()

class ViewEvent(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UpdateEvent(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DeleteEvent(generics.DestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class ListPrices(generics.ListAPIView):
    queryset = Price.objects.filter(is_active=True)
    serializer_class = PriceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CreatePrice(generics.CreateAPIView):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        event = serializer.validated_data['event']
        if event.host.owner != self.request.user:
            raise PermissionDenied("You can only create prices for events linked to your hosts.")
        serializer.save()

class ViewPrice(generics.RetrieveAPIView):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UpdatePrice(generics.UpdateAPIView):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DeletePrice(generics.DestroyAPIView):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()