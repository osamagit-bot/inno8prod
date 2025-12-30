'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS } from '../../../lib/api'

interface Feature {
  id?: number
  title: string
  description: string
  icon_svg: string
  order: number
  is_active: boolean
}

interface SectionData {
  subtitle: string
  title: string
  breadcrumb_items: string
}

export default function AdminWhyChooseUs() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [sectionData, setSectionData] = useState<SectionData>({
    subtitle: 'OUR STRENGTHS',
    title: 'WHY CHOOSE INNO8',
    breadcrumb_items: 'Experience,Innovation,Results'
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchData()
    }
  }, [router])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const [featuresResponse, sectionResponse] = await Promise.all([
        fetch(API_ENDPOINTS.ADMIN_WHY_CHOOSE_US, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(API_ENDPOINTS.WHY_CHOOSE_US_SECTION)
      ])
      
      if (featuresResponse.ok) {
        const featuresData = await featuresResponse.json()
        setFeatures(featuresData)
      }
      
      if (sectionResponse.ok) {
        const sectionData = await sectionResponse.json()
        setSectionData(sectionData)
      }
    } catch (error) {
      console.log('Using default data')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!sectionData.subtitle.trim()) newErrors.subtitle = 'Subtitle is required'
    if (!sectionData.title.trim()) newErrors.title = 'Title is required'
    if (!sectionData.breadcrumb_items.trim()) newErrors.breadcrumb_items = 'Breadcrumb items are required'
    
    features.forEach((feature, index) => {
      if (!feature.title.trim()) newErrors[`title_${index}`] = 'Title is required'
      if (!feature.description.trim()) newErrors[`description_${index}`] = 'Description is required'
      if (!feature.icon_svg.trim()) newErrors[`icon_svg_${index}`] = 'Icon SVG is required'
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return sectionData.subtitle.trim() && 
           sectionData.title.trim() && 
           sectionData.breadcrumb_items.trim() &&
           features.every(f => 
             f.title.trim() && 
             f.description.trim() && 
             f.icon_svg.trim()
           )
  }

  const saveSectionData = async () => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN_WHY_CHOOSE_US.replace('why-choose-us-features', 'why-choose-us-sections')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sectionData)
      })
      
      if (response.ok) {
        setSuccessMessage('Section header updated successfully!')
        setShowSuccessModal(true)
      } else {
        setSuccessMessage('Error updating section header')
        setShowSuccessModal(true)
      }
    } catch (err) {
      setSuccessMessage('Error updating section header')
      setShowSuccessModal(true)
    }
  }

  const saveFeature = async (index: number) => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    if (!token) {
      setSuccessMessage('Please login again')
      setShowSuccessModal(true)
      return
    }
    
    const feature = features[index]
    
    try {
      let response
      if (feature.id) {
        response = await fetch(`${API_ENDPOINTS.ADMIN_WHY_CHOOSE_US}${feature.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(feature)
        })
      } else {
        response = await fetch(API_ENDPOINTS.ADMIN_WHY_CHOOSE_US, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(feature)
        })
      }
      
      if (response.ok) {
        setSuccessMessage(`Feature "${feature.title}" saved successfully!`)
        setShowSuccessModal(true)
        setErrors({})
        await fetchData()
      } else {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
    } catch (err) {
      setSuccessMessage(`Error saving feature "${feature.title}": ${err instanceof Error ? err.message : String(err)}`)
      setShowSuccessModal(true)
    }
  }

  const addFeature = () => {
    const newFeature: Feature = {
      title: '',
      description: '',
      icon_svg: '<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>',
      order: features.length,
      is_active: true
    }
    setFeatures([...features, newFeature])
  }

  const deleteFeature = async (index: number) => {
    setDeleteIndex(index)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (deleteIndex === null) return
    
    const feature = features[deleteIndex]
    if (feature.id) {
      const token = localStorage.getItem('access_token')
      try {
        const response = await fetch(`${API_ENDPOINTS.ADMIN_WHY_CHOOSE_US}${feature.id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          setFeatures(features.filter((_, i) => i !== deleteIndex))
          setSuccessMessage('Feature deleted successfully!')
          setShowSuccessModal(true)
        }
      } catch (err) {
        console.error('Delete error:', err)
        setSuccessMessage('Error deleting feature')
        setShowSuccessModal(true)
      }
    } else {
      setFeatures(features.filter((_, i) => i !== deleteIndex))
    }
    setShowDeleteModal(false)
    setDeleteIndex(null)
  }

  const updateFeature = (index: number, field: keyof Feature, value: any) => {
    const updated = [...features]
    ;(updated[index] as any)[field] = value
    setFeatures(updated)
    setTimeout(() => validateForm(), 0)
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
          <h2 className="text-lg font-medium text-gray-900 mb-6">Why Choose Us Management</h2>
          
          {/* Section Header Management */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-md font-medium text-gray-800 mb-4">Section Header</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.subtitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={sectionData.subtitle}
                  onChange={(e) => setSectionData({...sectionData, subtitle: e.target.value})}
                />
                {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={sectionData.title}
                  onChange={(e) => setSectionData({...sectionData, title: e.target.value})}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Breadcrumb Items (comma separated)</label>
              <input
                type="text"
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.breadcrumb_items ? 'border-red-500' : 'border-gray-300'
                }`}
                value={sectionData.breadcrumb_items}
                onChange={(e) => setSectionData({...sectionData, breadcrumb_items: e.target.value})}
                placeholder="Experience,Innovation,Results"
              />
              {errors.breadcrumb_items && <p className="text-red-500 text-sm mt-1">{errors.breadcrumb_items}</p>}
            </div>
            <div className="mt-4">
              <button
                onClick={saveSectionData}
                disabled={!isFormValid()}
                className={`px-4 py-2 rounded-md ${
                  isFormValid() 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save Header
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-800">Features</h3>
              <button
                onClick={addFeature}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Feature
              </button>
            </div>
            
            {features.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Feature Title</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`title_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                    />
                    {errors[`title_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`title_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={feature.order}
                      onChange={(e) => updateFeature(index, 'order', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => saveFeature(index)}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      {feature.id ? 'Update' : 'Save'}
                    </button>
                    <button
                      onClick={() => deleteFeature(index)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                      errors[`description_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={feature.description}
                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  />
                  {errors[`description_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`description_${index}`]}</p>}
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Icon SVG</label>
                  <textarea
                    rows={4}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 font-mono text-sm ${
                      errors[`icon_svg_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={feature.icon_svg}
                    onChange={(e) => updateFeature(index, 'icon_svg', e.target.value)}
                    placeholder="Paste SVG code here..."
                  />
                  {errors[`icon_svg_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`icon_svg_${index}`]}</p>}
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={feature.is_active}
                      onChange={(e) => updateFeature(index, 'is_active', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <p className="text-gray-600 text-sm">
              Save each feature individually using the Save/Update buttons above.
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Feature</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this feature? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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