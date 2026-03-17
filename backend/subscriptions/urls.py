from django.urls import path
from subscriptions.views import (
    SubscriptionTierListView, 
    CreateSubscriptionView, 
    UserSubscriptionView, 
    SubscriptionListView,
    PayPalActivateSubscriptionView
)

urlpatterns = [
    path('tiers/', SubscriptionTierListView.as_view(), name='subscription_tiers'),
    path('create/', CreateSubscriptionView.as_view(), name='create_subscription'),
    path('my/', UserSubscriptionView.as_view(), name='user_subscription'),
    path('list/', SubscriptionListView.as_view(), name='subscription_list'),
    path('paypal/activate-subscription/', PayPalActivateSubscriptionView.as_view(), name='paypal_activate_subscription'),
]
