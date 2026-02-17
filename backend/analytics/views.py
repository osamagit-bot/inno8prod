from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from django.db.models.functions import TruncDate, TruncMonth, TruncYear
from django.utils import timezone
from datetime import timedelta
from .models import PageVisit
import requests
from urllib.parse import urlparse, parse_qs

def get_location_from_ip(ip):
    if ip == '127.0.0.1':
        return 'Local', 'Local'
    try:
        res = requests.get(f'http://ip-api.com/json/{ip}', timeout=2)
        data = res.json()
        return data.get('country', ''), data.get('city', '')
    except:
        return '', ''

def parse_user_agent(ua):
    ua_lower = ua.lower()
    if 'mobile' in ua_lower or 'android' in ua_lower or 'iphone' in ua_lower:
        device = 'Mobile'
    elif 'tablet' in ua_lower or 'ipad' in ua_lower:
        device = 'Tablet'
    else:
        device = 'Desktop'
    
    if 'chrome' in ua_lower and 'edg' not in ua_lower:
        browser = 'Chrome'
    elif 'firefox' in ua_lower:
        browser = 'Firefox'
    elif 'safari' in ua_lower and 'chrome' not in ua_lower:
        browser = 'Safari'
    elif 'edg' in ua_lower:
        browser = 'Edge'
    else:
        browser = 'Other'
    
    return device, browser

