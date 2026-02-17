from django.contrib import admin
from django.db.models import Count
from django.db.models.functions import TruncDate, TruncMonth, TruncYear
from .models import PageVisit

@admin.register(PageVisit)
class PageVisitAdmin(admin.ModelAdmin):
    list_display = ['ip_address', 'path', 'timestamp']
    list_filter = ['timestamp']
    search_fields = ['ip_address', 'path']
    readonly_fields = ['ip_address', 'user_agent', 'path', 'timestamp']
    date_hierarchy = 'timestamp'
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        
        # Daily stats
        daily_stats = PageVisit.objects.annotate(
            date=TruncDate('timestamp')
        ).values('date').annotate(count=Count('id')).order_by('-date')[:30]
        
        # Monthly stats
        monthly_stats = PageVisit.objects.annotate(
            month=TruncMonth('timestamp')
        ).values('month').annotate(count=Count('id')).order_by('-month')[:12]
        
        # Yearly stats
        yearly_stats = PageVisit.objects.annotate(
            year=TruncYear('timestamp')
        ).values('year').annotate(count=Count('id')).order_by('-year')
        
        extra_context['daily_stats'] = list(daily_stats)
        extra_context['monthly_stats'] = list(monthly_stats)
        extra_context['yearly_stats'] = list(yearly_stats)
        extra_context['total_visits'] = PageVisit.objects.count()
        
        return super().changelist_view(request, extra_context=extra_context)
