from rest_framework import serializers
from applications.models import SellerApplication

class SellerApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = SellerApplication
        fields = ('id', 'user', 'user_email', 'user_username', 'status', 'decline_reason', 'created_at')
        read_only_fields = ('id', 'created_at')
