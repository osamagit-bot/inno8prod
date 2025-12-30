from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from .serializers import *

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {'username': user.username, 'is_staff': user.is_staff}
        })
    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['GET'])
def site_settings_view(request):
    settings = SiteSettings.objects.first()
    if settings:
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data)
    return Response({})

@api_view(['GET'])
def menu_items_view(request):
    items = MenuItem.objects.filter(is_active=True).order_by('order')
    serializer = MenuItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_menu_items_view(request):
    try:
        # Clear existing menu items
        MenuItem.objects.all().delete()
        
        # Create parent items first
        parent_items = [item for item in request.data if not item.get('parent')]
        child_items = [item for item in request.data if item.get('parent')]
        
        # Create parent items
        created_parents = {}
        for item_data in parent_items:
            menu_item = MenuItem.objects.create(
                name=item_data['name'],
                url=item_data['url'],
                order=item_data['order'],
                parent=None,
                is_active=True
            )
            created_parents[item_data.get('id')] = menu_item
        
        # Create child items
        for item_data in child_items:
            parent_id = item_data.get('parent')
            parent_obj = created_parents.get(parent_id)
            
            MenuItem.objects.create(
                name=item_data['name'],
                url=item_data['url'],
                order=item_data['order'],
                parent=parent_obj,
                is_active=True
            )
        
        return Response({'success': True})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_site_settings_view(request):
    settings, created = SiteSettings.objects.get_or_create(id=1)
    serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def hero_sections_view(request):
    sections = HeroSection.objects.filter(is_active=True).order_by('order')
    serializer = HeroSectionSerializer(sections, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def color_palette_view(request):
    palette = ColorPalette.objects.filter(is_active=True).first()
    if palette:
        serializer = ColorPaletteSerializer(palette)
        return Response(serializer.data)
    return Response({
        'primary_color': '#0477BF',
        'secondary_color': '#012340', 
        'accent_color': '#FCB316',
        'light_color': '#048ABF'
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_all_hero_sections(request):
    HeroSection.objects.all().delete()
    return Response({'success': True})

@api_view(['GET'])
def about_section_view(request):
    about = AboutSection.objects.first()
    if about:
        serializer = AboutSectionSerializer(about)
        return Response(serializer.data)
    return Response({})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_about_section_view(request):
    about, created = AboutSection.objects.get_or_create(id=1)
    serializer = AboutSectionSerializer(about, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def services_section_view(request):
    services_section = ServicesSection.objects.first()
    if services_section:
        serializer = ServicesSectionSerializer(services_section)
        return Response(serializer.data)
    return Response({})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_services_section_view(request):
    services_section, created = ServicesSection.objects.get_or_create(id=1)
    serializer = ServicesSectionSerializer(services_section, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def services_view(request):
    services = Service.objects.filter(is_active=True).order_by('order')
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def projects_view(request):
    projects = Project.objects.filter(is_active=True).order_by('-created_at')
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def why_choose_us_view(request):
    features = WhyChooseUsFeature.objects.filter(is_active=True).order_by('order')
    serializer = WhyChooseUsFeatureSerializer(features, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def why_choose_us_section_view(request):
    section = WhyChooseUsSection.objects.first()
    if section:
        serializer = WhyChooseUsSectionSerializer(section)
        return Response(serializer.data)
    return Response({})

@api_view(['GET'])
def client_logos_view(request):
    logos = ClientLogo.objects.filter(is_active=True).order_by('order')
    serializer = ClientLogoSerializer(logos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def working_process_view(request):
    steps = WorkingProcessStep.objects.filter(is_active=True).order_by('order')
    serializer = WorkingProcessStepSerializer(steps, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_working_process_section_view(request):
    section, created = WorkingProcessSection.objects.get_or_create(id=1)
    serializer = WorkingProcessSectionSerializer(section, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def working_process_section_view(request):
    section = WorkingProcessSection.objects.first()
    if section:
        serializer = WorkingProcessSectionSerializer(section)
        return Response(serializer.data)
    return Response({})

@api_view(['GET'])
def color_palette_view(request):
    palette = ColorPalette.objects.filter(is_active=True).first()
    if palette:
        serializer = ColorPaletteSerializer(palette)
        return Response(serializer.data)
    return Response({
        'primary_color': '#0477BF',
        'secondary_color': '#012340', 
        'accent_color': '#FCB316',
        'light_color': '#048ABF'
    })

class ColorPaletteViewSet(viewsets.ModelViewSet):
    queryset = ColorPalette.objects.all()
    serializer_class = ColorPaletteSerializer
    permission_classes = [IsAuthenticated]

class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [IsAuthenticated]

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

class HeroSectionViewSet(viewsets.ModelViewSet):
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer
    permission_classes = [IsAuthenticated]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
def testimonials_view(request):
    testimonials = Testimonial.objects.filter(is_active=True).order_by('order')
    serializer = TestimonialSerializer(testimonials, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def testimonials_section_view(request):
    section = TestimonialsSection.objects.first()
    if section:
        serializer = TestimonialsSectionSerializer(section)
        return Response(serializer.data)
    return Response({})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_testimonials_section_view(request):
    section, created = TestimonialsSection.objects.get_or_create(id=1)
    serializer = TestimonialsSectionSerializer(section, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticated]

class TestimonialsSectionViewSet(viewsets.ModelViewSet):
    queryset = TestimonialsSection.objects.all()
    serializer_class = TestimonialsSectionSerializer
    permission_classes = [IsAuthenticated]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class AboutSectionViewSet(viewsets.ModelViewSet):
    queryset = AboutSection.objects.all()
    serializer_class = AboutSectionSerializer
    permission_classes = [IsAuthenticated]

class ServicesSectionViewSet(viewsets.ModelViewSet):
    queryset = ServicesSection.objects.all()
    serializer_class = ServicesSectionSerializer
    permission_classes = [IsAuthenticated]

class WhyChooseUsFeatureViewSet(viewsets.ModelViewSet):
    queryset = WhyChooseUsFeature.objects.all()
    serializer_class = WhyChooseUsFeatureSerializer
    permission_classes = [IsAuthenticated]

class WhyChooseUsSectionViewSet(viewsets.ModelViewSet):
    queryset = WhyChooseUsSection.objects.all()
    serializer_class = WhyChooseUsSectionSerializer
    permission_classes = [IsAuthenticated]

class ClientLogoViewSet(viewsets.ModelViewSet):
    queryset = ClientLogo.objects.all()
    serializer_class = ClientLogoSerializer
    permission_classes = [IsAuthenticated]

class WorkingProcessStepViewSet(viewsets.ModelViewSet):
    queryset = WorkingProcessStep.objects.all()
    serializer_class = WorkingProcessStepSerializer
    permission_classes = [IsAuthenticated]

class WorkingProcessSectionViewSet(viewsets.ModelViewSet):
    queryset = WorkingProcessSection.objects.all()
    serializer_class = WorkingProcessSectionSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
def contact_info_view(request):
    contact_info = ContactInfo.objects.filter(is_active=True).order_by('order')
    serializer = ContactInfoSerializer(contact_info, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def contact_section_view(request):
    section = ContactSection.objects.first()
    if section:
        serializer = ContactSectionSerializer(section)
        return Response(serializer.data)
    return Response({})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_contact_section_view(request):
    section, created = ContactSection.objects.get_or_create(id=1)
    serializer = ContactSectionSerializer(section, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer
    permission_classes = [IsAuthenticated]

class ContactSectionViewSet(viewsets.ModelViewSet):
    queryset = ContactSection.objects.all()
    serializer_class = ContactSectionSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
def blog_posts_view(request):
    posts = BlogPost.objects.filter(is_active=True).order_by('date_published')[:6]
    serializer = BlogPostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def blogs_section_view(request):
    section = BlogsSection.objects.first()
    if section:
        serializer = BlogsSectionSerializer(section)
        return Response(serializer.data)
    return Response({})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_blogs_section_view(request):
    section, created = BlogsSection.objects.get_or_create(id=1)
    serializer = BlogsSectionSerializer(section, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

class BlogsSectionViewSet(viewsets.ModelViewSet):
    queryset = BlogsSection.objects.all()
    serializer_class = BlogsSectionSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
def team_members_view(request):
    members = TeamMember.objects.filter(is_active=True).order_by('order')
    serializer = TeamMemberSerializer(members, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def team_section_view(request):
    section = TeamSection.objects.first()
    if section:
        serializer = TeamSectionSerializer(section)
        return Response(serializer.data)
    return Response({})

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAuthenticated]

class TeamSectionViewSet(viewsets.ModelViewSet):
    queryset = TeamSection.objects.all()
    serializer_class = TeamSectionSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
def contact_submit_view(request):
    serializer = ContactSubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True, 'message': 'Contact form submitted successfully'})
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contact_submissions_view(request):
    submissions = ContactSubmission.objects.all().order_by('-submitted_at')
    serializer = ContactSubmissionSerializer(submissions, many=True)
    return Response(serializer.data)

class ContactSubmissionViewSet(viewsets.ModelViewSet):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
def faqs_view(request):
    faqs = FAQ.objects.filter(is_active=True).order_by('order')
    serializer = FAQSerializer(faqs, many=True)
    return Response(serializer.data)

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsAuthenticated]