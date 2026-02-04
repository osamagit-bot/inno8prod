'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useColors } from '../../../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../../../lib/api'
import Footer from '../../../components/Footer'

interface Project {
  id: number
  title: string
  description: string
  image: string
  url?: string
  learn_more_url?: string
  live_preview_url?: string
  technologies: string
  is_featured: boolean
  created_at: string
}

export default function ProjectDetailPage() {
  const colors = useColors()
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      fetchProject()
    }
  }, [params?.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROJECTS)
      if (response.ok) {
        const data = await response.json()
        const foundProject = data.find((p: Project) => p.id.toString() === params?.id)
        setProject(foundProject || null)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: colors.primary_color }}></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.primary_color }}>Project Not Found</h1>
          <a href="/projects" className="text-blue-600 hover:underline">← Back to Projects</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/abouthero.jpg"
            alt="Project Hero"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div 
          className="absolute inset-0" 
          style={{
            background: `linear-gradient(90deg, ${colors.primary_color} 0%, ${colors.primary_color}E6 40%, ${colors.primary_color}30 100%)`
          }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-4 text-left">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              PROJECT DETAILS
            </h1>
            
            <nav className="flex items-center space-x-2 text-white">
              <a href="/" className="hover:text-opacity-80 transition-colors">HOME</a>
              <span className="text-white/60">-</span>
              <a href="/projects" className="hover:text-opacity-80 transition-colors">PROJECTS</a>
              <span className="text-white/60">-</span>
              <span className="text-white/80">{project.title.toUpperCase()}</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Project Image */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full rounded-lg" style={{ backgroundColor: colors.primary_color }}></div>
              <div className="relative overflow-hidden rounded-lg group">
                <img
                  src={project.image ? getImageUrl(project.image) : '/images/placeholder.jpg'}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Project Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
                <span className="text-gray-500 uppercase tracking-wider text-sm">PROJECT DETAILS</span>
              </div>
              
              <h1 className="text-4xl font-bold mb-6" style={{ color: colors.primary_color }}>
                {project.title}
              </h1>
              
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.primary_color }}>
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.split(', ').map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full font-medium"
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
              <div className="flex gap-4">
                <a
                  href={project.live_preview_url || project.url || '#'}
                  target={project.live_preview_url || project.url ? '_blank' : '_self'}
                  rel={project.live_preview_url || project.url ? 'noopener noreferrer' : undefined}
                  className="relative px-8 py-4 rounded-sm font-semibold shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl"
                  style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}
                >
                  <span className="relative z-10 group-hover:text-white transition-colors">Live Preview</span>
                  <div className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
                </a>
                
                {project.learn_more_url && (
                  <a
                    href={project.learn_more_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative px-8 py-4 rounded-sm font-semibold border-2 transition-all duration-300 hover:shadow-lg overflow-hidden group"
                    style={{ 
                      borderColor: colors.primary_color, 
                      color: colors.primary_color,
                      backgroundColor: 'transparent'
                    }}
                  >
                    <span className="relative z-10 group-hover:text-white transition-colors">Learn More</span>
                    <div className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
                  </a>
                )}
                
                <a
                  href="/projects"
                  className="relative px-8 py-4 rounded-sm font-semibold border-2 transition-all duration-300 hover:shadow-lg overflow-hidden group"
                  style={{ 
                    borderColor: colors.primary_color, 
                    color: colors.primary_color,
                    backgroundColor: 'transparent'
                  }}
                >
                  <span className="relative z-10 group-hover:text-white transition-colors">← Back to Projects</span>
                  <div className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}