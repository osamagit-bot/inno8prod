from django.urls import path
from . import views

urlpatterns = [
    path('subscribe/', views.subscribe, name='subscribe'),
    path('unsubscribe/', views.unsubscribe, name='unsubscribe'),
    path('send-notification/', views.send_notification, name='send_notification'),
    path('count/', views.subscriber_count, name='subscriber_count'),
    path('subscribers/', views.subscriber_list, name='subscriber_list'),
]
