from django.contrib import admin
from .models import *

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['site_name', 'email', 'phone']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'url', 'parent', 'order', 'is_active']
    list_filter = ['is_active', 'parent']

@admin.register(ColorPalette)
class ColorPaletteAdmin(admin.ModelAdmin):
    list_display = ['name', 'primary_color', 'secondary_color', 'accent_color', 'light_color', 'is_active']
    list_filter = ['is_active']

@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'subtitle', 'order', 'is_active']
    list_filter = ['is_active']
    ordering = ['order']

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'is_active']
    list_filter = ['is_active']

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'rating', 'is_active']
    list_filter = ['is_active', 'rating']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_featured', 'is_active', 'created_at']
    list_filter = ['is_featured', 'is_active']

@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = ['subtitle', 'title']
    fieldsets = (
        ('Main Content', {
            'fields': ('subtitle', 'title', 'button_text')
        }),
        ('Company Overview (About Page)', {
            'fields': ('overview_title', 'overview_description1', 'overview_description2', 'projects_count', 'years_experience')
        }),
        ('Mission & Vision', {
            'fields': ('mission_title', 'mission_description', 'vision_title', 'vision_description')
        }),
        ('Images & Text', {
            'fields': ('image1', 'image2', 'floating_text')
        }),
    )

@admin.register(WhyChooseUsFeature)
class WhyChooseUsFeatureAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'is_active']
    list_filter = ['is_active']
    ordering = ['order']

@admin.register(WhyChooseUsSection)
class WhyChooseUsSectionAdmin(admin.ModelAdmin):
    list_display = ['subtitle', 'title']

@admin.register(ClientLogo)
class ClientLogoAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'is_active']
    list_filter = ['is_active']
    ordering = ['order']

@admin.register(WorkingProcessStep)
class WorkingProcessStepAdmin(admin.ModelAdmin):
    list_display = ['number', 'title', 'order', 'is_active']
    list_filter = ['is_active']
    ordering = ['order']
    fieldsets = (
        ('Basic Info', {
            'fields': ('number', 'title', 'description', 'order', 'is_active')
        }),
        ('Icon', {
            'fields': ('icon_svg',),
            'description': 'Add SVG icon code here'
        }),
    )

@admin.register(WorkingProcessSection)
class WorkingProcessSectionAdmin(admin.ModelAdmin):
    list_display = ['subtitle', 'title']
    fieldsets = (
        ('Section Content', {
            'fields': ('subtitle', 'title', 'description')
        }),
    )

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ['title', 'value', 'order', 'is_active']
    list_filter = ['is_active']
    ordering = ['order']
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'value', 'order', 'is_active')
        }),
        ('Icon', {
            'fields': ('icon_svg',),
            'description': 'Add SVG icon code here'
        }),
    )

@admin.register(ContactSection)
class ContactSectionAdmin(admin.ModelAdmin):
    list_display = ['subtitle', 'title']
    fieldsets = (
        ('Section Content', {
            'fields': ('subtitle', 'title', 'description')
        }),
    )

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'date_published', 'is_featured', 'is_active']
    list_filter = ['is_featured', 'is_active', 'date_published']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['-date_published']

@admin.register(BlogsSection)
class BlogsSectionAdmin(admin.ModelAdmin):
    list_display = ['subtitle', 'title']
    fieldsets = (
        ('Section Content', {
            'fields': ('subtitle', 'title', 'description')
        }),
    )

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'order', 'is_active']
    list_filter = ['is_active']
    ordering = ['order']
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'position', 'image', 'order', 'is_active')
        }),
        ('Social Links', {
            'fields': ('rss_url', 'pinterest_url', 'google_plus_url', 'facebook_url', 'twitter_url')
        }),
    )

@admin.register(TeamSection)
class TeamSectionAdmin(admin.ModelAdmin):
    list_display = ['subtitle', 'title']
    fieldsets = (
        ('Section Content', {
            'fields': ('subtitle', 'title')
        }),
    )

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'submitted_at', 'is_read']
    list_filter = ['is_read', 'submitted_at']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['submitted_at']
    ordering = ['-submitted_at']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message Details', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read', 'submitted_at')
        }),
    )

@admin.register(TestimonialSubmission)
class TestimonialSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'company', 'rating', 'content_preview', 'submitted_at', 'is_approved']
    list_filter = ['is_approved', 'rating', 'submitted_at']
    search_fields = ['name', 'company', 'content']
    readonly_fields = ['submitted_at']
    ordering = ['-submitted_at']
    actions = ['add_to_testimonials']
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Review Content'
    
    def add_to_testimonials(self, request, queryset):
        count = 0
        for submission in queryset.filter(is_approved=True):
            testimonial, created = Testimonial.objects.get_or_create(
                name=submission.name,
                position=submission.position,
                company=submission.company,
                content=submission.content,
                rating=submission.rating,
                defaults={'order': 0, 'is_active': True}
            )
            if created:
                count += 1
        
        self.message_user(request, f'{count} approved submissions added to testimonials.')
    add_to_testimonials.short_description = 'Add approved submissions to testimonials'
    
    fieldsets = (
        ('Reviewer Information', {
            'fields': ('name', 'position', 'company')
        }),
        ('Review Details', {
            'fields': ('content', 'rating')
        }),
        ('Status', {
            'fields': ('is_approved', 'submitted_at')
        }),
    )

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['question', 'answer']
    ordering = ['order']