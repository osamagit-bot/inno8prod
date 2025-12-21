from django.db import models

class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default="Inno8 Solutions")
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    mobile_logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    email = models.EmailField(default="info.inno8sh@gmail.com")
    phone = models.CharField(max_length=20, default="+93 711 167 380")
    address = models.CharField(max_length=200, default="Kabul, Afghanistan")
    working_hours = models.CharField(max_length=50, default="9:00 am - 6:00 pm")
    
    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

class MenuItem(models.Model):
    name = models.CharField(max_length=50)
    url = models.CharField(max_length=200)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']

class ColorPalette(models.Model):
    name = models.CharField(max_length=50, unique=True)
    primary_color = models.CharField(max_length=7, default="#0477BF")  # Blue
    secondary_color = models.CharField(max_length=7, default="#012340")  # Dark Blue
    accent_color = models.CharField(max_length=7, default="#FCB316")  # Orange
    light_color = models.CharField(max_length=7, default="#048ABF")  # Light Blue
    is_active = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Color Palette"
        verbose_name_plural = "Color Palettes"

class HeroSection(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=100)
    description = models.TextField(default="Default description")
    button_text = models.CharField(max_length=50, default="Get Started")
    button_url = models.CharField(max_length=200, default="/contact")
    background_image = models.ImageField(upload_to='hero/', null=True, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Sections"
    
class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, null=True, blank=True)
    icon_svg = models.TextField(null=True, blank=True, help_text="Custom SVG icon code")
    image = models.ImageField(upload_to='services/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']

class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    content = models.TextField()
    image = models.ImageField(upload_to='testimonials/', null=True, blank=True)
    rating = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    
class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    url = models.URLField(null=True, blank=True)
    technologies = models.CharField(max_length=200)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class AboutSection(models.Model):
    subtitle = models.CharField(max_length=100, default="About Your Company")
    title = models.CharField(max_length=200, default="We Execute Ideas\nFrom Start to Finish")
    button_text = models.CharField(max_length=50, default="Know More")
    mission_title = models.CharField(max_length=100, default="Our Mission")
    mission_description = models.TextField(default="Our mission is to push boundaries, engage audiences, drive innovation through cutting-edge technology solutions.")
    vision_title = models.CharField(max_length=100, default="Our Vision")
    vision_description = models.TextField(default="To become the leading software house that transforms businesses through innovative digital solutions and exceptional user experiences.")
    image1 = models.ImageField(upload_to='about/', null=True, blank=True)
    image2 = models.ImageField(upload_to='about/', null=True, blank=True)
    floating_text = models.TextField(default="Repellendus autem ruibusdam at aut officiis debitis aut re necessitatibus saepe eveniet ut et repudianda sint et molestiae non recusandae.")
    
    class Meta:
        verbose_name = "About Section"
        verbose_name_plural = "About Section"

class ServicesSection(models.Model):
    subtitle = models.CharField(max_length=100, default="OUR OFFERING")
    title = models.CharField(max_length=200, default="Enhance And Pioneer Using")
    title_highlight = models.CharField(max_length=100, default="Technology Trends")
    button_text = models.CharField(max_length=50, default="Explore More")
    
    class Meta:
        verbose_name = "Services Section"
        verbose_name_plural = "Services Section"