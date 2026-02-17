from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.analytics_stats, name='analytics-stats'),
    path('track/', views.track_visit, name='track-visit'),
    path('reset/', views.reset_analytics, name='reset-analytics'),
]