def categorize_traffic_source(referrer, utm_source):
    if utm_source:
        utm_lower = utm_source.lower()
        if 'facebook' in utm_lower or 'fb' in utm_lower:
            return 'Facebook'
        elif 'instagram' in utm_lower or 'ig' in utm_lower:
            return 'Instagram'
        elif 'twitter' in utm_lower or 'x.com' in utm_lower:
            return 'Twitter'
        elif 'linkedin' in utm_lower:
            return 'LinkedIn'
        elif 'tiktok' in utm_lower:
            return 'TikTok'
        elif 'youtube' in utm_lower:
            return 'YouTube'
    
    if not referrer:
        return 'Direct'
    
    ref_lower = referrer.lower()
    if 'facebook.com' in ref_lower or 'fb.com' in ref_lower or 'm.facebook.com' in ref_lower:
        return 'Facebook'
    elif 'instagram.com' in ref_lower or 'l.instagram.com' in ref_lower:
        return 'Instagram'
    elif 'twitter.com' in ref_lower or 't.co' in ref_lower or 'x.com' in ref_lower:
        return 'Twitter'
    elif 'linkedin.com' in ref_lower or 'lnkd.in' in ref_lower:
        return 'LinkedIn'
    elif 'tiktok.com' in ref_lower:
        return 'TikTok'
    elif 'youtube.com' in ref_lower or 'youtu.be' in ref_lower:
        return 'YouTube'
    elif 'google.com' in ref_lower or 'google.' in ref_lower:
        return 'Google'
    elif 'bing.com' in ref_lower:
        return 'Bing'
    else:
        return 'Other'

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_stats(request):
    period = request.GET.get('period', 'daily')
    
    if period == 'daily':
        base_stats = PageVisit.objects.filter(
            timestamp__gte=timezone.now() - timedelta(days=30)
        ).annotate(
            date=TruncDate('timestamp')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('-date')
        
        # Get IP addresses for each date
        stats = []
        for stat in base_stats:
            ip_data = PageVisit.objects.filter(
                timestamp__date=stat['date']
            ).values('ip_address').annotate(visit_count=Count('id')).order_by('-visit_count')
            stats.append({
                'date': stat['date'],
                'count': stat['count'],
                'ip_data': list(ip_data)
            })
    
    elif period == 'monthly':
        base_stats = PageVisit.objects.filter(
            timestamp__gte=timezone.now() - timedelta(days=365)
        ).annotate(
            month=TruncMonth('timestamp')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('-month')
        
        stats = []
        for stat in base_stats:
            ip_data = PageVisit.objects.filter(
                timestamp__year=stat['month'].year,
                timestamp__month=stat['month'].month
            ).values('ip_address').annotate(visit_count=Count('id')).order_by('-visit_count')
            stats.append({
                'month': stat['month'],
                'count': stat['count'],
                'ip_data': list(ip_data)
            })
    
    elif period == 'yearly':
        base_stats = PageVisit.objects.annotate(
            year=TruncYear('timestamp')
        ).values('year').annotate(
            count=Count('id')
        ).order_by('-year')
        
        stats = []
        for stat in base_stats:
            ip_data = PageVisit.objects.filter(
                timestamp__year=stat['year'].year
            ).values('ip_address').annotate(visit_count=Count('id')).order_by('-visit_count')
            stats.append({
                'year': stat['year'],
                'count': stat['count'],
                'ip_data': list(ip_data)
            })
    
    else:
        return Response({'error': 'Invalid period'}, status=400)
    
    unique_visitors = PageVisit.objects.values('ip_address').distinct().count()
    top_pages = PageVisit.objects.exclude(path__startswith='/login').exclude(path__startswith='/admin').values('path').annotate(count=Count('id')).order_by('-count')[:10]
    device_stats = PageVisit.objects.values('device_type').annotate(count=Count('id')).order_by('-count')
    browser_stats = PageVisit.objects.values('browser').annotate(count=Count('id')).order_by('-count')
    country_stats = PageVisit.objects.exclude(country='').values('country').annotate(count=Count('id')).order_by('-count')[:10]
    referrer_stats = PageVisit.objects.exclude(referrer='').exclude(referrer__contains='localhost').exclude(referrer__contains='127.0.0.1').values('referrer').annotate(count=Count('id')).order_by('-count')[:10]
    traffic_source_stats = PageVisit.objects.values('traffic_source').annotate(count=Count('id')).order_by('-count')
    social_media_stats = PageVisit.objects.filter(
        traffic_source__in=['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube']
    ).values('traffic_source').annotate(count=Count('id')).order_by('-count')
    
    return Response({
        'period': period,
        'stats': stats,
        'total': PageVisit.objects.count(),
        'unique_visitors': unique_visitors,
        'top_pages': list(top_pages),
        'device_stats': list(device_stats),
        'browser_stats': list(browser_stats),
        'country_stats': list(country_stats),
        'referrer_stats': list(referrer_stats),
        'traffic_source_stats': list(traffic_source_stats),
        'social_media_stats': list(social_media_stats)
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_analytics(request):
    PageVisit.objects.all().delete()
    return Response({'success': True, 'message': 'All analytics data cleared'})

@api_view(['POST'])
@permission_classes([AllowAny])
def track_visit(request):
    ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '127.0.0.1')).split(',')[0]
    user_agent = request.data.get('user_agent', '')
    device, browser = parse_user_agent(user_agent)
    country, city = get_location_from_ip(ip)
    
    path = request.data.get('path', '/')
    referrer = request.data.get('referrer', '')[:500]
    
    # Parse UTM parameters from path
    utm_source = utm_medium = utm_campaign = ''
    try:
        parsed = urlparse(path)
        params = parse_qs(parsed.query)
        utm_source = params.get('utm_source', [''])[0][:200]
        utm_medium = params.get('utm_medium', [''])[0][:200]
        utm_campaign = params.get('utm_campaign', [''])[0][:200]
    except:
        pass
    
    traffic_source = categorize_traffic_source(referrer, utm_source)
    
    PageVisit.objects.create(
        ip_address=ip,
        user_agent=user_agent[:500],
        path=path,
        device_type=device,
        browser=browser,
        country=country,
        city=city,
        referrer=referrer,
        traffic_source=traffic_source,
        utm_source=utm_source,
        utm_medium=utm_medium,
        utm_campaign=utm_campaign
    )
    return Response({'success': True})
