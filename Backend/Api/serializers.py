from rest_framework import serializers
from .models import CustomUser
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'is_staff', 'password']

    
class UserUpdateSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(required=True)
    class Meta:
        model = UserProfile
        fields = ['profile_pic']

    
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'is_active']  # Exclude 'password' and 'User_Profile'

    def update(self, instance, validated_data):
        # Update user fields without modifying the password or profile picture
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()  # Save the updated instance
        return instance