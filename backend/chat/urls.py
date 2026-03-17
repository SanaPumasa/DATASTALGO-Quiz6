from django.urls import path
from chat.views import AIChatbotView

urlpatterns = [
    path('ask/', AIChatbotView.as_view(), name='chatbot'),
]
