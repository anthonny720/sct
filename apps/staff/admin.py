from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from simple_history.admin import SimpleHistoryAdmin

from .models import Staff, Absenteeism, Department


# Register your models here.
@admin.register(Staff)
class StaffAdmin(ImportExportModelAdmin, SimpleHistoryAdmin):
    list_display = ('name', 'last_name', 'dni', 'area', 'status',)
    search_fields = ('name', 'last_name', 'dni',)
    ordering = ['name']
    list_filter = ('area', 'status',)
    list_editable = ('status',)
    list_per_page = 25


@admin.register(Department)
class DepartmentAdmin(ImportExportModelAdmin, SimpleHistoryAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ['name']
    list_filter = ('name',)
    list_per_page = 25


@admin.register(Absenteeism)
class AbsenteeismAdmin(ImportExportModelAdmin, SimpleHistoryAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ['name']
    list_filter = ('name',)
    list_per_page = 25
