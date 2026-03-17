from django.core.management.base import BaseCommand
from subscriptions.models import SubscriptionTier

class Command(BaseCommand):
    help = 'Update subscription tiers with PayPal plan IDs'

    def handle(self, *args, **options):
        tiers_data = [
            {'name': 'Basic', 'paypal_plan_id': 'P-462646207K9508707NG4ZHPA'},
            {'name': 'Professional', 'paypal_plan_id': 'P-79150757NY4230220NG4ZIEA'},
            {'name': 'Enterprise', 'paypal_plan_id': 'P-22X726627R009924VNG4ZILY'},
        ]
        
        for tier_data in tiers_data:
            tier = SubscriptionTier.objects.filter(name=tier_data['name']).first()
            if tier:
                tier.paypal_plan_id = tier_data['paypal_plan_id']
                tier.save()
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Updated {tier.name} with PayPal plan ID: {tier_data["paypal_plan_id"]}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Tier {tier_data["name"]} not found')
                )
