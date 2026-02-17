'use client'


import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../lib/api'
import { fallbackData } from '../lib/fallbackData'

interface Project {
  id: number
  title: string
  description: string
  image: string
  url?: string
  live_preview_url?: string
  technologies: string
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export default function ProjectsSection() {
  const colors = useColors()
  const [projects, setProjects] = useState<Project[]>(fallbackData.projects)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        const activeProjects = data.filter((p: Project) => p.is_active)
        if (activeProjects.length > 0) {
          setProjects(activeProjects)
        }
      }
    } catch (error) {
      console.log('Backend offline - using fallback projects')
      setProjects(fallbackData.projects)
    }
  }

  const getCategories = () => {
    const techs = projects.flatMap(p => p.technologies.split(', '))
    const categories = ['All', 'Featured']
    if (techs.some(t => ['React', 'Vue', 'Next', 'Angular', 'HTML', 'CSS', 'JavaScript', 'Django', 'Tailwind', 'Bootstrap', 'Laravel', 'PHP'].some(web => t.toLowerCase().includes(web.toLowerCase())))) {
      categories.push('Web Development')
    }
    if (techs.some(t => t.includes('React Native') || t.includes('Flutter'))) {
      categories.push('Mobile Apps')
    }
    if (techs.some(t => ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle', 'SQL Server', 'Database', 'PHP', 'Django', 'Laravel', 'Node.js', 'Express'].some(db => t.toLowerCase().includes(db.toLowerCase())))) {
      categories.push('Database Development')
    }
    if (techs.some(t => ['Spring', 'Oracle', 'Enterprise'].some(ent => t.includes(ent)))) {
      categories.push('Enterprise')
    }
    if (techs.some(t => ['Logo', 'Branding', 'Brand', 'Identity', 'Photoshop', 'Canva', 'CorelDraw', 'Illustrator', 'Design', 'Graphics'].some(brand => t.includes(brand)))) {
      categories.push('Branding & Logo')
    }
    return categories
  }

  const getFilteredProjects = () => {
    switch (activeCategory) {
      case 'Featured':
        return projects.filter(p => p.is_featured)
      case 'Web Development':
        return projects.filter(p => ['React', 'Vue', 'Next', 'Angular', 'HTML', 'CSS', 'JavaScript', 'Django', 'Tailwind', 'Bootstrap', 'Laravel', 'PHP'].some(tech => p.technologies.toLowerCase().includes(tech.toLowerCase())))
      case 'Mobile Apps':
        return projects.filter(p => p.technologies.includes('React Native') || p.technologies.includes('Flutter'))
      case 'Database Development':
        return projects.filter(p => ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle', 'SQL Server', 'Database', 'PHP', 'Django', 'Laravel', 'Node.js', 'Express'].some(tech => p.technologies.toLowerCase().includes(tech.toLowerCase())))
      case 'Enterprise':
        return projects.filter(p => ['Spring', 'Oracle', 'Enterprise'].some(tech => p.technologies.includes(tech)))
      case 'Branding & Logo':
        return projects.filter(p => ['Logo', 'Branding', 'Brand', 'Identity', 'Photoshop', 'Canva', 'CorelDraw', 'Illustrator', 'Design', 'Graphics'].some(tech => p.technologies.includes(tech)))
      default:
        return projects
    }
  }

  const categories = getCategories()
  const filteredProjects = getFilteredProjects()

  return (
    <section className="py-20" style={{ backgroundColor: '#fff' }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
            <span className="text-gray-500 uppercase tracking-wider text-sm">
              OUR PORTFOLIO
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-[#012340]">
            Featured <span className="text-[#FCB316]">Projects</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.primary_color }}>
            Discover our latest work and successful project implementations across various industries and technologies.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up" data-aos-delay="200">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 overflow-hidden group ${
                activeCategory === category 
                  ? 'text-white transform scale-105' 
                  : 'text-gray-600 bg-white'
              }`}
              style={{
                backgroundColor: activeCategory === category ? colors.primary_color : '#FAFAFA'
              }}
            >
              <span className="relative z-10 group-hover:text-white transition-colors">{category}</span>
              {activeCategory !== category && (
                <div className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
              )}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.slice(0, 3).map((project, index) => (
            <div
              key={project.id}
              className="group rounded-xl overflow-hidden shadow-sm transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
              style={{ backgroundColor: '#FAFAFA' }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                {project.image ? (
                  <img
                    src={getImageUrl(project.image)}
                    alt={project.title}
                    
                    className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      console.log('Image failed to load:', project.image, 'Generated URL:', getImageUrl(project.image))
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {project.image && (
                    <button
                      onClick={() => {
                        setSelectedImage(getImageUrl(project.image))
                        setTimeout(() => setIsModalOpen(true), 10)
                      }}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 z-10 cursor-pointer"
                      style={{ color: colors.primary_color }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Featured Badge */}
                {project.is_featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: colors.accent_color }}>
                    Featured
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors tracking-wide" style={{ color: colors.primary_color }}>
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow font-normal">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                  {project.technologies.split(', ').map((tech, techIndex) => (
                    <span
                      key={`${project.id}-${tech}-${techIndex}`}
                      className="px-3 py-1 text-sm rounded-full"
                      style={{ 
                        backgroundColor: colors.primary_color + '20', 
                        color: colors.primary_color 
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                  {/* Project Actions */}
                  <div className="flex items-center justify-between">
                    <a
                      href={`/projects/${project.id}`}
                      className="relative flex items-center space-x-2 font-medium transition-colors cursor-pointer overflow-hidden group/learn"
                      style={{ color: colors.primary_color }}
                    >
                      <span className="relative z-10">Learn More</span>
                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover/learn:w-full transition-all duration-300 ease-out" style={{ backgroundColor: colors.primary_color, marginTop: '2px' }}></div>
                    </a>
                      {project.live_preview_url && (
                  <a
                    href={project.live_preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center space-x-2 font-medium transition-colors overflow-hidden group/link"
                    style={{ color: colors.primary_color }}
                  >
                    <span className="relative z-10">Live Preview</span>
                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover/link:w-full transition-all duration-300 ease-out" style={{ backgroundColor: colors.primary_color, marginTop: '2px' }}></div>
                  </a>
                      )}
                    {!project.live_preview_url && (
                  <a
                    href={project.url || '#'}
                    target={project.url ? '_blank' : '_self'}
                    rel={project.url ? 'noopener noreferrer' : undefined}
                    className="relative flex items-center space-x-2 font-medium transition-colors overflow-hidden group/link"
                    style={{ color: colors.primary_color }}
                  >
                    <span className="relative z-10">Live Preview</span>
                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover/link:w-full transition-all duration-300 ease-out" style={{ backgroundColor: colors.primary_color, marginTop: '2px' }}></div>
                  </a>
                      )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
          <a href="/projects" className="relative inline-block px-8 py-4 rounded-sm font-medium shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl" style={{ backgroundColor: colors.accent_color, color: colors.secondary_color }}>
            <span className="relative z-10 group-hover:text-white transition-colors">View All Projects</span>
            <div className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
          </a>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 cursor-pointer transition-all duration-500 ease-out ${
            isModalOpen ? 'opacity-100' : 'opacity-0'
          }`} 
          onClick={() => {
            setIsModalOpen(false)
            setTimeout(() => setSelectedImage(null), 500)
          }}
        >
          <div 
            className={`relative max-w-4xl max-h-full transition-all duration-500 ease-out ${
              isModalOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Project Image"
              className="max-w-full max-h-full object-contain rounded-lg cursor-default"
            />
            <button
              onClick={() => {
                setIsModalOpen(false)
                setTimeout(() => setSelectedImage(null), 500)
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}