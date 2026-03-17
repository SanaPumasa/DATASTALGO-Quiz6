from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from applications.models import SellerApplication
from applications.serializers import SellerApplicationSerializer
from users.models import CustomUser
import uuid

class SubmitApplicationView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        
        if SellerApplication.objects.filter(user=user).exists():
            return Response(
                {"detail": "You already have a pending application"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application = SellerApplication.objects.create(user=user)
        serializer = SellerApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ListApplicationView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.role != 'admin':
            return Response(
                {"detail": "Admin access required"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        applications = SellerApplication.objects.filter(status='pending').all()
        serializer = SellerApplicationSerializer(applications, many=True)
        return Response(serializer.data)

class ApproveApplicationView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk):
        if request.user.role != 'admin':
            return Response(
                {"detail": "Admin access required"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            application = SellerApplication.objects.get(pk=pk)
        except SellerApplication.DoesNotExist:
            return Response(
                {"detail": "Application not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        merchant_id = request.data.get('merchant_id', str(uuid.uuid4()))
        
        application.status = 'approved'
        application.save()
        
        user = application.user
        user.role = 'seller'
        user.merchant_id = merchant_id
        user.save()
        
        serializer = SellerApplicationSerializer(application)
        return Response(serializer.data)

class DeclineApplicationView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk):
        if request.user.role != 'admin':
            return Response(
                {"detail": "Admin access required"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            application = SellerApplication.objects.get(pk=pk)
        except SellerApplication.DoesNotExist:
            return Response(
                {"detail": "Application not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        decline_reason = request.data.get('decline_reason', '')
        
        application.status = 'declined'
        application.decline_reason = decline_reason
        application.save()
        
        serializer = SellerApplicationSerializer(application)
        return Response(serializer.data)
