from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import MyTokenObtainPairView, RegisterView, UserProfileView, AdminUserListView, AdminSellerListView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_users'),
    path('admin/users/<int:pk>/', AdminUserListView.as_view(), name='admin_user_detail'),
    path('admin/sellers/', AdminSellerListView.as_view(), name='admin_sellers'),
    path('admin/sellers/<int:pk>/', AdminSellerListView.as_view(), name='admin_seller_detail'),
]
