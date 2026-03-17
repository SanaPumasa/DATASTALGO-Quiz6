from rest_framework import serializers
from subscriptions.models import SubscriptionTier, UserSubscription

class SubscriptionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionTier
        fields = ('id', 'name', 'price', 'max_usage')

class UserSubscriptionSerializer(serializers.ModelSerializer):
    tier_name = serializers.CharField(source='tier.name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserSubscription
        fields = ('id', 'user', 'user_email', 'tier', 'tier_name', 'usage_left', 'is_active', 'subscribed_at', 'paypal_subscription_id')
        read_only_fields = ('id', 'subscribed_at')
