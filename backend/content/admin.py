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