from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from services.models import Service
from services.serializers import ServiceSerializer

class ServiceListView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

class ServiceDetailView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response(
                {"detail": "Service not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

class SellerServiceManageView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.role != 'seller':
            return Response(
                {"detail": "Seller access required"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        services = Service.objects.filter(seller=request.user)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'seller':
            return Response(
                {"detail": "Seller access required"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(seller=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SellerServiceDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        try:
            service = Service.objects.get(pk=pk, seller=request.user)
        except Service.DoesNotExist:
            return Response(
                {"detail": "Service not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            service = Service.objects.get(pk=pk, seller=request.user)
        except Service.DoesNotExist:
            return Response(
                {"detail": "Service not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ServiceSerializer(service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            service = Service.objects.get(pk=pk, seller=request.user)
            service.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Service.DoesNotExist:
            return Response(
                {"detail": "Service not found"},
                status=status.HTTP_404_NOT_FOUND
            )
