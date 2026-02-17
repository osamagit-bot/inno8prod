from django.core.management.base import BaseCommand
from django.db.models import Count
from django.db.models.functions import TruncDate, TruncMonth, TruncYear
from django.utils import timezone
from datetime import timedelta
from analytics.models import PageVisit

class Command(BaseCommand):
    help = 'Display website analytics statistics'

    def add_arguments(self, parser):
        parser.add_argument(
            '--period',
            type=str,
            default='daily',
            choices=['daily', 'monthly', 'yearly'],
            help='Period for statistics (daily, monthly, yearly)'
        )

    def handle(self, *args, **options):
        period = options['period']
        
        self.stdout.write(self.style.SUCCESS(f'\n=== Website Analytics ({period.upper()}) ===\n'))
        
        total = PageVisit.objects.count()
        self.stdout.write(f'Total Visits: {total}\n')
        
        if period == 'daily':
            stats = PageVisit.objects.filter(
                timestamp__gte=timezone.now() - timedelta(days=30)
            ).annotate(
                date=TruncDate('timestamp')
            ).values('date').annotate(count=Count('id')).order_by('-date')
            
            for stat in stats:
                self.stdout.write(f"{stat['date']}: {stat['count']} visits")
        
        elif period == 'monthly':
            stats = PageVisit.objects.annotate(
                month=TruncMonth('timestamp')
            ).values('month').annotate(count=Count('id')).order_by('-month')[:12]
            
            for stat in stats:
                self.stdout.write(f"{stat['month'].strftime('%B %Y')}: {stat['count']} visits")
        
        elif period == 'yearly':
            stats = PageVisit.objects.annotate(
                year=TruncYear('timestamp')
            ).values('year').annotate(count=Count('id')).order_by('-year')
            
            for stat in stats:
                self.stdout.write(f"{stat['year'].year}: {stat['count']} visits")
