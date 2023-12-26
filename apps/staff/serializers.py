from rest_framework import serializers

from apps.staff.models import Staff, Department, Absenteeism


class StaffSerializer(serializers.ModelSerializer):
    department_name=serializers.CharField(source='area.name', read_only=True)
    full_name=serializers.CharField(source='get_full_name', read_only=True)
    class Meta:
        model=Staff
        fields='__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    class Meta:
        model=Department
        fields='__all__'

    def get_children(self, obj):
        return obj.get_staff()

class AbsenteeismSerializer(serializers.ModelSerializer):
    class Meta:
        model=Absenteeism
        fields='__all__'