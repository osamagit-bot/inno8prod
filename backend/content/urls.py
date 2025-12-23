from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('site-settings', views.SiteSettingsViewSet)
router.register('menu-items', views.MenuItemViewSet)
router.register('hero-sections', views.HeroSectionViewSet)
router.register('color-palettes', views.ColorPaletteViewSet)
router.register('services', views.ServiceViewSet)
router.register('testimonials', views.TestimonialViewSet)
router.register('projects', views.ProjectViewSet)
router.register('about-sections', views.AboutSectionViewSet)
router.register('services-sections', views.ServicesSectionViewSet)
router.register('why-choose-us-features', views.WhyChooseUsFeatureViewSet)
router.register('why-choose-us-sections', views.WhyChooseUsSectionViewSet)
router.register('working-process', views.WorkingProcessStepViewSet)
router.register('working-process-sections', views.WorkingProcessSectionViewSet)
router.register('client-logos', views.ClientLogoViewSet)

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('site-settings/', views.site_settings_view, name='site-settings'),
    path('menu-items/', views.menu_items_view, name='menu-items'),
    path('hero-sections/', views.hero_sections_view, name='hero-sections'),
    path('color-palette/', views.color_palette_view, name='color-palette'),
    path('about-section/', views.about_section_view, name='about-section'),
    path('services-section/', views.services_section_view, name='services-section'),
    path('services/', views.services_view, name='services'),
    path('projects/', views.projects_view, name='projects'),
    path('why-choose-us/', views.why_choose_us_view, name='why-choose-us'),
    path('why-choose-us-section/', views.why_choose_us_section_view, name='why-choose-us-section'),
    path('working-process/', views.working_process_view, name='working-process'),
    path('working-process-section/', views.working_process_section_view, name='working-process-section'),
    path('client-logos/', views.client_logos_view, name='client-logos'),
    path('admin/about-section/', views.admin_about_section_view, name='admin-about-section'),
    path('admin/services-section/', views.admin_services_section_view, name='admin-services-section'),
    path('admin/hero-sections/delete-all/', views.delete_all_hero_sections, name='delete-all-hero-sections'),
    path('admin/site-settings/', views.admin_site_settings_view, name='admin-site-settings'),
    path('admin/menu-items/', views.admin_menu_items_view, name='admin-menu-items'),
    path('admin/', include(router.urls)),
]