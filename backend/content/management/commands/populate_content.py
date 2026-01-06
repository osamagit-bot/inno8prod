from django.core.management.base import BaseCommand
from content.models import *

class Command(BaseCommand):
    help = 'Populate database with Afghanistan and international content'

    def handle(self, *args, **options):
        self.stdout.write('Populating database with content...')
        
        # Hero Section
    HeroSection.objects.all().delete()

    hero_sections = [
        {
            'title': 'Innovative Software Solutions for Modern Businesses',
            'subtitle': 'Empowering Digital Transformation',
            'description': 'We build powerful web, mobile, and digital solutions that help businesses grow, scale, and succeed in a competitive digital world.',
            'button_text': 'Start Your Project',
            'order': 1
        },
        {
            'title': 'Smart Digital Solutions Built for Growth',
            'subtitle': 'Technology That Drives Results',
            'description': 'From custom software to digital marketing, we deliver reliable and scalable solutions tailored to your business goals.',
            'button_text': 'Our Services',
            'order': 2
        },
        {
            'title': 'Creative, Scalable, and Future-Ready',
            'subtitle': 'Innovation Meets Execution',
            'description': 'Our expert team combines creativity and technology to build digital products that stand out and perform.',
            'button_text': 'View Portfolio',
            'order': 3
        },
        {
            'title': 'Your Trusted Digital Innovation Partner',
            'subtitle': 'Let’s Build Something Great',
            'description': 'Partner with us to turn ideas into impactful digital experiences powered by modern technologies.',
            'button_text': 'Contact Us',
            'order': 4
        }
    ]

    for hero in hero_sections:
        HeroSection.objects.create(**hero)

        
        # Services
        Service.objects.all().delete()

    services = [
        {
            'name': 'Web Development',
            'description': 'Custom websites and web applications built with modern technologies for local and international clients.',
            'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/></svg>',
            'order': 1
        },
        {
            'name': 'Graphic Design',
            'description': 'Creative graphic design services including logos, branding, social media designs, and marketing materials.',
            'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3zm4 4h10v2H7V7zm0 4h10v6H7v-6z"/></svg>',
            'order': 2
        },
        {
            'name': 'Database Development',
            'description': 'Design, development, and optimization of secure and scalable databases for business applications.',
            'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.58 2 4 3.79 4 6v12c0 2.21 3.58 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4z"/></svg>',
            'order': 3
        },
        {
            'name': 'Video Editing',
            'description': 'Professional video editing for promotional videos, social media content, and educational materials.',
            'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V6c0-1.1-.9-2-2-2H5C3.9 4 3 4.9 3 6v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4.5l4 4v-11l-4 4z"/></svg>',
            'order': 4
        },
        {
            'name': 'IT Solutions & Technical Support',
            'description': 'Reliable IT solutions, system maintenance, troubleshooting, and technical support for businesses.',
            'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>',
            'order': 5
        },
        {
            'name': 'Digital Marketing',
            'description': 'SEO, social media marketing, content creation, and online advertising to grow your brand.',
            'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm4 4h2V7H7v10zm4 2h2V3h-2v16zm4-4h2V9h-2v6zm4-6v2h2V9h-2z"/></svg>',
            'order': 6
        },
        {
            'name': 'Essay Writing',
            'description': 'Well-researched and professionally written essays for academic and professional purposes.',
            'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1 7V3.5L18.5 9H15z"/></svg>',
            'order': 7
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
       
        ]
        
        for step_data in steps:
            WorkingProcessStep.objects.create(**step_data)
        
        # Why Choose Us Features
        WhyChooseUsFeature.objects.all().delete()

    features = [
        {
            'title': 'Expert Team',
            'description': 'Our skilled professionals bring years of experience in cutting-edge technologies to deliver reliable and innovative solutions.',
            'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
            'order': 1
        },
        {
            'title': 'Quality Assurance',
            'description': 'We ensure the highest quality standards in every project we deliver through careful planning, testing, and execution.',
            'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3zm-1.2 14.2L7 12.4l1.4-1.4 2.4 2.4 4.8-4.8 1.4 1.4-6.2 6.2z"/></svg>',
            'order': 2
        },
        {
            'title': '24/7 Support',
            'description': 'Round-the-clock technical support to ensure your business systems operate smoothly without interruptions.',
            'icon_svg': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a11 11 0 100 22 11 11 0 000-22zm1 17.93c-2.83.48-5.43-1.58-5.91-4.41-.48-2.83 1.58-5.43 4.41-5.91V5h2v3.61c2.16.45 3.79 2.37 3.79 4.69 0 2.65-2.15 4.8-4.8 4.8-.17 0-.33-.01-.49-.03V19z"/></svg>',
            'order': 3
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
        title="Bridging Businesses with\nGlobal Technology",
        overview_title="Our Story",
        overview_description1="Founded with a vision to help businesses connect with global opportunities through technology. We focus on delivering practical, scalable, and future-ready digital solutions.",
        overview_description2="Our team combines technical expertise, creative thinking, and industry experience to deliver solutions that meet international standards and real-world business needs.",
        mission_title="Our Mission",
        mission_description="To deliver smart software, digital solutions, and marketing strategies that help businesses grow, connect, and succeed in the digital world.",
        vision_title="Our Vision",
        vision_description="To be a leading digital innovation agency, empowering brands through technology, creativity, and data-driven growth.",
        projects_count=100,
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