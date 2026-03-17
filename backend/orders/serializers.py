from rest_framework import serializers
from orders.models import Order

class OrderSerializer(serializers.ModelSerializer):
    buyer_email = serializers.EmailField(source='buyer.email', read_only=True)
    service_name = serializers.CharField(source='service.service_name', read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'buyer', 'buyer_email', 'service', 'service_name', 'paypal_transaction_id', 'price_paid', 'date_purchased')
        read_only_fields = ('id', 'date_purchased')
