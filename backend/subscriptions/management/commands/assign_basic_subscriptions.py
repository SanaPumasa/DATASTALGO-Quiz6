from django.core.management.base import BaseCommand
from users.models import CustomUser
from subscriptions.models import SubscriptionTier, UserSubscription


class Command(BaseCommand):
    help = 'Assign basic subscription to all users who don\'t have one'

    def handle(self, *args, **options):
        try:
            basic_tier = SubscriptionTier.objects.get(name='Basic')
        except SubscriptionTier.DoesNotExist:
            self.stdout.write(self.style.ERROR('Basic subscription tier not found'))
            return

        users = CustomUser.objects.all()
        count = 0

        for user in users:
            try:
                UserSubscription.objects.get(user=user)
            except UserSubscription.DoesNotExist:
                UserSubscription.objects.create(
                    user=user,
                    tier=basic_tier,
                    usage_left=basic_tier.max_usage,
                    is_active=True
                )
                count += 1
                self.stdout.write(f'Created subscription for {user.email}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully assigned basic subscriptions to {count} users')
        )
