from rest_framework import serializers
from .models import *

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'

class MenuItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = MenuItem
        fields = '__all__'
    
    def get_children(self, obj):
        children = MenuItem.objects.filter(parent=obj, is_active=True)
        return MenuItemSerializer(children, many=True).data

class ColorPaletteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorPalette
        fields = '__all__'

class HeroSectionSerializer(serializers.ModelSerializer):
    backgroundImage = serializers.SerializerMethodField()
    buttonText = serializers.CharField(source='button_text')
    
    class Meta:
        model = HeroSection
        fields = ['id', 'title', 'subtitle', 'description', 'buttonText', 'backgroundImage', 'background_image', 'order', 'is_active']
    
    def get_backgroundImage(self, obj):
        if obj.background_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.background_image.url)
            return f"http://localhost:8010{obj.background_image.url}"
        return None

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class TestimonialsSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestimonialsSection
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class AboutSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutSection
        fields = '__all__'

class ServicesSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicesSection
        fields = '__all__'

class WhyChooseUsFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyChooseUsFeature
        fields = '__all__'

class WhyChooseUsSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyChooseUsSection
        fields = '__all__'

class ClientLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientLogo
        fields = '__all__'

class WorkingProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingProcessStep
        fields = '__all__'

class WorkingProcessSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingProcessSection
        fields = '__all__'

class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = '__all__'

class ContactSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSection
        fields = '__all__'

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'

class BlogsSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogsSection
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'

class TeamSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamSection
        fields = '__all__'

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = '__all__'
        read_only_fields = ['submitted_at']

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'

class TestimonialSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestimonialSubmission
        fields = '__all__'
        read_only_fields = ['submitted_at']