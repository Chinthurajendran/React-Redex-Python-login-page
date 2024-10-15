from django.urls import path
from .views import Register,LoginView,ImageUploadView,ImageURL,UserList,UserDelete,FetchData,UpdateUserData

urlpatterns = [
    path('register', Register.as_view()),
    path('login', LoginView.as_view(),name="login"),
    path('uploadimage', ImageUploadView.as_view(),name="image"),
    path('imageurl', ImageURL.as_view(),name="imageurl"),

    path('userlist', UserList.as_view(),name="userlist"),
    path('userdelete/<id>/', UserDelete.as_view(),name="userdelete"),
    path('fetchdata/<id>/', FetchData.as_view(),name="fetchdata"),
     path('updatedata/<id>/', UpdateUserData.as_view(), name='update-data'),
]