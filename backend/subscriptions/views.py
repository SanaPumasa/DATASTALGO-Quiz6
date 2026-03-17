from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from subscriptions.models import SubscriptionTier, UserSubscription
from subscriptions.serializers import SubscriptionTierSerializer, UserSubscriptionSerializer

class SubscriptionTierListView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        tiers = SubscriptionTier.objects.all()
        serializer = SubscriptionTierSerializer(tiers, many=True)
        return Response(serializer.data)

class CreateSubscriptionView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        tier_id = request.data.get('tier_id')
        paypal_subscription_id = request.data.get('paypal_subscription_id', '')
        
        try:
            tier = SubscriptionTier.objects.get(pk=tier_id)
        except SubscriptionTier.DoesNotExist:
            return Response(
                {"detail": "Subscription tier not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            subscription = UserSubscription.objects.get(user=request.user)
            subscription.tier = tier
            subscription.usage_left = tier.max_usage
            subscription.is_active = True
            subscription.paypal_subscription_id = paypal_subscription_id
            subscription.save()
        except UserSubscription.DoesNotExist:
            subscription = UserSubscription.objects.create(
                user=request.user,
                tier=tier,
                usage_left=tier.max_usage,
                is_active=True,
                paypal_subscription_id=paypal_subscription_id
            )
        
        serializer = UserSubscriptionSerializer(subscription)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UserSubscriptionView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            subscription = UserSubscription.objects.get(user=request.user)
        except UserSubscription.DoesNotExist:
            # Automatically create a basic subscription for users without one
            try:
                basic_tier = SubscriptionTier.objects.get(name='Basic')
                subscription = UserSubscription.objects.create(
                    user=request.user,
                    tier=basic_tier,
                    usage_left=basic_tier.max_usage,
                    is_active=True
                )
            except SubscriptionTier.DoesNotExist:
                return Response(
                    {"is_active": False, "message": "No subscription tiers available"},
                    status=status.HTTP_200_OK
                )
        
        serializer = UserSubscriptionSerializer(subscription)
        return Response(serializer.data)

class SubscriptionListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.role != 'admin':
            return Response(
                {"detail": "Admin access required"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        subscriptions = UserSubscription.objects.filter(is_active=True).all()
        serializer = UserSubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)
