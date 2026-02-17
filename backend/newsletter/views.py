from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Subscriber
from .email_templates import get_welcome_email_html, get_notification_email_html

@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe(request):
    email = request.data.get('email', '').strip().lower()
    
    if not email:
        return Response({'error': 'Email is required'}, status=400)
    
    if Subscriber.objects.filter(email=email).exists():
        return Response({'message': 'You are already subscribed!'}, status=200)
    
    Subscriber.objects.create(email=email)
    
    # Send welcome email
    try:
        from django.core.mail import EmailMultiAlternatives
        subject = 'Welcome to Inno8 Solutions Newsletter!'
        text_content = 'Thank you for subscribing to our newsletter!\n\nYou will receive updates about our latest blogs and projects.\n\nBest regards,\nInno8 Solutions Team'
        html_content = get_welcome_email_html()
        
        msg = EmailMultiAlternatives(subject, text_content, 'Inno8 Solutions <info.inno8sh@gmail.com>', [email])
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=True)
    except:
        pass
    
    return Response({'message': 'Successfully subscribed!'}, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def unsubscribe(request):
    email = request.data.get('email', '').strip().lower()
    
    try:
        subscriber = Subscriber.objects.get(email=email)
        subscriber.is_active = False
        subscriber.save()
        return Response({'message': 'Successfully unsubscribed'}, status=200)
    except Subscriber.DoesNotExist:
        return Response({'error': 'Email not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_notification(request):
    title = request.data.get('title')
    content_type = request.data.get('type', 'blog')
    url = request.data.get('url')
    selected_emails = request.data.get('emails', [])
    
    if not title or not url:
        return Response({'error': 'Title and URL are required'}, status=400)
    
    if not selected_emails:
        return Response({'error': 'Please select at least one subscriber'}, status=400)
    
    # Verify selected emails are active subscribers
    valid_emails = list(Subscriber.objects.filter(
        email__in=selected_emails,
        is_active=True
    ).values_list('email', flat=True))
    
    if not valid_emails:
        return Response({'message': 'No valid subscribers selected'}, status=200)
    
    subject = f"🎉 New {content_type.title()}: {title}"
    text_content = f"""Hi there!

We just published a new {content_type} that you might find interesting:

📝 {title}

Check it out here: {url}

Best regards,
Inno8 Solutions Team

---
To unsubscribe, visit: {settings.FRONTEND_URL}/unsubscribe
"""
    html_content = get_notification_email_html(title, content_type, url)
    
    try:
        from django.core.mail import EmailMultiAlternatives
        for email in valid_emails:
            msg = EmailMultiAlternatives(subject, text_content, 'Inno8 Solutions <info.inno8sh@gmail.com>', [email])
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
        return Response({
            'message': f'Notification sent to {len(valid_emails)} subscribers',
            'count': len(valid_emails)
        }, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subscriber_count(request):
    count = Subscriber.objects.filter(is_active=True).count()
    return Response({'count': count}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subscriber_list(request):
    subscribers = Subscriber.objects.filter(is_active=True).values('email', 'subscribed_at')
    return Response({'subscribers': list(subscribers)}, status=200)
