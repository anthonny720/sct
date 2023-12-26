from django.contrib import admin
from django.urls import path, include

urlpatterns = [path('admin/', admin.site.urls), path('api/staff/', include('apps.staff.urls')),
    path('api/tracking/', include('apps.tracking.urls')), path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')), ]
