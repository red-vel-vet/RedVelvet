from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from .models import Host, Membership, Event, Price, HostApplication, ApplicationStatus
from .serializers import *
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
import logging
from django.core.mail import send_mail

logger = logging.getLogger(__name__)

class CreateUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        logger.info(f"Received registration data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Registration data validation errors: {serializer.errors}")
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class VerifyEmail(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        verification_token = get_object_or_404(EmailVerificationToken, token=token)
        user = verification_token.user
        user.is_active = True
        user.save()
        verification_token.delete()

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    
class LoginRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = EmailLoginRequestSerializer  # Updated serializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            token = get_random_string(length=32)
            EmailVerificationToken.objects.create(user=user, token=token)
            self.send_login_email(user.email, token)
        except User.DoesNotExist:
            pass  # For security reasons, do not reveal the email does not exist
        return Response({"message": "If your email exists in our system, you will receive a link to log in."}, status=status.HTTP_200_OK)

    def send_login_email(self, email, token):
        login_link = f"https://red-vel.vet/verify-email/?token={token}"
        send_mail(
            'Log in to your account',
            f'Please click the link to log in: {login_link}',
            'info@red-vel.vet',
            [email],
            fail_silently=False,
        )

class QuizCategoryList(generics.ListAPIView):
    queryset = QuizCategory.objects.all()
    serializer_class = QuizCategorySerializer

class QuizQuestionList(generics.ListAPIView):
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer

class UserResponseView(APIView):
    def get(self, request):
        user = request.user
        responses = UserResponse.get_latest_responses(user)
        serialized_responses = [
            {"question_id": r.question.id, "response_value": r.response_value}
            for r in responses
        ]
        return Response(serialized_responses)

    def post(self, request):
        user = request.user
        serializer = UserResponseSerializer(data=request.data, many=True)

        if serializer.is_valid():
            for response_data in serializer.validated_data:
                question = response_data['question']
                last_response = UserResponse.get_latest_responses(user).filter(question=question).first()

                new_version = last_response.response_version + 1 if last_response else 1
                UserResponse.objects.create(
                    user=user,
                    question=question,
                    response_value=response_data['response_value'],
                    response_version=new_version
                )
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)
        else:
            # print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

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
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True) 
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data) 

class DeleteHost(generics.DestroyAPIView):
    queryset = Host.objects.all()
    serializer_class = HostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class ListHostApplications(generics.ListAPIView):
    queryset = HostApplication.objects.all()
    serializer_class = HostApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

class CreateHostApplication(generics.CreateAPIView):
    queryset = HostApplication.objects.all()
    serializer_class = HostApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ViewHostApplication(generics.RetrieveAPIView):
    queryset = HostApplication.objects.all()
    serializer_class = HostApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

class UpdateHostApplication(generics.UpdateAPIView):
    queryset = HostApplication.objects.all()
    serializer_class = HostApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeleteHostApplication(generics.DestroyAPIView):
    queryset = HostApplication.objects.all()
    serializer_class = HostApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = EventSerializer  # Default serializer class

    def get_queryset(self):
        # Filter for active events that end in the future
        return Event.objects.filter(is_active=True, end__gte=timezone.now())

    def get_serializer(self, *args, **kwargs):
        # Determine the appropriate serializer based on user approval and event requirements
        user = self.request.user
        queryset = self.filter_queryset(self.get_queryset())

        # Map each event to its appropriate serializer
        event_serializers = []
        for event in queryset:
            if not event.requires_approval_for_view:
                serializer = EventSerializer(event, context={'request': self.request})
            elif user.is_authenticated:
                host_application = HostApplication.objects.filter(user=user, host=event.host).first()
                if host_application and host_application.status == ApplicationStatus.APPROVED:
                    serializer = EventSerializer(event, context={'request': self.request})
                else:
                    serializer = LimitedEventSerializer(event, context={'request': self.request})
            else:
                serializer = LimitedEventSerializer(event, context={'request': self.request})
            event_serializers.append(serializer.data)

        return Response(event_serializers)

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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        user = self.request.user
        event = self.get_object()
        if not event.requires_approval_for_view:
            return EventSerializer
        if user.is_authenticated:
            host_application = HostApplication.objects.filter(user=user, host=event.host).first()
            if host_application and host_application.status == ApplicationStatus.APPROVED:
                return EventSerializer
        return LimitedEventSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if instance.requires_approval_for_view:
            if not user.is_authenticated:
                serializer = LimitedEventSerializer(instance)
                return Response(serializer.data)
            host_application = HostApplication.objects.filter(user=user, host=instance.host).first()
            if not host_application or host_application.status != ApplicationStatus.APPROVED:
                serializer = LimitedEventSerializer(instance)
                return Response(serializer.data)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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

class CreateFeedback(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.AllowAny]  

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        feedback = serializer.save(user=user)
        self.send_feedback_email(feedback)

    def send_feedback_email(self, feedback):
        subject = f"New Feedback: {feedback.get_feedback_type_display()}"
        message = f"""
        Feedback Type: {feedback.get_feedback_type_display()}
        Feedback: {feedback.feedback}
        User: {feedback.user.username if feedback.user else 'Anonymous'}
        Name: {feedback.name if feedback.name else 'N/A'}
        Email: {feedback.email if feedback.email else 'N/A'}
        Contact Permission: {'Yes' if feedback.contact_permission else 'No'}
        """
        send_mail(subject, message, 'info@red-vel.vet', ['info@red-vel.vet'], fail_silently=False)