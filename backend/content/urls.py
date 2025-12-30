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
router.register('testimonials-sections', views.TestimonialsSectionViewSet)
router.register('projects', views.ProjectViewSet)
router.register('about-sections', views.AboutSectionViewSet)
router.register('services-sections', views.ServicesSectionViewSet)
router.register('why-choose-us-features', views.WhyChooseUsFeatureViewSet)
router.register('why-choose-us-sections', views.WhyChooseUsSectionViewSet)
router.register('working-process', views.WorkingProcessStepViewSet)
router.register('working-process-sections', views.WorkingProcessSectionViewSet)
router.register('client-logos', views.ClientLogoViewSet)
router.register('contact-info', views.ContactInfoViewSet)
router.register('contact-sections', views.ContactSectionViewSet)
router.register('blog-posts', views.BlogPostViewSet)
router.register('blogs-sections', views.BlogsSectionViewSet)
router.register('team-members', views.TeamMemberViewSet)
router.register('team-sections', views.TeamSectionViewSet)
router.register('contact-submissions', views.ContactSubmissionViewSet)
router.register('faqs', views.FAQViewSet)

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
    path('testimonials/', views.testimonials_view, name='testimonials'),
    path('testimonials-section/', views.testimonials_section_view, name='testimonials-section'),
    path('contact-info/', views.contact_info_view, name='contact-info'),
    path('contact-section/', views.contact_section_view, name='contact-section'),
    path('blog-posts/', views.blog_posts_view, name='blog-posts'),
    path('blogs-section/', views.blogs_section_view, name='blogs-section'),
    path('team-members/', views.team_members_view, name='team-members'),
    path('team-section/', views.team_section_view, name='team-section'),
    path('contact-submit/', views.contact_submit_view, name='contact-submit'),
    path('contact-submissions/', views.contact_submissions_view, name='contact-submissions'),
    path('faqs/', views.faqs_view, name='faqs'),
    path('admin/about-section/', views.admin_about_section_view, name='admin-about-section'),
    path('admin/services-section/', views.admin_services_section_view, name='admin-services-section'),
    path('admin/testimonials-section/', views.admin_testimonials_section_view, name='admin-testimonials-section'),
    path('admin/contact-section/', views.admin_contact_section_view, name='admin-contact-section'),
    path('admin/blogs-section/', views.admin_blogs_section_view, name='admin-blogs-section'),
    path('admin/hero-sections/delete-all/', views.delete_all_hero_sections, name='delete-all-hero-sections'),
    path('admin/site-settings/', views.admin_site_settings_view, name='admin-site-settings'),
    path('admin/menu-items/', views.admin_menu_items_view, name='admin-menu-items'),
    path('admin/', include(router.urls)),
]