from django.core.management.base import BaseCommand
from content.models import *

class Command(BaseCommand):
    help = 'Populate database with Afghanistan and international content'

    def handle(self, *args, **options):
        self.stdout.write('Populating database with content...')
        
        # Hero Section
        HeroSection.objects.all().delete()
        HeroSection.objects.create(
            title="Innovative Software Solutions for Afghanistan & Beyond",
            subtitle="Empowering Digital Transformation",
            description="Leading software house in Afghanistan providing cutting-edge web development, mobile apps, and digital solutions to businesses across Afghanistan and internationally.",
            button_text="Start Your Project",
            order=1
        )
        
        # Services
        Service.objects.all().delete()
        services = [
            {
                'name': 'Web Development',
                'description': 'Custom websites and web applications built with modern technologies, serving clients in Kabul, Herat, Mazar-i-Sharif and internationally.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/></svg>',
                'order': 1
            },
            {
                'name': 'Mobile App Development',
                'description': 'Native and cross-platform mobile applications for iOS and Android, connecting Afghan businesses with global markets.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 19H7V5h10v14zm-1-6h-8v4h8v-4z"/></svg>',
                'order': 2
            },
            {
                'name': 'E-commerce Solutions',
                'description': 'Complete online stores and marketplace platforms helping Afghan entrepreneurs reach customers worldwide.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
                'order': 3
            },
            {
                'name': 'Digital Marketing',
                'description': 'SEO, social media marketing, and digital advertising strategies tailored for Afghan and international markets.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
                'order': 4
            }
        ]
        
        for service_data in services:
            Service.objects.create(**service_data)
        
        # Testimonials
        Testimonial.objects.all().delete()
        testimonials = [
            {
                'name': 'Ahmad Fahim',
                'position': 'CEO',
                'company': 'Kabul Tech Solutions',
                'content': 'Inno8 transformed our business with their exceptional web development services. Their understanding of both local Afghan market and international standards is remarkable.',
                'rating': 5,
                'order': 1
            },
            {
                'name': 'Sarah Johnson',
                'position': 'Marketing Director',
                'company': 'Global Ventures Inc',
                'content': 'Working with Inno8 on our Afghanistan market entry was seamless. Their team delivered a culturally appropriate yet internationally competitive solution.',
                'rating': 5,
                'order': 2
            },
            {
                'name': 'Mohammad Hashim',
                'position': 'Founder',
                'company': 'Herat Digital Hub',
                'content': 'The mobile app developed by Inno8 helped us connect with customers across Afghanistan. Their technical expertise and cultural understanding made all the difference.',
                'rating': 5,
                'order': 3
            }
        ]
        
        for testimonial_data in testimonials:
            Testimonial.objects.create(**testimonial_data)
        
        # Working Process Steps
        WorkingProcessStep.objects.all().delete()
        steps = [
            {
                'number': '01',
                'title': 'Discovery & Planning',
                'description': 'We analyze your business needs, target market (local Afghan or international), and create a comprehensive project roadmap.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19v2h-1.5v17.5c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5V4H4.5V2h5V.5c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5V2h5z"/></svg>',
                'order': 1
            },
            {
                'number': '02',
                'title': 'Design & Development',
                'description': 'Our team creates user-friendly designs and develops robust solutions using cutting-edge technologies suitable for Afghan and global markets.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
                'order': 2
            },
            {
                'number': '03',
                'title': 'Testing & Quality Assurance',
                'description': 'Rigorous testing ensures your solution works perfectly across different devices, browsers, and network conditions common in Afghanistan.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
                'order': 3
            },
            {
                'number': '04',
                'title': 'Launch & Support',
                'description': 'We deploy your solution and provide ongoing support, ensuring smooth operation and continuous improvement for your growing business.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
                'order': 4
            }
        ]
        
        for step_data in steps:
            WorkingProcessStep.objects.create(**step_data)
        
        # Why Choose Us Features
        WhyChooseUsFeature.objects.all().delete()
        features = [
            {
                'title': 'Local Expertise, Global Standards',
                'description': 'Deep understanding of Afghan market needs combined with international best practices and quality standards.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
                'order': 1
            },
            {
                'title': 'Cultural Sensitivity',
                'description': 'Solutions designed with respect for Afghan culture, traditions, and business practices while maintaining modern functionality.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
                'order': 2
            },
            {
                'title': 'Multilingual Support',
                'description': 'Fluent in Dari, Pashto, and English, ensuring clear communication and culturally appropriate solutions.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>',
                'order': 3
            },
            {
                'title': 'Affordable Excellence',
                'description': 'High-quality solutions at competitive prices, making advanced technology accessible to Afghan businesses of all sizes.',
                'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>',
                'order': 4
            }
        ]
        
        for feature_data in features:
            WhyChooseUsFeature.objects.create(**feature_data)
        
        # FAQs
        FAQ.objects.all().delete()
        faqs = [
            {
                'question': 'Do you work with international clients outside Afghanistan?',
                'answer': 'Yes, we serve clients globally while maintaining our base in Afghanistan. We have experience working with businesses across different time zones and cultural contexts.',
                'order': 1
            },
            {
                'question': 'What technologies do you use for development?',
                'answer': 'We use modern technologies including React, Next.js, Django, Flutter, and cloud platforms. Our tech stack is chosen to ensure scalability and international compatibility.',
                'order': 2
            },
            {
                'question': 'How do you handle projects for Afghan businesses?',
                'answer': 'We understand the unique challenges and opportunities in the Afghan market. Our solutions are designed to work with local infrastructure while meeting international standards.',
                'order': 3
            },
            {
                'question': 'What is your typical project timeline?',
                'answer': 'Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex applications may take 2-6 months. We provide detailed timelines during planning.',
                'order': 4
            },
            {
                'question': 'Do you provide ongoing support and maintenance?',
                'answer': 'Yes, we offer comprehensive support packages including regular updates, security monitoring, and technical assistance to ensure your solution continues to perform optimally.',
                'order': 5
            }
        ]
        
        for faq_data in faqs:
            FAQ.objects.create(**faq_data)
        
        # Update Section Headers
        TestimonialsSection.objects.all().delete()
        TestimonialsSection.objects.create(
            subtitle="Client Success Stories",
            title="Trusted by Businesses Across Afghanistan & Beyond",
            description="From Kabul to international markets, our clients trust us to deliver exceptional digital solutions that drive growth and success."
        )
        
        WorkingProcessSection.objects.all().delete()
        WorkingProcessSection.objects.create(
            subtitle="Our Methodology",
            title="How We Deliver Excellence",
            description="Our proven process ensures successful project delivery whether you're a startup in Kabul or an established business expanding internationally."
        )
        
        WhyChooseUsSection.objects.all().delete()
        WhyChooseUsSection.objects.create(
            subtitle="OUR ADVANTAGES",
            title="Why Afghan & International Businesses Choose Inno8",
            breadcrumb_items="Local Expertise,Global Standards,Cultural Understanding,Proven Results"
        )
        
        AboutSection.objects.all().delete()
        AboutSection.objects.create(
            subtitle="About Inno8 Solutions",
            title="Bridging Afghanistan with\\nGlobal Technology",
            overview_title="Our Story",
            overview_description1="Founded in Afghanistan with a vision to connect local businesses with global opportunities through technology. We understand the unique challenges and immense potential of the Afghan market.",
            overview_description2="Our team combines deep local knowledge with international experience, delivering solutions that work in Afghanistan's context while meeting global standards.",
            mission_title="Our Mission",
            mission_description="To empower Afghan businesses and international clients with innovative technology solutions that drive growth, efficiency, and global connectivity.",
            vision_title="Our Vision",
            vision_description="To be the leading technology partner for businesses in Afghanistan and the region, fostering digital transformation and economic growth through innovative solutions.",
            projects_count=75,
            years_experience=6
        )
        
        ServicesSection.objects.all().delete()
        ServicesSection.objects.create(
            subtitle="OUR EXPERTISE",
            title="Empowering Afghanistan Through",
            title_highlight="Digital Innovation",
            button_text="Explore Our Services"
        )
        
        self.stdout.write(self.style.SUCCESS('Successfully populated database with Afghanistan and international content!'))