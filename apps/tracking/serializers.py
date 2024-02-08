from rest_framework import serializers

from apps.tracking.models import Tracking


class TrackingSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.get_full_name', read_only=True)
    absenteeism_name = serializers.CharField(source='absenteeism.name', read_only=True)
    absenteeism_extra_name = serializers.CharField(source='absenteeism_extra.name', read_only=True)

    class Meta:
        model = Tracking
        fields = '__all__'


class TrackingSummarySerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.get_full_name', read_only=True)
    real_time = serializers.CharField(source='get_real_worked_hours', read_only=True)
    class Meta:
        model = Tracking
        fields = ('staff_name', 'date', 'real_check_in', 'lunch_start', 'real_lunch_end', 'check_out','real_time')
