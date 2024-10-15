from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from .serializers import UserSerializer, UserUpdateSerializer,AdminUserSerializer
from .models import CustomUser, UserProfile
from rest_framework.exceptions import AuthenticationFailed, ParseError
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
import json
from rest_framework.generics import ListCreateAPIView

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class Register(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            if CustomUser.objects.filter(email=serializer.validated_data['email']).exists():
                return Response({"error": "This email is already registered. Please use a different email."},
                                status=status.HTTP_403_FORBIDDEN)
            else:
                user = CustomUser.objects.create(
                    email=serializer.validated_data['email'],
                    first_name=serializer.validated_data['first_name'],
                    last_name=serializer.validated_data['last_name']
                )
                user.set_password(serializer.validated_data['password'])
                user.save()

                return Response({"message": "Registration successful! Welcome aboard!"},
                                status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        
        if not CustomUser.objects.filter(email=email).exists():
            raise AuthenticationFailed('Invalid Email Address')

        user = authenticate(username=email, password=password)

        if user is None:
            raise AuthenticationFailed('Invalid Password')
        
        login(request, user)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        refresh['first_name'] = str(user.first_name)
        content = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'isAdmin': user.is_superuser,
        }
        return Response(content, status=status.HTTP_200_OK)
    


class ImageURL(APIView):
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))

        email = data.get('email')
        user = CustomUser.objects.get(email=email)
        data = UserSerializer(user).data

        try:
            profile_pic = user.UserProfile.profile_pic
            data['profile_pic'] = request.build_absolute_uri(
                '/')[:-1]+profile_pic.url
        except:
            profile_pic = ''
            data['profile_pic'] = ''

        content = data
        return Response(content)


# class ImageUploadView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         current_email = request.data.get('email') 
#         user = get_object_or_404(CustomUser, email=current_email)
        
#         serializer = UserUpdateSerializer(data=request.data)
        
#         if serializer.is_valid():
#             # Create or update the user profile
#             user_profile, created = UserProfile.objects.get_or_create(user=user)
#             user_profile.profile_pic = serializer.validated_data['profile_pic']  # Use the validated data
#             user_profile.save()  # Save the profile
            
#             # return Response({"message": "Profile picture uploaded successfully."}, status=status.HTTP_201_CREATED)
#             return Response({"message": "Profile picture uploaded successfully.", "profile_pic_url": user_profile.profile_pic.url}, status=status.HTTP_201_CREATED)
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return validation errors

from rest_framework.parsers import MultiPartParser, FormParser
class ImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    print('0')

    def post(self, request):
        print('1')
        user_profile  = UserProfile.objects.get_or_create(user=request.user)[0]
        print(user_profile)
        print('2')
        
        serializer = UserUpdateSerializer(user_profile, data=request.data, partial=True)
        
        image_name = UserProfile.profile_pic
        print(image_name)
        print(request.data)
        
        if serializer.is_valid():
            # Create or update the user profile
            serializer.save()
            
            # return Response({"message": "Profile picture uploaded successfully."}, status=status.HTTP_201_CREATED)
            image_name = UserProfile.profile_pic
            print(image_name)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return validation errors

###################### ADMIN SIDE ####################


class UserList(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = AdminUserSerializer
    lookup_field = 'id'

class UserDelete(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self,request,id):
        try:
            user = CustomUser.objects.get(id = id)
            user.delete()
            return Response(status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class FetchData(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self,request,id):
        try:
            user = CustomUser.objects.get(id=id)
            serializer = AdminUserSerializer(user)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class UpdateUserData(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, id):
        try:
            # Retrieve the user by ID
            user = CustomUser.objects.get(id=id)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Deserialize the request data
        serializer = AdminUserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)