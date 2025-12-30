'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS, getImageUrl, API_CONFIG } from '../../../lib/api'

export default function AboutSection() {
  const [aboutSection, setAboutSection] = useState({
    subtitle: 'About Your Company',
    title: 'We Execute Ideas\nFrom Start to Finish',
    button_text: 'Know More',
    overview_title: 'Company Overview',
    overview_description1: 'Founded with a vision to bridge the gap between innovative technology and business success, Inno8 has been at the forefront of digital transformation.',
    overview_description2: 'Our team combines technical expertise with creative thinking to deliver solutions that are functional, user-friendly and scalable.',
    projects_count: 50,
    years_experience: 5,
    mission_title: 'Our Mission',
    mission_description: 'Our mission is to push boundaries, engage audiences, and drive innovation through cutting-edge technology solutions.',
    vision_title: 'Our Vision',
    vision_description: 'To become the leading software house that transforms businesses through innovative digital solutions and exceptional user experiences.',
    image1: null,
    image2: null,
    floating_text: 'Repellendus autem ruibusdam at aut officiis debitis aut re necessitatibus saepe eveniet ut et repudianda sint et molestiae non recusandae.'
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState('section')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchAboutSection()
    }
  }, [router])

  const fetchAboutSection = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ABOUT_SECTION)
      if (response.ok) {
        const data = await response.json()
        setAboutSection({
          subtitle: data.subtitle || aboutSection.subtitle,
          title: data.title || aboutSection.title,
          button_text: data.button_text || aboutSection.button_text,
          overview_title: data.overview_title || aboutSection.overview_title,
          overview_description1: data.overview_description1 || aboutSection.overview_description1,
          overview_description2: data.overview_description2 || aboutSection.overview_description2,
          projects_count: data.projects_count || aboutSection.projects_count,
          years_experience: data.years_experience || aboutSection.years_experience,
          mission_title: data.mission_title || aboutSection.mission_title,
          mission_description: data.mission_description || aboutSection.mission_description,
          vision_title: data.vision_title || aboutSection.vision_title,
          vision_description: data.vision_description || aboutSection.vision_description,
          image1: data.image1,
          image2: data.image2,
          floating_text: data.floating_text || aboutSection.floating_text
        })
      }
    } catch (err) {
      console.log('Using default about section')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!aboutSection.subtitle.trim()) newErrors.subtitle = 'Subtitle is required'
    if (!aboutSection.title.trim()) newErrors.title = 'Title is required'
    if (!aboutSection.button_text.trim()) newErrors.button_text = 'Button text is required'
    if (!aboutSection.mission_title.trim()) newErrors.mission_title = 'Mission title is required'
    if (!aboutSection.mission_description.trim()) newErrors.mission_description = 'Mission description is required'
    if (!aboutSection.vision_title.trim()) newErrors.vision_title = 'Vision title is required'
    if (!aboutSection.vision_description.trim()) newErrors.vision_description = 'Vision description is required'
    if (!aboutSection.floating_text.trim()) newErrors.floating_text = 'Floating text is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return aboutSection.subtitle.trim() && 
           aboutSection.title.trim() && 
           aboutSection.button_text.trim() &&
           aboutSection.mission_title.trim() &&
           aboutSection.mission_description.trim() &&
           aboutSection.vision_title.trim() &&
           aboutSection.vision_description.trim() &&
           aboutSection.floating_text.trim()
  }

  const saveAboutSection = async () => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    try {
      if ((aboutSection.image1 as any) instanceof File || (aboutSection.image2 as any) instanceof File) {
        const formData = new FormData()
        formData.append('subtitle', aboutSection.subtitle)
        formData.append('title', aboutSection.title)
        formData.append('button_text', aboutSection.button_text)
        formData.append('overview_title', aboutSection.overview_title)
        formData.append('overview_description1', aboutSection.overview_description1)
        formData.append('overview_description2', aboutSection.overview_description2)
        formData.append('projects_count', aboutSection.projects_count.toString())
        formData.append('years_experience', aboutSection.years_experience.toString())
        formData.append('mission_title', aboutSection.mission_title)
        formData.append('mission_description', aboutSection.mission_description)
        formData.append('vision_title', aboutSection.vision_title)
        formData.append('vision_description', aboutSection.vision_description)
        formData.append('floating_text', aboutSection.floating_text)
        
        if ((aboutSection.image1 as any) instanceof File) {
          formData.append('image1', aboutSection.image1 as unknown as File)
        }
        if ((aboutSection.image2 as any) instanceof File) {
          formData.append('image2', aboutSection.image2 as unknown as File)
        }
        
        const response = await fetch(API_ENDPOINTS.ADMIN_ABOUT_SECTION, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
        
        if (response.ok) {
          setSuccessMessage('About section updated successfully!')
          setShowSuccessModal(true)
          fetchAboutSection()
        } else {
          const errorData = await response.json()
          console.error('Error:', errorData)
          setSuccessMessage('Error updating about section')
          setShowSuccessModal(true)
        }
      } else {
        const response = await fetch(API_ENDPOINTS.ADMIN_ABOUT_SECTION, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            subtitle: aboutSection.subtitle,
            title: aboutSection.title,
            button_text: aboutSection.button_text,
            overview_title: aboutSection.overview_title,
            overview_description1: aboutSection.overview_description1,
            overview_description2: aboutSection.overview_description2,
            projects_count: aboutSection.projects_count,
            years_experience: aboutSection.years_experience,
            mission_title: aboutSection.mission_title,
            mission_description: aboutSection.mission_description,
            vision_title: aboutSection.vision_title,
            vision_description: aboutSection.vision_description,
            floating_text: aboutSection.floating_text
          })
        })
        
        if (response.ok) {
          setSuccessMessage('About section updated successfully!')
          setShowSuccessModal(true)
          fetchAboutSection()
        } else {
          setSuccessMessage('Error updating about section')
          setShowSuccessModal(true)
        }
      }
    } catch (err) {
      console.error('Save error:', err)
      setSuccessMessage('Error updating about section')
      setShowSuccessModal(true)
    }
  }

  const handleImageUpload = (field: string, file: File) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      setAboutSection({...aboutSection, [field]: file})
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50" style={{backgroundColor: '#0477BF', color: 'white', padding: '16px'}}>
        <Link href="/admin/dashboard" style={{color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold'}}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="pt-16 max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">About Content Management</h2>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('section')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'section'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                About Section Management
              </button>
              <button
                onClick={() => setActiveTab('page')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'page'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                About Page Management
              </button>
            </nav>
          </div>
          
          <div className="space-y-6">
            {activeTab === 'section' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors.subtitle ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={aboutSection.subtitle}
                      onChange={(e) => {
                        setAboutSection({...aboutSection, subtitle: e.target.value})
                        setTimeout(() => validateForm(), 0)
                      }}
                    />
                    {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Button Text</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors.button_text ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={aboutSection.button_text}
                      onChange={(e) => {
                        setAboutSection({...aboutSection, button_text: e.target.value})
                        setTimeout(() => validateForm(), 0)
                      }}
                    />
                    {errors.button_text && <p className="text-red-500 text-sm mt-1">{errors.button_text}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Main Title</label>
                  <textarea
                    rows={2}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={aboutSection.title}
                    onChange={(e) => {
                      setAboutSection({...aboutSection, title: e.target.value})
                      setTimeout(() => validateForm(), 0)
                    }}
                    placeholder="Use \n for line breaks"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mission Title</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors.mission_title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={aboutSection.mission_title}
                      onChange={(e) => {
                        setAboutSection({...aboutSection, mission_title: e.target.value})
                        setTimeout(() => validateForm(), 0)
                      }}
                    />
                    {errors.mission_title && <p className="text-red-500 text-sm mt-1">{errors.mission_title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vision Title</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors.vision_title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={aboutSection.vision_title}
                      onChange={(e) => {
                        setAboutSection({...aboutSection, vision_title: e.target.value})
                        setTimeout(() => validateForm(), 0)
                      }}
                    />
                    {errors.vision_title && <p className="text-red-500 text-sm mt-1">{errors.vision_title}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mission Description</label>
                    <textarea
                      rows={4}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors.mission_description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={aboutSection.mission_description}
                      onChange={(e) => {
                        setAboutSection({...aboutSection, mission_description: e.target.value})
                        setTimeout(() => validateForm(), 0)
                      }}
                    />
                    {errors.mission_description && <p className="text-red-500 text-sm mt-1">{errors.mission_description}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vision Description</label>
                    <textarea
                      rows={4}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors.vision_description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={aboutSection.vision_description}
                      onChange={(e) => {
                        setAboutSection({...aboutSection, vision_description: e.target.value})
                        setTimeout(() => validateForm(), 0)
                      }}
                    />
                    {errors.vision_description && <p className="text-red-500 text-sm mt-1">{errors.vision_description}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image 1 (Top)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload('image1', file)
                        }
                      }}
                    />
                    {aboutSection.image1 && (
                      <img 
                        src={typeof aboutSection.image1 === 'string' ? getImageUrl(aboutSection.image1) : URL.createObjectURL(aboutSection.image1)} 
                        alt="Preview" 
                        className="mt-2 h-20 w-32 object-cover rounded" 
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image 2 (Bottom Right)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload('image2', file)
                        }
                      }}
                    />
                    {aboutSection.image2 && (
                      <img 
                        src={typeof aboutSection.image2 === 'string' ? getImageUrl(aboutSection.image2) : URL.createObjectURL(aboutSection.image2)} 
                        alt="Preview" 
                        className="mt-2 h-20 w-32 object-cover rounded" 
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Floating Text Box</label>
                  <textarea
                    rows={3}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                      errors.floating_text ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={aboutSection.floating_text}
                    onChange={(e) => {
                      setAboutSection({...aboutSection, floating_text: e.target.value})
                      setTimeout(() => validateForm(), 0)
                    }}
                  />
                  {errors.floating_text && <p className="text-red-500 text-sm mt-1">{errors.floating_text}</p>}
                </div>
              </>
            )}
            
            {activeTab === 'page' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Overview Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={aboutSection.overview_title}
                    onChange={(e) => setAboutSection({...aboutSection, overview_title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Overview Description 1</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={aboutSection.overview_description1}
                    onChange={(e) => setAboutSection({...aboutSection, overview_description1: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Overview Description 2</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={aboutSection.overview_description2}
                    onChange={(e) => setAboutSection({...aboutSection, overview_description2: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Projects Count</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={aboutSection.projects_count}
                      onChange={(e) => setAboutSection({...aboutSection, projects_count: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Years Experience</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={aboutSection.years_experience}
                      onChange={(e) => setAboutSection({...aboutSection, years_experience: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </>
            )}
            
            <button
              onClick={saveAboutSection}
              disabled={!isFormValid()}
              className={`px-6 py-3 rounded-md ${
                isFormValid() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save {activeTab === 'section' ? 'About Section' : 'About Page'}
            </button>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{successMessage}</h3>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}