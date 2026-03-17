from django.db import models
from users.models import CustomUser

class SubscriptionTier(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    max_usage = models.IntegerField()
    paypal_plan_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

class UserSubscription(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='subscription')
    tier = models.ForeignKey(SubscriptionTier, on_delete=models.SET_NULL, null=True)
    usage_left = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    paypal_subscription_id = models.CharField(max_length=255, blank=True, null=True)
