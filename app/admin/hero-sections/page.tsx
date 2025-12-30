'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS, getImageUrl } from '../../../lib/api'

export default function HeroSections() {
  const [heroSections, setHeroSections] = useState<any[]>([
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
  const [heroImages, setHeroImages] = useState<Record<string, string>>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const hasFetchedHeroSections = useRef(false)
  const formContainerRef = useRef<HTMLDivElement>(null)

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
        const formattedData = data.map((item: any) => {
          const existingHero = heroSections.find((h: any) => h.id === item.id)
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    heroSections.forEach((hero, index) => {
      if (!hero.title.trim()) newErrors[`title_${index}`] = 'Title is required'
      if (!hero.subtitle.trim()) newErrors[`subtitle_${index}`] = 'Subtitle is required'
      if (!hero.description.trim()) newErrors[`description_${index}`] = 'Description is required'
      if (!hero.button_text.trim()) newErrors[`button_text_${index}`] = 'Button text is required'
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return heroSections.every((h: any) => 
      h.title.trim() && 
      h.subtitle.trim() && 
      h.description.trim() && 
      h.button_text.trim()
    )
  }

  const saveHeroSection = async (index: number) => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    if (!token) {
      setSuccessMessage('Please login again')
      setShowSuccessModal(true)
      return
    }
    
    const hero = heroSections[index]
    
    try {
      const formData = new FormData()
      formData.append('title', hero.title)
      formData.append('subtitle', hero.subtitle)
      formData.append('description', hero.description)
      formData.append('buttonText', hero.button_text)
      formData.append('button_url', hero.button_url || '/contact')
      formData.append('order', hero.order.toString())
      formData.append('is_active', hero.is_active.toString())
      
      if ((hero.background_image as any) instanceof File) {
        formData.append('background_image', hero.background_image as unknown as File)
      }
      
      let response
      if (hero.id && typeof hero.id === 'number') {
        response = await fetch(`${API_ENDPOINTS.ADMIN_HERO_SECTIONS}${hero.id}/`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })
      } else {
        response = await fetch(API_ENDPOINTS.ADMIN_HERO_SECTIONS, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })
      }
      
      if (response.ok) {
        setSuccessMessage(`Hero section "${hero.title}" saved successfully!`)
        setShowSuccessModal(true)
        setErrors({})
        await fetchHeroSections(true)
        const heroId = hero.id || `temp-${index}`
        if (heroImages[heroId]) {
          const newImages = { ...heroImages }
          delete newImages[heroId]
          setHeroImages(newImages)
          localStorage.setItem('heroImages', JSON.stringify(newImages))
        }
      } else {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
    } catch (err) {
      setSuccessMessage(`Error saving hero section "${hero.title}": ${err instanceof Error ? err.message : 'Unknown error'}`)
      setShowSuccessModal(true)
    }
  }

  const addHeroSection = () => {
    const tempId = `temp-${Date.now()}`
    const newHero = {
      id: tempId,
      title: '',
      subtitle: '',
      description: '',
      button_text: 'Get Started',
      button_url: '/contact',
      background_image: null,
      backgroundImage: null,
      order: heroSections.length + 1,
      is_active: true
    }
    setHeroSections(prev => [...prev, newHero])
    
    // Scroll to the new form after a short delay
    setTimeout(() => {
      if (formContainerRef.current) {
        const newFormElement = formContainerRef.current.lastElementChild
        if (newFormElement) {
          newFormElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, 100)
  }

  const deleteHeroSection = async (index: number, hero: any) => {
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

  const updateHeroSection = (index: number, field: string, value: any) => {
    const updated = [...heroSections]
    ;(updated[index] as any)[field] = value
    setHeroSections(updated)
    setTimeout(() => validateForm(), 0)
  }

  const handleImageUpload = (index: number, file: File, hero: any) => {
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
          
          <div className="space-y-6" ref={formContainerRef}>
            {heroSections.map((hero, index) => (
              <div key={hero.id || `hero-${index}`} className="p-6 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`title_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={hero.title}
                      onChange={(e) => updateHeroSection(index, 'title', e.target.value)}
                    />
                    {errors[`title_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`title_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`subtitle_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={hero.subtitle}
                      onChange={(e) => updateHeroSection(index, 'subtitle', e.target.value)}
                    />
                    {errors[`subtitle_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`subtitle_${index}`]}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={3}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`description_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={hero.description}
                      onChange={(e) => updateHeroSection(index, 'description', e.target.value)}
                    />
                    {errors[`description_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`description_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Button Text</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`button_text_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={hero.button_text}
                      onChange={(e) => updateHeroSection(index, 'button_text', e.target.value)}
                    />
                    {errors[`button_text_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`button_text_${index}`]}</p>}
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
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => saveHeroSection(index)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    {hero.id && typeof hero.id === 'number' ? 'Update' : 'Save'}
                  </button>
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
            <p className="text-gray-600 text-sm">
              Save each hero section individually using the Save/Update buttons above.
            </p>
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