from django.db import models
from users.models import CustomUser

class Service(models.Model):
    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='services')
    service_name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_of_service = models.CharField(max_length=100)
    sample_image = models.ImageField(upload_to='service_images/', blank=True, null=True)
    rating = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
