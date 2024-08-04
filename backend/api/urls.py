from django.urls import path
from . import views

urlpatterns = [
    path('user/register/', views.CreateUser.as_view(), name='user-register'),
    path('verify-email/', views.VerifyEmail.as_view(), name='verify-email'),
    path('login-request/', views.LoginRequestView.as_view(), name='login-request'),
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('user/view/', views.ViewUser.as_view(), name='user-view'),
    path('user/update/', views.UpdateUser.as_view(), name='user-update'),
    path('user/delete/', views.DeleteUser.as_view(), name='user-delete'),
    path('hosts/', views.ListHosts.as_view(), name='host-list'),
    path('user-hosts/', views.UserHosts.as_view(), name='user-hosts'),
    path('hosts/create/', views.CreateHost.as_view(), name='host-create'),
    path('hosts/<int:pk>/', views.ViewHost.as_view(), name='host-detail'),
    path('hosts/update/<int:pk>/', views.UpdateHost.as_view(), name='host-update'),
    path('hosts/delete/<int:pk>/', views.DeleteHost.as_view(), name='host-delete'),
    path('memberships/', views.ListMemberships.as_view(), name='membership-list'),
    path('memberships/create/', views.CreateMembership.as_view(), name='membership-create'),
    path('memberships/<int:pk>/', views.ViewMembership.as_view(), name='membership-detail'),
    path('memberships/update/<int:pk>/', views.UpdateMembership.as_view(), name='membership-update'),
    path('memberships/delete/<int:pk>/', views.DeleteMembership.as_view(), name='membership-delete'),
    path('events/', views.ListEvents.as_view(), name='event-list'),
    path('events/create/', views.CreateEvent.as_view(), name='event-create'),
    path('events/<int:pk>/', views.ViewEvent.as_view(), name='event-detail'),
    path('events/update/<int:pk>/', views.UpdateEvent.as_view(), name='event-update'),
    path('events/delete/<int:pk>/', views.DeleteEvent.as_view(), name='event-delete'),
    path('prices/', views.ListPrices.as_view(), name='price-list'),
    path('prices/create/', views.CreatePrice.as_view(), name='price-create'),
    path('prices/<int:pk>/', views.ViewPrice.as_view(), name='price-detail'),
    path('prices/update/<int:pk>/', views.UpdatePrice.as_view(), name='price-update'),
    path('prices/delete/<int:pk>/', views.DeletePrice.as_view(), name='price-delete'),
    path('feedback/', views.CreateFeedback.as_view(), name='create-feedback')
]