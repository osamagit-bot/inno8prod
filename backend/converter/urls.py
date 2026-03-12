from django.urls import path
from . import views

urlpatterns = [
    path('convert/', views.convert_file, name='convert_file'),
    path('progress/<str:job_id>/', views.get_progress, name='get_progress'),
    path('download/<str:job_id>/', views.download_file, name='download_file'),
]
