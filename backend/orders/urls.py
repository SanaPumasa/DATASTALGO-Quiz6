from django.urls import path
from orders.views import CreateOrderView, UserOrderHistoryView

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='create_order'),
    path('history/', UserOrderHistoryView.as_view(), name='order_history'),
]
