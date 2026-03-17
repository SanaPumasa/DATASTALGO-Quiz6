from rest_framework import serializers
from services.models import Service

class ServiceSerializer(serializers.ModelSerializer):
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    
    class Meta:
        model = Service
        fields = ('id', 'seller', 'seller_username', 'service_name', 'description', 'price', 'duration_of_service', 'sample_image', 'rating', 'created_at', 'updated_at')
        read_only_fields = ('id', 'seller', 'created_at', 'updated_at')
