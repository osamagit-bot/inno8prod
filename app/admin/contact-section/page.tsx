'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS } from '../../../lib/api'

export default function ContactSection() {
  const [sectionData, setSectionData] = useState({
    subtitle: 'Get In Touch',
    title: 'Contact Us',
    description: 'Ready to transform your ideas into reality? Let\'s build something amazing together.'
  })
  const [contactInfo, setContactInfo] = useState([
    { id: 1, title: 'Call us Any time', value: '+123 (4567) 890', icon_svg: '', order: 1, is_active: true },
    { id: 2, title: 'Send E-Mail', value: 'info@gmail.com', icon_svg: '', order: 2, is_active: true },
    { id: 3, title: 'Opening Hours', value: 'Mon - Fri (8.00 - 5.00)', icon_svg: '', order: 3, is_active: true }
  ])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleteInfo, setDeleteInfo] = useState<any>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasInteracted, setHasInteracted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchSectionData()
      fetchContactInfo()
    }
  }, [router])

  const fetchSectionData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CONTACT_SECTION)
      if (response.ok) {
        const data = await response.json()
        setSectionData({
          subtitle: data.subtitle || sectionData.subtitle,
          title: data.title || sectionData.title,
          description: data.description || sectionData.description
        })
      }
    } catch (err) {
      console.log('Using default section data')
    }
  }

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CONTACT_INFO)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setContactInfo(data)
        }
      }
    } catch (err) {
      console.log('Using default contact info')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Validate section data
    if (!sectionData.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required'
    }
    if (!sectionData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!sectionData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    // Validate contact info
    contactInfo.forEach((info, index) => {
      if (!info.title.trim()) {
        newErrors[`title_${index}`] = 'Title is required'
      }
      if (!info.value.trim()) {
        newErrors[`value_${index}`] = 'Value is required'
      }
      if (!info.icon_svg || !info.icon_svg.trim()) {
        newErrors[`icon_svg_${index}`] = 'SVG icon is required'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return sectionData.subtitle.trim() && 
           sectionData.title.trim() && 
           sectionData.description.trim()
  }

  const isContactFormValid = () => {
    return contactInfo.every(info => 
      info.title.trim() && 
      info.value.trim() &&
      info.icon_svg && info.icon_svg.trim()
    )
  }

  const saveSectionData = async () => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_CONTACT_SECTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sectionData)
      })
      if (response.ok) {
        setSuccessMessage('Section data updated successfully!')
        setShowSuccessModal(true)
        setErrors({})
      } else {
        setSuccessMessage('Error updating section data')
        setShowSuccessModal(true)
      }
    } catch (err) {
      setSuccessMessage('Error updating section data')
      setShowSuccessModal(true)
    }
  }

  const saveContactInfo = async (index: number) => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    if (!token) {
      setSuccessMessage('Please login again')
      setShowSuccessModal(true)
      return
    }
    
    const info = contactInfo[index]
    
    try {
      let response
      if (info.id && info.id < Date.now() - 1000000) {
        // Update existing contact info
        response = await fetch(`${API_ENDPOINTS.ADMIN_CONTACT_INFO}${info.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: info.title,
            value: info.value,
            icon_svg: info.icon_svg || '',
            order: info.order,
            is_active: info.is_active
          })
        })
      } else {
        // Create new contact info
        response = await fetch(API_ENDPOINTS.ADMIN_CONTACT_INFO, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: info.title,
            value: info.value,
            icon_svg: info.icon_svg || '',
            order: info.order,
            is_active: info.is_active
          })
        })
      }
      
      if (response.ok) {
        setSuccessMessage(`Contact info "${info.title}" saved successfully!`)
        setShowSuccessModal(true)
        setErrors({})
        await fetchContactInfo()
      } else {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
    } catch (err) {
      setSuccessMessage(`Error saving contact info "${info.title}": ${err instanceof Error ? err.message : 'Unknown error'}`)
      setShowSuccessModal(true)
    }
  }

  const addContactInfo = () => {
    const newInfo = {
      id: Date.now(),
      title: '',
      value: '',
      icon_svg: '',
      order: contactInfo.length + 1,
      is_active: true
    }
    setContactInfo([...contactInfo, newInfo])
  }

  const confirmDelete = (index: number, info: any) => {
    setDeleteIndex(index)
    setDeleteInfo(info)
    setShowDeleteModal(true)
  }

  const handleDeleteInfo = async () => {
    const token = localStorage.getItem('access_token')
    if (deleteInfo && deleteInfo.id && deleteInfo.id < 1000) {
      try {
        await fetch(`${API_ENDPOINTS.ADMIN_CONTACT_INFO}${deleteInfo.id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (err) {
        console.error('Delete error:', err)
      }
    }
    setContactInfo(contactInfo.filter((_, i) => i !== deleteIndex))
    setShowDeleteModal(false)
    setDeleteIndex(null)
    setDeleteInfo(null)
  }

  const updateContactInfo = (index: number, field: string, value: any) => {
    const updated = [...contactInfo]
    ;(updated[index] as any)[field] = value
    setContactInfo(updated)
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
          <h2 className="text-lg font-medium text-gray-900 mb-6">Contact Section Management</h2>
          
          {/* Section Header */}
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
                  onChange={(e) => {
                    setSectionData({...sectionData, subtitle: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
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
                  onChange={(e) => {
                    setSectionData({...sectionData, title: e.target.value})
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
                  value={sectionData.description}
                  onChange={(e) => {
                    setSectionData({...sectionData, description: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
            <button
              onClick={saveSectionData}
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

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-800">Contact Information</h3>
              <button
                onClick={addContactInfo}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Contact Info
              </button>
            </div>
            
            {contactInfo.map((info, index) => (
              <div key={info.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`title_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={info.title}
                      onChange={(e) => updateContactInfo(index, 'title', e.target.value)}
                    />
                    {errors[`title_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`title_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`value_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={info.value}
                      onChange={(e) => updateContactInfo(index, 'value', e.target.value)}
                    />
                    {errors[`value_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`value_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={info.order}
                      onChange={(e) => updateContactInfo(index, 'order', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => saveContactInfo(index)}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      {info.id && info.id < Date.now() - 1000000 ? 'Update' : 'Save'}
                    </button>
                    <button
                      onClick={() => confirmDelete(index, info)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">SVG Icon</label>
                  <textarea
                    rows={3}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-xs ${
                      errors[`icon_svg_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">...</svg>'
                    value={info.icon_svg || ''}
                    onChange={(e) => updateContactInfo(index, 'icon_svg', e.target.value)}
                  />
                  {errors[`icon_svg_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`icon_svg_${index}`]}</p>}
                  <p className="text-xs text-gray-500 mt-1">Paste SVG code here for the contact icon.</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <p className="text-gray-600 text-sm">
              Save each contact info individually using the Save/Update buttons above.
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Contact Info</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this contact information? This action cannot be undone.</p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInfo}
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