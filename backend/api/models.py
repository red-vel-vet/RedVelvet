from django.db import models
from django.contrib.auth.models import User
from enum import Enum

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
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

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