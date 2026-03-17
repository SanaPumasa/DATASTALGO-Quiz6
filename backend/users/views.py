from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from users.serializers import UserSerializer, RegisterSerializer, MyTokenObtainPairSerializer
from users.models import CustomUser

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminUserListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        users = CustomUser.objects.filter(role='user')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        if request.user.role != 'admin':
            return Response({"detail": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if request.user.role != 'admin':
            return Response({"detail": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = CustomUser.objects.get(pk=pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminSellerListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        sellers = CustomUser.objects.filter(role='seller')
        serializer = UserSerializer(sellers, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        if request.user.role != 'admin':
            return Response({"detail": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            seller = CustomUser.objects.get(pk=pk, role='seller')
        except CustomUser.DoesNotExist:
            return Response({"detail": "Seller not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(seller, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if request.user.role != 'admin':
            return Response({"detail": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            seller = CustomUser.objects.get(pk=pk, role='seller')
            seller.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Seller not found"}, status=status.HTTP_404_NOT_FOUND)
