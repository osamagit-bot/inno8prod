from django.db import models
from django.utils import timezone

class PageVisit(models.Model):
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    path = models.CharField(max_length=500)
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    device_type = models.CharField(max_length=50, blank=True)
    browser = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    referrer = models.CharField(max_length=500, blank=True)
    traffic_source = models.CharField(max_length=100, blank=True)
    utm_source = models.CharField(max_length=200, blank=True)
    utm_medium = models.CharField(max_length=200, blank=True)
    utm_campaign = models.CharField(max_length=200, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.ip_address} - {self.path} - {self.timestamp}"
