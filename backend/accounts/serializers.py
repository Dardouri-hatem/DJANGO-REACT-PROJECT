from djoser.serializers import UserCreateSerializer,UserSerializer
from django.contrib.auth import get_user_model
User = get_user_model()

class UserAccountSerializer(UserCreateSerializer):
    class Meta (UserCreateSerializer.Meta): 
        model : User
        fields : ['id','email','name','password']
