// Fallback data for when backend is offline
export const fallbackData = {
  siteSettings: {
    site_name: "Inno8 Solutions",
    email: "info.inno8sh@gmail.com",
    phone: "+93 711 167 380",
    address: "Kabul, Afghanistan",
    working_hours: "9:00 am - 6:00 pm",
    facebook_url: "https://facebook.com/inno8solutions",
    instagram_url: "https://instagram.com/inno8solutions",
    telegram_url: "https://t.me/inno8solutions",
    linkedin_url: "https://linkedin.com/company/inno8solutions",
    youtube_url: "https://youtube.com/@inno8solutions",
    logo: "/images/update logo.png",
    mobile_logo: "/images/inoo8 With Bg.jpg"
  },

  menuItems: [
    { id: 1, name: 'Home', url: '/', is_active: true, order: 1 },
    { id: 2, name: 'About', url: '/about_us', is_active: true, order: 2 },
    { 
      id: 3,
      name: 'Services', 
      url: '/services',
      is_active: true,
      order: 3,
      children: [
        { name: 'Web Development', url: '/services/web-development' },
        { name: 'Mobile Apps', url: '/services/mobile-apps' },
        { name: 'Software Development', url: '/services/software-development' },
        { name: 'UI/UX Design', url: '/services/ui-ux-design' },
        { name: 'Digital Marketing', url: '/services/digital-marketing' }
      ]
    },
    { id: 4, name: 'Projects', url: '/projects', is_active: true, order: 4 },
    { id: 5, name: 'Testimonials', url: '/#testimonials', is_active: true, order: 5 },
    { id: 6, name: 'Blog', url: '/blogs', is_active: true, order: 6 },
    { id: 7, name: 'Contact Us', url: '/contact', is_active: true, order: 7 }
  ],

  heroSections: [
    {
      title: "Innovative Digital Solutions",
      subtitle: "Transform Your Business",
      description: "We create cutting-edge software solutions that drive business growth and digital transformation.",
      button_text: "Get Started",
      button_url: "/contact",
      background_image: "/images/hero.jpg",
      is_active: true
    }
  ],

  aboutSection: {
    subtitle: "About Inno8 Solutions",
    title: "We Execute Ideas\nFrom Start to Finish",
    button_text: "Know More",
    overview_title: "Company Overview",
    overview_description1: "Founded with a vision to bridge the gap between innovative technology and business success, Inno8 has been at the forefront of digital transformation.",
    overview_description2: "Our team combines technical expertise with creative thinking to deliver solutions that are functional, user-friendly and scalable.",
    projects_count: 50,
    years_experience: 5,
    mission_title: "Our Mission",
    mission_description: "Our mission is to push boundaries, engage audiences, drive innovation through cutting-edge technology solutions.",
    vision_title: "Our Vision",
    vision_description: "To become the leading software house that transforms businesses through innovative digital solutions and exceptional user experiences.",
    image1: "/images/about1.avif",
    image2: "/images/about2.webp",
    floating_text: "Repellendus autem ruibusdam at aut officiis debitis aut re necessitatibus saepe eveniet ut et repudianda sint et molestiae non recusandae."
  },

  servicesSection: {
    subtitle: "OUR OFFERING",
    title: "Enhance And Pioneer Using",
    title_highlight: "Technology Trends",
    button_text: "Explore More"
  },

  services: [
    {
      id: 1,
      name: "Web Development",
      description: "Custom web applications built with modern technologies for optimal performance and user experience.",
      icon: "web",
      icon_svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
      is_active: true,
      order: 1
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android with seamless user experiences.",
      icon: "mobile",
      icon_svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H7V6h10v10z"/></svg>`,
      is_active: true,
      order: 2
    },
    {
      id: 3,
      name: "UI/UX Design",
      description: "User-centered design solutions that create intuitive and engaging digital experiences.",
      icon: "design",
      icon_svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
      is_active: true,
      order: 3
    },
    {
      id: 4,
      name: "Digital Marketing",
      description: "Comprehensive digital marketing strategies to boost your online presence and drive growth.",
      icon: "marketing",
      icon_svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>`,
      is_active: true,
      order: 4
    }
  ],

  whyChooseUsSection: {
    subtitle: "OUR STRENGTHS",
    title: "WHY CHOOSE INNO8",
    breadcrumb_items: "Experience,Innovation,Results"
  },

  whyChooseUsFeatures: [
    {
      id: 1,
      title: "Expert Team",
      description: "Our skilled professionals bring years of experience in cutting-edge technologies.",
      icon_svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V18h2v-4h3v4h2V8.5c0-1.93-1.57-3.5-3.5-3.5S12 6.57 12 8.5V18H4z"/></svg>`,
      order: 1,
      is_active: true
    },
    {
      id: 2,
      title: "Quality Assurance",
      description: "We ensure the highest quality standards in every project we deliver.",
      icon_svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>`,
      order: 2,
      is_active: true
    },
    {
      id: 3,
      title: "24/7 Support",
      description: "Round-the-clock support to ensure your business runs smoothly.",
      icon_svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
      order: 3,
      is_active: true
    }
  ],

  workingProcessSection: {
    subtitle: "How We Work",
    title: "Our Working Process",
    description: "We follow a systematic approach to deliver exceptional results."
  },

  workingProcessSteps: [
    {
      id: 1,
      number: "01",
      title: "Discovery & Planning",
      description: "We analyze your requirements and create a comprehensive project plan.",
      icon_svg: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>`,
      order: 1,
      is_active: true
    },
    {
      id: 2,
      number: "02",
      title: "Design & Development",
      description: "Our team creates and develops your solution with attention to detail.",
      icon_svg: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>`,
      order: 2,
      is_active: true
    },
    {
      id: 3,
      number: "03",
      title: "Testing & Launch",
      description: "Rigorous testing ensures quality before we launch your project.",
      icon_svg: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
      order: 3,
      is_active: true
    }
  ],

  clientLogos: [
    {
      id: 1,
      name: "Client 1",
      logo: "/images/update logo.png",
      order: 1,
      is_active: true
    },
      {
      id: 2,
      name: "Client 2",
      logo: "/images/update logo.png",
      order: 2,
      is_active: true
    },

  ],

  testimonialsSection: {
    subtitle: "Client Testimonials",
    title: "What Our Clients Say",
    description: "Don't just take our word for it. Here's what our satisfied clients have to say about our services."
  },

  testimonials: [
    {
      id: 1,
      name: "John Smith",
      position: "CEO",
      company: "Tech Solutions Inc",
      content: "Inno8 delivered an exceptional web application that exceeded our expectations. Their team's expertise and dedication are unmatched.",
      rating: 5,
      order: 1,
      is_active: true
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "Marketing Director",
      company: "Digital Ventures",
      content: "Working with Inno8 was a game-changer for our business. They transformed our digital presence completely.",
      rating: 5,
      order: 2,
      is_active: true
    }
  ],

  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A comprehensive e-commerce solution with advanced features and seamless user experience.",
      image: "",
      technologies: "React, Node.js, MongoDB",
      is_featured: true,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Mobile Banking App",
      description: "Secure and user-friendly mobile banking application with real-time transactions.",
      image: "",
      technologies: "React Native, Firebase, Node.js",
      is_featured: true,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: "Enterprise Management System",
      description: "Complete business management solution for enterprise-level operations and workflow automation.",
      image: "",
      technologies: "Vue.js, Laravel, MySQL",
      is_featured: false,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],

  teamMembers: [
    {
      id: 1,
      name: "Ahmad Osama",
      position: "CEO & Founder",
      bio: "Visionary leader with 10+ years of experience in software development and business strategy.",
      image: "",
      is_active: true,
      order: 1
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "CTO",
      bio: "Technical expert specializing in full-stack development and system architecture.",
      image: "",
      is_active: true,
      order: 2
    },
    {
      id: 3,
      name: "Michael Chen",
      position: "Lead Developer",
      bio: "Senior developer with expertise in React, Node.js, and cloud technologies.",
      image: "",
      is_active: true,
      order: 3
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      position: "UI/UX Designer",
      bio: "Creative designer focused on user experience and modern interface design.",
      image: "",
      is_active: true,
      order: 4
    }
  ],

  teamSection: {
    subtitle: "Our Team",
    title: "Meet Our Experts",
    description: "Our talented team of professionals is dedicated to delivering exceptional results."
  },

  blogPosts: [
    {
      title: "The Future of Web Development",
      excerpt: "Exploring the latest trends and technologies shaping the future of web development.",
      content: "Web development continues to evolve with new technologies and frameworks...",
      author: "Inno8 Team",
      published_date: new Date().toISOString(),
      is_published: true
    }
  ],

  blogsSection: {
    subtitle: "Latest News",
    title: "Our Blog",
    description: "Stay updated with the latest insights and trends in technology."
  },

  faqs: [
    {
      question: "What services do you offer?",
      answer: "We offer web development, mobile app development, UI/UX design, and digital marketing services.",
      order: 1,
      is_active: true
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on complexity, but most projects are completed within 2-6 months.",
      order: 2,
      is_active: true
    }
  ],

  contactSection: {
    title: "Get In Touch",
    subtitle: "Contact Us",
    description: "Ready to start your project? Contact us today for a free consultation."
  },

  colorPalette: {
    name: "Inno8 Default",
    primary_color: "#0477BF",
    secondary_color: "#012340", 
    accent_color: "#FCB316",
    light_color: "#048ABF",
    is_active: true
  }
}