'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS, getImageUrl } from '../../../lib/api'

export default function HeroSections() {
  const [heroSections, setHeroSections] = useState([
    {
      id: 1,
      title: 'Innovative Software Solutions',
      subtitle: 'Transform Your Business',
      description: 'We create cutting-edge software solutions that drive growth and innovation for your business.',
      button_text: 'Start Your Project',
      button_url: '/contact',
      background_image: null,
      order: 1,
      is_active: true
    }
  ])
  const [heroImages, setHeroImages] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  const hasFetchedHeroSections = useRef(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      if (!hasFetchedHeroSections.current) {
        fetchHeroSections()
        hasFetchedHeroSections.current = true
      }
    }
    
    const saved = localStorage.getItem('heroImages')
    if (saved) {
      try {
        const parsedImages = JSON.parse(saved)
        setHeroImages(parsedImages)
      } catch (e) {
        console.log('Failed to parse saved heroImages')
      }
    }
  }, [router])

  const fetchHeroSections = async (forceRefresh = false) => {
    if (!forceRefresh && hasFetchedHeroSections.current) {
      return
    }
    
    try {
      const response = await fetch(API_ENDPOINTS.HERO_SECTIONS)
      if (response.ok) {
        const data = await response.json()
        const formattedData = data.map(item => {
          const existingHero = heroSections.find(h => h.id === item.id)
          return {
            ...item,
            button_text: item.buttonText || item.button_text || 'Get Started',
            backgroundImage: getImageUrl(item.background_image),
            background_image: existingHero?.background_image || item.background_image
          }
        })
        setHeroSections(formattedData)
      }
    } catch (err) {
      console.log('Using default hero sections')
    }
  }

  const saveAllHeroSections = async () => {
    const token = localStorage.getItem('access_token')
    try {
      const deleteResponse = await fetch(API_ENDPOINTS.ADMIN_HERO_SECTIONS_DELETE_ALL, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (deleteResponse.status === 401) {
        localStorage.removeItem('access_token')
        router.push('/login')
        return
      }
      
      for (const hero of heroSections) {
        const formData = new FormData()
        formData.append('title', hero.title)
        formData.append('subtitle', hero.subtitle)
        formData.append('description', hero.description)
        formData.append('buttonText', hero.button_text)
        formData.append('button_url', hero.button_url || '/contact')
        formData.append('order', hero.order.toString())
        formData.append('is_active', 'true')
        
        if (hero.background_image instanceof File) {
          formData.append('background_image', hero.background_image)
        }
        
        const response = await fetch(API_ENDPOINTS.ADMIN_HERO_SECTIONS, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
        
        if (!response.ok) {
          const error = await response.json()
          console.error('Error creating hero:', error)
          throw new Error('Failed to create hero section')
        }
      }
      
      setSuccessMessage('Hero sections saved successfully!')
      setShowSuccessModal(true)
      await fetchHeroSections(true)
      setHeroImages({})
      localStorage.removeItem('heroImages')
    } catch (err) {
      console.error('Save error:', err)
      setSuccessMessage('Error saving hero sections: ' + err.message)
      setShowSuccessModal(true)
    }
  }

  const addHeroSection = () => {
    const tempId = `temp-${Date.now()}`
    const newHero = {
      id: tempId,
      title: 'New Hero Section',
      subtitle: 'New Subtitle',
      description: 'New description for hero section',
      button_text: 'Get Started',
      button_url: '/contact',
      background_image: null,
      backgroundImage: null,
      order: heroSections.length + 1,
      is_active: true
    }
    setHeroSections(prev => [...prev, newHero])
  }

  const deleteHeroSection = async (index, hero) => {
    const token = localStorage.getItem('access_token')
    if (hero.id && typeof hero.id === 'number') {
      try {
        await fetch(`${API_ENDPOINTS.ADMIN_HERO_SECTIONS}${hero.id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (err) {
        console.error('Delete error:', err)
      }
    }
    setHeroSections(heroSections.filter((_, i) => i !== index))
  }

  const updateHeroSection = (index, field, value) => {
    const updated = [...heroSections]
    updated[index][field] = value
    setHeroSections(updated)
  }

  const handleImageUpload = (index, file, hero) => {
    if (file) {
      const heroId = hero.id || `temp-${index}`
      const updated = [...heroSections]
      updated[index].background_image = file
      setHeroSections(updated)
      
      const imageUrl = URL.createObjectURL(file)
      setHeroImages(prev => {
        const newImages = {
          ...prev,
          [heroId]: imageUrl
        }
        localStorage.setItem('heroImages', JSON.stringify(newImages))
        return newImages
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50" style={{backgroundColor: '#0477BF', color: 'white', padding: '16px'}}>
        <Link href="/admin/dashboard" style={{color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold'}}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="pt-16 max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Hero Sections Management</h2>
            <button
              onClick={addHeroSection}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add Hero Section
            </button>
          </div>
          
          <div className="space-y-6">
            {heroSections.map((hero, index) => (
              <div key={hero.id || `hero-${index}`} className="p-6 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={hero.title}
                      onChange={(e) => updateHeroSection(index, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={hero.subtitle}
                      onChange={(e) => updateHeroSection(index, 'subtitle', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={hero.description}
                      onChange={(e) => updateHeroSection(index, 'description', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Button Text</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={hero.button_text}
                      onChange={(e) => updateHeroSection(index, 'button_text', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Button URL</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={hero.button_url || '/contact'}
                      onChange={(e) => updateHeroSection(index, 'button_url', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={hero.order}
                      onChange={(e) => updateHeroSection(index, 'order', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Active</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={hero.is_active ? 'true' : 'false'}
                      onChange={(e) => updateHeroSection(index, 'is_active', e.target.value === 'true')}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Background Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload(index, file, hero)
                        }
                      }}
                    />
                    {(heroImages[hero.id || `temp-${index}`] || hero.backgroundImage) && (
                      <div className="mt-2">
                        <img 
                          src={heroImages[hero.id || `temp-${index}`] || hero.backgroundImage} 
                          alt="Preview" 
                          className="h-32 w-48 object-cover rounded border" 
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => deleteHeroSection(index, hero)}
                    className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={saveAllHeroSections}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Save All Changes
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