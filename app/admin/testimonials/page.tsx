'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS } from '../../../lib/api'

interface Testimonial {
  id: number
  name: string
  position: string
  company: string
  content: string
  rating: number
  order: number
  is_active: boolean
}

interface TestimonialsSection {
  subtitle: string
  title: string
  description: string
}

export default function Testimonials() {
  const [testimonialsSection, setTestimonialsSection] = useState<TestimonialsSection>({
    subtitle: 'Client Testimonials',
    title: 'What Our Clients Say',
    description: "Don't just take our word for it. Here's what our satisfied clients have to say about our services."
  })
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: 1, name: 'Sarah Johnson', position: 'CEO', company: 'TechStart Inc.', content: '', rating: 5, order: 1, is_active: true },
    { id: 2, name: 'Michael Chen', position: 'CTO', company: 'Digital Solutions', content: '', rating: 5, order: 2, is_active: true },
    { id: 3, name: 'Emily Rodriguez', position: 'Marketing Director', company: 'GrowthCorp', content: '', rating: 5, order: 3, is_active: true }
  ])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleteTestimonial, setDeleteTestimonial] = useState<Testimonial | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchTestimonialsSection()
      fetchTestimonials()
    }
  }, [router])

  const fetchTestimonialsSection = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TESTIMONIALS_SECTION)
      if (response.ok) {
        const data = await response.json()
        setTestimonialsSection({
          subtitle: data.subtitle || testimonialsSection.subtitle,
          title: data.title || testimonialsSection.title,
          description: data.description || testimonialsSection.description
        })
      }
    } catch (err) {
      console.log('Using default testimonials section')
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TESTIMONIALS)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setTestimonials(data)
        }
      }
    } catch (err) {
      console.log('Using default testimonials')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Validate section data
    if (!testimonialsSection.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required'
    }
    if (!testimonialsSection.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!testimonialsSection.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    // Validate testimonials
    testimonials.forEach((testimonial, index) => {
      if (!testimonial.name.trim()) {
        newErrors[`name_${index}`] = 'Name is required'
      }
      if (!testimonial.position.trim()) {
        newErrors[`position_${index}`] = 'Position is required'
      }
      if (!testimonial.company.trim()) {
        newErrors[`company_${index}`] = 'Company is required'
      }
      if (!testimonial.content.trim()) {
        newErrors[`content_${index}`] = 'Content is required'
      }
      if (testimonial.content.length > 500) {
        newErrors[`content_${index}`] = 'Content must be less than 500 characters'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return testimonialsSection.subtitle.trim() && 
           testimonialsSection.title.trim() && 
           testimonialsSection.description.trim() &&
           testimonials.every(t => 
             t.name.trim() && 
             t.position.trim() && 
             t.company.trim() && 
             t.content.trim() && 
             t.content.length <= 500
           )
  }

  const saveTestimonialsSection = async () => {
    if (!validateForm()) return
    
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_TESTIMONIALS_SECTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testimonialsSection)
      })
      if (response.ok) {
        setSuccessMessage('Testimonials section updated successfully!')
        setShowSuccessModal(true)
        setErrors({})
      }
    } catch (err) {
      setSuccessMessage('Error updating testimonials section')
      setShowSuccessModal(true)
    }
  }

  const saveTestimonial = async (index: number) => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    if (!token) {
      setSuccessMessage('Please login again')
      setShowSuccessModal(true)
      return
    }
    
    const testimonial = testimonials[index]
    
    try {
      let response
      if (testimonial.id && testimonial.id < Date.now() - 1000000) {
        // Update existing testimonial
        response = await fetch(`${API_ENDPOINTS.ADMIN_TESTIMONIALS}${testimonial.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: testimonial.name,
            position: testimonial.position,
            company: testimonial.company,
            content: testimonial.content,
            rating: testimonial.rating,
            order: testimonial.order,
            is_active: testimonial.is_active
          })
        })
      } else {
        // Create new testimonial
        response = await fetch(API_ENDPOINTS.ADMIN_TESTIMONIALS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: testimonial.name,
            position: testimonial.position,
            company: testimonial.company,
            content: testimonial.content,
            rating: testimonial.rating,
            order: testimonial.order,
            is_active: testimonial.is_active
          })
        })
      }
      
      if (response.ok) {
        setSuccessMessage(`Testimonial "${testimonial.name}" saved successfully!`)
        setShowSuccessModal(true)
        setErrors({})
        await fetchTestimonials()
      } else {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
    } catch (err) {
      setSuccessMessage(`Error saving testimonial "${testimonial.name}": ${err instanceof Error ? err.message : String(err)}`)
      setShowSuccessModal(true)
    }
  }

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now(),
      name: '',
      position: '',
      company: '',
      content: '',
      rating: 5,
      order: testimonials.length + 1,
      is_active: true
    }
    setTestimonials([...testimonials, newTestimonial])
  }

  const confirmDelete = (index: number, testimonial: Testimonial) => {
    setDeleteIndex(index)
    setDeleteTestimonial(testimonial)
    setShowDeleteModal(true)
  }

  const handleDeleteTestimonial = async () => {
    const token = localStorage.getItem('access_token')
    if (deleteTestimonial && deleteTestimonial.id && deleteTestimonial.id < 1000) {
      try {
        await fetch(`${API_ENDPOINTS.ADMIN_TESTIMONIALS}${deleteTestimonial.id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (err) {
        console.error('Delete error:', err)
      }
    }
    setTestimonials(testimonials.filter((_, i) => i !== deleteIndex))
    setShowDeleteModal(false)
    setDeleteIndex(null)
    setDeleteTestimonial(null)
  }

  const updateTestimonial = (index: number, field: string, value: any) => {
    const updated = [...testimonials]
    ;(updated[index] as any)[field] = value
    setTestimonials(updated)
    // Trigger validation on change
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
          <h2 className="text-lg font-medium text-gray-900 mb-6">Testimonials Management</h2>
          
          {/* Testimonials Section Header */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-md font-medium text-gray-800 mb-4">Testimonials Section Header</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.subtitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={testimonialsSection.subtitle}
                  onChange={(e) => {
                    setTestimonialsSection({...testimonialsSection, subtitle: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
                />
                {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Main Title</label>
                <input
                  type="text"
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={testimonialsSection.title}
                  onChange={(e) => {
                    setTestimonialsSection({...testimonialsSection, title: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={testimonialsSection.description}
                  onChange={(e) => {
                    setTestimonialsSection({...testimonialsSection, description: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
            <button
              onClick={saveTestimonialsSection}
              disabled={!isFormValid()}
              className={`mt-4 px-4 py-2 rounded-md ${
                isFormValid() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Section Header
            </button>
          </div>

          {/* Testimonials List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-800">Testimonials</h3>
              <button
                onClick={addTestimonial}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Testimonial
              </button>
            </div>
            
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client Name</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`name_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                    />
                    {errors[`name_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`name_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`position_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={testimonial.position}
                      onChange={(e) => updateTestimonial(index, 'position', e.target.value)}
                    />
                    {errors[`position_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`position_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`company_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={testimonial.company}
                      onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                    />
                    {errors[`company_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`company_${index}`]}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={testimonial.rating}
                      onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={testimonial.order}
                      onChange={(e) => updateTestimonial(index, 'order', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => saveTestimonial(index)}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      {testimonial.id && testimonial.id < Date.now() - 1000000 ? 'Update' : 'Save'}
                    </button>
                    <button
                      onClick={() => confirmDelete(index, testimonial)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Testimonial Content</label>
                  <textarea
                    rows={4}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                      errors[`content_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={testimonial.content}
                    onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      {errors[`content_${index}`] && <p className="text-red-500 text-sm">{errors[`content_${index}`]}</p>}
                    </div>
                    <p className="text-sm text-gray-500">{testimonial.content.length}/500</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <p className="text-gray-600 text-sm">
              Save each testimonial individually using the Save/Update buttons above.
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Testimonial</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this testimonial? This action cannot be undone.</p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTestimonial}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
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