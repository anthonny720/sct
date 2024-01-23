from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from simple_history.admin import SimpleHistoryAdmin

from apps.tracking.models import Tracking, Holiday


# Register your models here.

@admin.register(Tracking)
class TrackingAdmin(ImportExportModelAdmin, SimpleHistoryAdmin):
    list_display = ('staff','is_day_shift', 'date', 'worked_hours', 'check_in', 'lunch_start', 'lunch_end', 'check_out', 'absenteeism',
                    'absenteeism_hours',)
    search_fields = ('staff__full_name',)
    list_editable = ('is_day_shift',)
    list_filter = ('staff__area__name',)
    date_hierarchy = 'date'
    list_per_page = 25


@admin.register(Holiday)
class HolidayAdmin(ImportExportModelAdmin, SimpleHistoryAdmin):
    list_display = ('name', 'date',)
