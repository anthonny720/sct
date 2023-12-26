from django.urls import path

from .views import ListStaffView, DetailStaffView, ListDepartmentView, ListAbsenteeismView, FindUserView, StaffNotTrackingView

urlpatterns = [path('', ListStaffView.as_view()), path('<int:pk>/', DetailStaffView.as_view()),
               path('department/', ListDepartmentView.as_view()), path('absenteeism/', ListAbsenteeismView.as_view()),
               path('find/', FindUserView.as_view()),
               path('not-tracking/', StaffNotTrackingView.as_view(), name='not-tracking')]
