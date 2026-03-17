import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from subscriptions.models import SubscriptionTier
from users.models import CustomUser

SubscriptionTier.objects.update_or_create(
    name='Basic',
    defaults={'price': 9.99, 'max_usage': 10}
)

SubscriptionTier.objects.update_or_create(
    name='Professional',
    defaults={'price': 19.99, 'max_usage': 30}
)

SubscriptionTier.objects.update_or_create(
    name='Enterprise',
    defaults={'price': 49.99, 'max_usage': 100}
)

admin_user, created = CustomUser.objects.get_or_create(
    email='admin@autourepair.com',
    defaults={
        'username': 'admin',
        'first_name': 'Admin',
        'last_name': 'User',
        'role': 'admin'
    }
)

if created:
    admin_user.set_password('admin123')
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()
    print("Admin user created successfully")
else:
    print("Admin user already exists")

print("Subscription tiers created successfully")
