from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.models import CustomUser
from subscriptions.models import SubscriptionTier, UserSubscription

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'phone_number', 'first_name', 'last_name', 'location', 'gender', 'role', 'merchant_id')
        read_only_fields = ('id',)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'phone_number', 'first_name', 'last_name', 'location', 'gender', 'password', 'confirm_password')
        extra_kwargs = {
            'phone_number': {'required': False},
            'location': {'required': False},
            'gender': {'required': False},
            'confirm_password': {'required': False},
        }

    def validate(self, data):
        # Only validate password match if confirm_password is provided
        if 'confirm_password' in data:
            if data['password'] != data['confirm_password']:
                raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            location=validated_data.get('location', ''),
            gender=validated_data.get('gender', ''),
            role='user'
        )
        
        # Automatically create a basic subscription for new users
        try:
            basic_tier = SubscriptionTier.objects.get(name='Basic')
            UserSubscription.objects.create(
                user=user,
                tier=basic_tier,
                usage_left=basic_tier.max_usage,
                is_active=True
            )
        except SubscriptionTier.DoesNotExist:
            pass
        
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField()
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password')
        
        if not user.check_password(password):
            raise serializers.ValidationError('Invalid email or password')
        
        refresh = self.get_token(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'email': user.email,
            'role': user.role,
            'username': user.username,
            'id': user.id
        }
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        token['username'] = user.username
        return token
