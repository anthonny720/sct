from django.contrib.auth import get_user_model
from djoser import serializers

User = get_user_model()


class UserCreateSerializer(serializers.UserCreateSerializer):
    class Meta(serializers.UserCreateSerializer.Meta):
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'get_full_name',
            'get_permission_name',
            'get_short_name',
            'get_admin',
            'password',
            'permissions' )
