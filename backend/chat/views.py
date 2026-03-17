from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from chat.models import ChatMessage
from subscriptions.models import UserSubscription
import google.generativeai as genai
from django.conf import settings

class AIChatbotView(APIView):
    permission_classes = (IsAuthenticated,)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Configure Gemini API
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        except Exception as e:
            self.model = None
            self.error_msg = f"Gemini API not configured: {str(e)}"

    def post(self, request):
        # Check if Gemini API is properly configured
        if not self.model:
            return Response(
                {"detail": "AI service is not available. Please set GEMINI_API_KEY environment variable."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        user = request.user
        
        try:
            subscription = UserSubscription.objects.get(user=user)
            if not subscription.is_active or subscription.usage_left <= 0:
                return Response(
                    {"detail": "You need an active subscription to use the chatbot"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except UserSubscription.DoesNotExist:
            return Response(
                {"detail": "You need an active subscription to use the chatbot"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        message = request.data.get('message', '')
        
        if not message:
            return Response(
                {"detail": "Message is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            response_text = self.generate_response(message)
        except Exception as e:
            return Response(
                {"detail": f"Error generating response: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        chat_message = ChatMessage.objects.create(
            user=user,
            message=message,
            response=response_text
        )
        
        subscription.usage_left -= 1
        subscription.save()
        
        return Response({
            'id': chat_message.id,
            'message': message,
            'response': response_text,
            'usage_left': subscription.usage_left
        }, status=status.HTTP_200_OK)

    def generate_response(self, message):
        # Create a natural, conversational prompt for auto repair services
        system_prompt = """You are a friendly auto repair assistant. Help customers with car questions in a natural, conversational way.

You can talk about engine repair, transmission repair, brakes, diagnostics, and general car maintenance. When someone asks about services, mention them naturally without listing or special formatting. Keep your responses short, friendly, and natural - like talking to a real person. Don't use asterisks, brackets, or bullet points. Just have a normal conversation.

If they want to book or learn more about specific services, encourage them to explore the platform."""
        
        # Combine system prompt with user message
        full_prompt = f"{system_prompt}\n\nCustomer: {message}\n\nAssistant:"
        
        # Get response from Gemini API
        response = self.model.generate_content(full_prompt)
        return response.text

