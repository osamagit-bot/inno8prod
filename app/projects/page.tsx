'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../../lib/api'
import Image from 'next/image'

interface Project {
  id: number
  title: string
  description: string
  image: string
  url?: string
  technologies: string
  is_featured: boolean
  created_at: string
}

export default function ProjectsPage() {
  const colors = useColors()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    fetchProjects()
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      })
    })
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROJECTS)
      if (response.ok) {
        const data = await response.json()
        setProjects(data.filter((p: Project) => p.is_active))
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setLoading(false)
    }
  }
        {
          id: 1,
          title: "E-Commerce Platform",
          description: "A comprehensive e-commerce solution with advanced features including real-time inventory management, secure payment processing, customer analytics, and mobile-responsive design. Built with modern technologies to ensure scalability and performance.",
          image: "/images/hero1.webp",
          url: "#",
          technologies: "React, Node.js, MongoDB, Stripe, AWS",
          is_featured: true,
          created_at: "2024-01-15"
        },
        {
          id: 2,
          title: "Mobile Banking Application",
          description: "Secure and user-friendly mobile banking app with biometric authentication, real-time transaction monitoring, budget tracking, and investment portfolio management. Designed with bank-grade security protocols.",
          image: "/images/hero2.jpg",
          url: "#",
          technologies: "React Native, Firebase, Node.js, PostgreSQL",
          is_featured: true,
          created_at: "2024-02-10"
        },
        {
          id: 3,
          title: "Healthcare Management System",
          description: "Complete healthcare platform for patient management, appointment scheduling, medical records, telemedicine integration, and billing system. HIPAA compliant with advanced security measures.",
          image: "/images/about1.avif",
          url: "#",
          technologies: "Vue.js, Laravel, MySQL, Docker",
          is_featured: false,
          created_at: "2024-01-20"
        },
        {
          id: 4,
          title: "AI-Powered Analytics Dashboard",
          description: "Business intelligence dashboard with machine learning insights, predictive analytics, real-time data visualization, and automated reporting for data-driven decision making.",
          image: "/images/about2.webp",
          url: "#",
          technologies: "Python, TensorFlow, React, PostgreSQL, Redis",
          is_featured: true,
          created_at: "2024-03-05"
        },
        {
          id: 5,
          title: "Real Estate Platform",
          description: "Modern property listing and management platform with virtual tours, mortgage calculator, agent portal, and advanced search filters. Integrated with MLS systems.",
          image: "/images/hero.jpg",
          url: "#",
          technologies: "Next.js, Django, PostgreSQL, AWS S3",
          is_featured: false,
          created_at: "2024-02-28"
        },
        {
          id: 6,
          title: "Logistics Management System",
          description: "End-to-end logistics solution with route optimization, real-time tracking, inventory management, and automated dispatch system. Supports multiple transportation modes.",
          image: "/images/cardbg.jpg",
          url: "#",
          technologies: "Angular, Spring Boot, Oracle, Google Maps API",
          is_featured: false,
          created_at: "2024-01-08"
        }
      ]
      setProjects(mockProjects)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setLoading(false)
    }
  }

  const filters = ['All', 'Featured', 'Web Development', 'Mobile Apps', 'Enterprise']
  
  const getFilteredProjects = () => {
    switch (activeFilter) {
      case 'Featured':
        return projects.filter(p => p.is_featured)
      case 'Web Development':
        return projects.filter(p => p.technologies.toLowerCase().includes('react') || p.technologies.toLowerCase().includes('vue') || p.technologies.toLowerCase().includes('next'))
      case 'Mobile Apps':
        return projects.filter(p => p.technologies.toLowerCase().includes('react native') || p.technologies.toLowerCase().includes('flutter'))
      case 'Enterprise':
        return projects.filter(p => p.technologies.toLowerCase().includes('spring') || p.technologies.toLowerCase().includes('oracle'))
      default:
        return projects
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: colors.primary_color }}></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff' }}>
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white" data-aos="fade-up">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Our <span style={{ color: colors.accent_color }}>Projects</span>
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto opacity-90">
              Explore our portfolio of successful projects and innovative solutions across various industries
            </p>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-white/30 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rounded-full animate-ping"></div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 bg-white hover:shadow-md border border-gray-200'
                }`}
                style={{
                  backgroundColor: activeFilter === filter ? colors.primary_color : 'white'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredProjects().map((project, index) => (
              <div
                key={project.id}
                className="group rounded-xl overflow-hidden shadow-sm transition-all duration-500 transform hover:-translate-y-2"
                style={{ backgroundColor: '#FAFAFA' }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  {project.image ? (
                    <Image
                      src={getImageUrl(project.image)}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Featured Badge */}
                  {project.is_featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: colors.accent_color }}>
                      Featured
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={project.url}
                      className="px-4 py-2 rounded-full font-medium text-white transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: colors.primary_color }}
                    >
                      Live Preview
                    </a>
                    <a
                      href={project.url}
                      className="px-4 py-2 rounded-full font-medium text-white transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: colors.accent_color }}
                    >
                      View Details
                    </a>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors" style={{ color: colors.secondary_color }}>
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-4">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2" style={{ color: colors.primary_color }}>Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(', ').map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{ 
                            backgroundColor: colors.primary_color + '20', 
                            color: colors.primary_color 
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <a
                        href={project.url}
                        className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: colors.primary_color, color: 'white' }}
                      >
                        Live Preview
                      </a>
                      <a
                        href={project.url}
                        className="flex items-center space-x-1 font-medium transition-colors hover:underline"
                        style={{ color: colors.primary_color }}
                      >
                        <span>Details</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="400">
            <h3 className="text-3xl font-bold mb-4" style={{ color: colors.secondary_color }}>
              Ready to Start Your Project?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can bring your ideas to life with our expertise and innovative solutions.
            </p>
            <button className="relative px-8 py-4 rounded-sm font-semibold shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl" style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}>
              <span className="relative z-10 group-hover:text-white transition-colors">Get Started Today</span>
              <div className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}