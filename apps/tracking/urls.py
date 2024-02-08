from django.urls import path

from .views import TrackingListView, TrackingDetailView, ScannerTrackingView, SummaryView, OutsourcingView, CalendarView, TrackingSummaryListView

name_app = 'tracking'

urlpatterns = [path('', TrackingListView.as_view()), path('real', TrackingSummaryListView.as_view()),
               path('<int:id>', TrackingDetailView.as_view()), path('scanner', ScannerTrackingView.as_view()),
               path('summary', SummaryView.as_view()), path('outsourcing', OutsourcingView.as_view()),
               path('calendar', CalendarView.as_view())

               ]
