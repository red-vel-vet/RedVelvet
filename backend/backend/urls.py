from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", include("api.urls")),
    path("api/token/", MyTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
]
