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

  const saveAboutSection = async () => {
    const token = localStorage.getItem('access_token')
    try {
      if (aboutSection.image1 instanceof File || aboutSection.image2 instanceof File) {
        const formData = new FormData()
        formData.append('subtitle', aboutSection.subtitle)
        formData.append('title', aboutSection.title)
        formData.append('button_text', aboutSection.button_text)
        formData.append('mission_title', aboutSection.mission_title)
        formData.append('mission_description', aboutSection.mission_description)
        formData.append('vision_title', aboutSection.vision_title)
        formData.append('vision_description', aboutSection.vision_description)
        formData.append('floating_text', aboutSection.floating_text)
        
        if (aboutSection.image1 instanceof File) {
          formData.append('image1', aboutSection.image1)
        }
        if (aboutSection.image2 instanceof File) {
          formData.append('image2', aboutSection.image2)
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

  const handleImageUpload = (field, file) => {
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
          <h2 className="text-lg font-medium text-gray-900 mb-6">About Section Management</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={aboutSection.subtitle}
                  onChange={(e) => setAboutSection({...aboutSection, subtitle: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Button Text</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={aboutSection.button_text}
                  onChange={(e) => setAboutSection({...aboutSection, button_text: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Main Title</label>
              <textarea
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={aboutSection.title}
                onChange={(e) => setAboutSection({...aboutSection, title: e.target.value})}
                placeholder="Use \n for line breaks"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mission Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={aboutSection.mission_title}
                  onChange={(e) => setAboutSection({...aboutSection, mission_title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vision Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={aboutSection.vision_title}
                  onChange={(e) => setAboutSection({...aboutSection, vision_title: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mission Description</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={aboutSection.mission_description}
                  onChange={(e) => setAboutSection({...aboutSection, mission_description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vision Description</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={aboutSection.vision_description}
                  onChange={(e) => setAboutSection({...aboutSection, vision_description: e.target.value})}
                />
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
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={aboutSection.floating_text}
                onChange={(e) => setAboutSection({...aboutSection, floating_text: e.target.value})}
              />
            </div>
            
            <button
              onClick={saveAboutSection}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Save About Section
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