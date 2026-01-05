from django.db import models

class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default="Inno8 Solutions")
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    mobile_logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    email = models.EmailField(default="info.inno8sh@gmail.com")
    phone = models.CharField(max_length=20, default="+93 711 167 380")
    address = models.CharField(max_length=200, default="Kabul, Afghanistan")
    working_hours = models.CharField(max_length=50, default="9:00 am - 6:00 pm")
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    telegram_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    maintenance_mode = models.BooleanField(default=False)
    
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
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']

class TestimonialsSection(models.Model):
    subtitle = models.CharField(max_length=100, default="Client Testimonials")
    title = models.CharField(max_length=200, default="What Our Clients Say")
    description = models.TextField(default="Don't just take our word for it. Here's what our satisfied clients have to say about our services.")
    
    class Meta:
        verbose_name = "Testimonials Section"
        verbose_name_plural = "Testimonials Section"
    
class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/', null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    learn_more_url = models.URLField(null=True, blank=True)
    live_preview_url = models.URLField(null=True, blank=True)
    technologies = models.CharField(max_length=200)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class AboutSection(models.Model):
    subtitle = models.CharField(max_length=100, default="About Your Company")
    title = models.CharField(max_length=200, default="We Execute Ideas\nFrom Start to Finish")
    button_text = models.CharField(max_length=50, default="Know More")
    # Company Overview fields
    overview_title = models.CharField(max_length=100, default="Company Overview")
    overview_description1 = models.TextField(default="Founded with a vision to bridge the gap between innovative technology and business success, Inno8 has been at the forefront of digital transformation.")
    overview_description2 = models.TextField(default="Our team combines technical expertise with creative thinking to deliver solutions that are functional, user-friendly and scalable.")
    projects_count = models.IntegerField(default=50)
    years_experience = models.IntegerField(default=5)
    # Mission & Vision fields
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

class WhyChooseUsFeature(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_svg = models.TextField(help_text="SVG icon code")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Why Choose Us Feature"
        verbose_name_plural = "Why Choose Us Features"
    
    def __str__(self):
        return self.title

class WhyChooseUsSection(models.Model):
    subtitle = models.CharField(max_length=100, default="OUR STRENGTHS")
    title = models.CharField(max_length=200, default="WHY CHOOSE INNO8")
    breadcrumb_items = models.CharField(max_length=200, default="Experience,Innovation,Results", help_text="Comma separated items")
    
    class Meta:
        verbose_name = "Why Choose Us Section"
        verbose_name_plural = "Why Choose Us Section"

class ClientLogo(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='clients/')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Client Logo"
        verbose_name_plural = "Client Logos"
    
    def __str__(self):
        return self.name

class WorkingProcessStep(models.Model):
    number = models.CharField(max_length=10, default="01")
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_svg = models.TextField(help_text="SVG icon code")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Working Process Step"
        verbose_name_plural = "Working Process Steps"
    
    def __str__(self):
        return f"{self.number} - {self.title}"

class WorkingProcessSection(models.Model):
    subtitle = models.CharField(max_length=100, default="How We Work")
    title = models.CharField(max_length=200, default="Our Working Process")
    description = models.TextField(default="We follow a proven methodology to deliver exceptional results for every project")
    
    class Meta:
        verbose_name = "Working Process Section"
        verbose_name_plural = "Working Process Section"

class ContactInfo(models.Model):
    title = models.CharField(max_length=100)
    value = models.CharField(max_length=200)
    icon_svg = models.TextField(help_text="SVG icon code")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Contact Info"
        verbose_name_plural = "Contact Info"
    
    def __str__(self):
        return self.title

class ContactSection(models.Model):
    subtitle = models.CharField(max_length=100, default="Get In Touch")
    title = models.CharField(max_length=200, default="Contact Us")
    description = models.TextField(default="Ready to transform your ideas into reality? Let's build something amazing together.")
    
    class Meta:
        verbose_name = "Contact Section"
        verbose_name_plural = "Contact Section"

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    excerpt = models.TextField(max_length=300)
    content = models.TextField()
    image = models.ImageField(upload_to='blogs/', null=True, blank=True)
    author = models.CharField(max_length=100, default="Inno8 Team")
    category = models.CharField(max_length=50, default="DEVELOPMENT")
    date_published = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-date_published']
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"
    
    def __str__(self):
        return self.title

class BlogsSection(models.Model):
    subtitle = models.CharField(max_length=100, default="Latest News")
    title = models.CharField(max_length=200, default="Our Blog")
    description = models.TextField(default="Stay updated with our latest insights, tips, and industry news.")
    
    class Meta:
        verbose_name = "Blogs Section"
        verbose_name_plural = "Blogs Section"

class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    image = models.ImageField(upload_to='team/')
    rss_url = models.URLField(null=True, blank=True)
    pinterest_url = models.URLField(null=True, blank=True)
    google_plus_url = models.URLField(null=True, blank=True)
    facebook_url = models.URLField(null=True, blank=True)
    twitter_url = models.URLField(null=True, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"
    
    def __str__(self):
        return f"{self.name} - {self.position}"

class TeamSection(models.Model):
    subtitle = models.CharField(max_length=100, default="OUR PROFESSIONAL")
    title = models.CharField(max_length=200, default="Meet Our Experts People")
    
    class Meta:
        verbose_name = "Team Section"
        verbose_name_plural = "Team Section"

class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "Contact Submission"
        verbose_name_plural = "Contact Submissions"
    
    def __str__(self):
        return f"{self.name} - {self.email} ({self.submitted_at.strftime('%Y-%m-%d %H:%M')})"

class FAQ(models.Model):
    question = models.CharField(max_length=300)
    answer = models.TextField()
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
    
    def __str__(self):
        return self.question

class TestimonialSubmission(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    content = models.TextField()
    rating = models.IntegerField(default=5)
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "Testimonial Submission"
        verbose_name_plural = "Testimonial Submissions"
    
    def __str__(self):
        return f"{self.name} - {self.company} ({self.submitted_at.strftime('%Y-%m-%d %H:%M')})"