from django.db import models
from django.contrib.auth.models import User
from enum import Enum
import uuid
from datetime import date

class Host(models.Model):
    
    name = models.CharField(max_length=50)
    tagline = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField()
    logo_url = models.URLField(null=True, blank=True)
    website_url = models.URLField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    approval_required = models.BooleanField(default=False)
    application_fee = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    membership_available = models.BooleanField(default=False)
    mailing_street = models.CharField(max_length=100, null=True, blank=True)
    mailing_street2 = models.CharField(max_length=100, null=True, blank=True)
    mailing_city = models.CharField(max_length=50, null=True, blank=True)
    mailing_state = models.CharField(max_length=2, null=True, blank=True)
    mailing_zip = models.CharField(max_length=10, null=True, blank=True)
    physical_street = models.CharField(max_length=100, null=True, blank=True)
    physical_street2 = models.CharField(max_length=100, null=True, blank=True)
    physical_city = models.CharField(max_length=50, null=True, blank=True)
    physical_state = models.CharField(max_length=2, null=True, blank=True)
    physical_zip = models.CharField(max_length=10, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosts', null=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    is_active = models.BooleanField(default=True, null=True)

    def __str__(self):
        return self.name

class ApplicationStatus(models.TextChoices):
    NOT_SUBMITTED = 'Not Submitted'
    SUBMITTED = 'Submitted'
    APPROVED = 'Approved'
    REJECTED = 'Rejected'

class HostApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    status = models.CharField(max_length=13, choices=ApplicationStatus.choices, default=ApplicationStatus.NOT_SUBMITTED)

    def __str__(self):
        return f"{self.user.username} - {self.host.name} - {self.status}"

class DurationType(Enum):
    D = 'days'
    W = 'weeks'
    M = 'months'
    Y = 'years'
    L = 'lifetime'

class Membership(models.Model):
    host = models.ForeignKey(Host, on_delete=models.CASCADE, related_name='memberships')
    tier = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    benefits = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=9, decimal_places=2)
    duration = models.IntegerField(null=True, blank=True)
    duration_type = models.CharField(
        max_length=1,
        choices=[(tag.name, tag.value) for tag in DurationType]
    )
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.tier

class Event(models.Model):
    title = models.CharField(max_length=100)
    image_url = models.URLField(null=True, blank=True)
    event_url = models.URLField(null=True, blank=True)
    start = models.DateTimeField()
    end = models.DateTimeField()
    address = models.CharField(max_length=100, null=True, blank=True)
    address2 = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=2)
    zip = models.CharField(max_length=10, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    membership_required = models.BooleanField(default=False)
    requires_approval_for_view = models.BooleanField(default=False)
    host = models.ForeignKey(Host, on_delete=models.CASCADE, related_name='events')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class TicketType(Enum):
    SM = 'Single Gentleman'
    SF = 'Single Lady'
    C = 'Couple'

class Price(models.Model):
    ticket_type = models.CharField(
        max_length=2,
        choices=[(tag.name, tag.value) for tag in TicketType]
    )
    price = models.DecimalField(max_digits=7, decimal_places=2)
    conditions = models.TextField(null=True, blank=True)
    valid_until = models.DateField(null=True, blank=True)
    event = models.ForeignKey(Event, related_name='prices', on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.get_ticket_type_display()} - {self.event.name}'
    
class AgeDisplayType(Enum):
    NUMBER = 'Number'
    GENERATION = 'Generation'
    RANGE = 'Range'
    NONE = 'None'

class GenderType(Enum):
    CIS_M = 'CIS M'
    CIS_F = 'CIS F'
    TRANS_M = 'Trans M'
    TRANS_F = 'Trans F'
    NON_BINARY = 'Non-Binary'
    OTHER = 'Other'

class SexualityType(Enum):
    STRAIGHT = 'Straight'
    HETERO = 'Heteroflexible'
    BI_CURIOUS = 'Bi-curious'
    BISEXUAL = 'Bisexual'
    HOMO = 'Homoflexible'
    GAY = 'Gay/Lesbian'
    OTHER = 'Other'

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=30, blank=True, default='')
    last_name = models.CharField(max_length=30, blank=True, default='')
    dob = models.DateField()
    age_display = models.CharField(
        max_length=10,
        choices=[(tag.name, tag.value) for tag in AgeDisplayType],
        default=AgeDisplayType.NONE.name
    )
    gender = models.CharField(
        max_length=10,
        choices=[(tag.name, tag.value) for tag in GenderType],
        default=GenderType.OTHER.name
    )
    sexuality = models.CharField(
        max_length=20,
        choices=[(tag.name, tag.value) for tag in SexualityType],
        default=SexualityType.OTHER.name
    )
    about_you = models.TextField(null=True, blank=True)
    relationship_status = models.TextField(null=True, blank=True)
    personal_background = models.TextField(null=True, blank=True)
    experience = models.TextField(null=True, blank=True)
    community_contribution = models.TextField(null=True, blank=True)
    philosophy_views = models.TextField(null=True, blank=True)
    fantasy_preferences = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.user.username

    @property
    def age(self):
        today = date.today()
        return today.year - self.dob.year - ((today.month, today.day) < (self.dob.month, self.dob.day))

    @property
    def age_display_value(self):
        age = self.age
        year_born = self.dob.year
        if self.age_display == AgeDisplayType.NUMBER.name:
            return age
        elif self.age_display == AgeDisplayType.GENERATION.name:
            if year_born <= 1924:
                return 'Greatest Generation'
            elif 1925 <= year_born <= 1945:
                return 'Silent Generation'
            elif 1946 <= year_born <= 1964:
                return 'Baby Boomer'
            elif 1965 <= year_born <= 1976:
                return 'Gen X'
            elif 1977 <= year_born <= 1983:
                return 'Xennial'
            elif 1984 <= year_born <= 1994:
                return 'Millennial'
            elif 1995 <= year_born <= 2012:
                return 'Gen Z'
            else:
                return 'Gen Alpha'
        elif self.age_display == AgeDisplayType.RANGE.name:
            return f'{age // 10 * 10}s'
        else:
            return ''

class Feedback(models.Model):
    FEEDBACK_TYPES = (
        ('bug', 'Bug'),
        ('feature', 'Feature Request'),
    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    feedback_type = models.CharField(max_length=10, choices=FEEDBACK_TYPES)
    feedback = models.TextField()
    contact_permission = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.feedback_type} - {self.feedback[:20]}"
    
class EmailVerificationToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='email_verification_token')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.token}"
    
class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.token}"
    
class QuizCategory(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class QuizType(models.TextChoices):
    STANDARD = 'Standard', 'Standard'
    EXTENDED = 'Extended', 'Extended'
    ARCHIVED = 'Archived', 'Archived'

class QuizQuestion(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(QuizCategory, on_delete=models.CASCADE)
    quiz_type = models.CharField(
        max_length=10,
        choices=QuizType.choices,
        default=QuizType.STANDARD
    )

    def __str__(self):
        return self.text
    
class UserResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey('QuizQuestion', on_delete=models.CASCADE)
    response_value = models.IntegerField()
    response_text = models.TextField(null=True, blank=True)
    response_version = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.question.text} - {self.response_value}"

    @classmethod
    def get_latest_responses(cls, user):
        return (
            cls.objects.filter(user=user)
            .order_by('question_id', '-response_version')
            .distinct('question_id')
        )

    @classmethod
    def create_or_get_neutral(cls, user, question):
        response, created = cls.objects.get_or_create(
            user=user,
            question=question,
            response_version=1,
            defaults={'response_value': 2}
        )
        return response