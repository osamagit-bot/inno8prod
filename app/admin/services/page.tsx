'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS } from '../../../lib/api'

export default function Services() {
  const [servicesSection, setServicesSection] = useState({
    subtitle: 'OUR OFFERING',
    title: 'Enhance And Pioneer Using',
    title_highlight: 'Technology Trends',
    button_text: 'Explore More'
  })
  const [services, setServices] = useState<any[]>([
    { id: 1, name: 'Web Development', description: '', icon: 'web', order: 1, is_active: true },
    { id: 2, name: 'Graphic Design', description: '', icon: 'design', order: 2, is_active: true },
    { id: 3, name: 'Video Editing', description: '', icon: 'video', order: 3, is_active: true },
    { id: 4, name: 'Database Development', description: '', icon: 'database', order: 4, is_active: true },
    { id: 5, name: 'IT Solutions', description: '', icon: 'it', order: 5, is_active: true },
    { id: 6, name: 'Technical Support', description: '', icon: 'support', order: 6, is_active: true }
  ])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const servicesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchServicesSection()
      fetchServices()
    }
  }, [router])

  const fetchServicesSection = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SERVICES_SECTION)
      if (response.ok) {
        const data = await response.json()
        setServicesSection({
          subtitle: data.subtitle || servicesSection.subtitle,
          title: data.title || servicesSection.title,
          title_highlight: data.title_highlight || servicesSection.title_highlight,
          button_text: data.button_text || servicesSection.button_text
        })
      }
    } catch (err) {
      console.log('Using default services section')
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SERVICES)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setServices(data)
        }
      }
    } catch (err) {
      console.log('Using default services')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Validate section data
    if (!servicesSection.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required'
    }
    if (!servicesSection.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!servicesSection.title_highlight.trim()) {
      newErrors.title_highlight = 'Title highlight is required'
    }
    if (!servicesSection.button_text.trim()) {
      newErrors.button_text = 'Button text is required'
    }
    
    // Validate services
    services.forEach((service, index) => {
      if (!service.name.trim()) {
        newErrors[`name_${index}`] = 'Service name is required'
      }
      if (!service.description.trim()) {
        newErrors[`description_${index}`] = 'Description is required'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return servicesSection.subtitle.trim() && 
           servicesSection.title.trim() && 
           servicesSection.title_highlight.trim() &&
           servicesSection.button_text.trim() &&
           services.every(s => 
             s.name.trim() && 
             s.description.trim()
           )
  }

  const saveServicesSection = async () => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_SERVICES_SECTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(servicesSection)
      })
      if (response.ok) {
        setSuccessMessage('Services section updated successfully!')
        setShowSuccessModal(true)
        setErrors({})
      }
    } catch (err) {
      setSuccessMessage('Error updating services section')
      setShowSuccessModal(true)
    }
  }

  const saveService = async (index: number) => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    if (!token) {
      setSuccessMessage('Please login again')
      setShowSuccessModal(true)
      return
    }
    
    const service = services[index]
    
    try {
      let response
      if (service.id && service.id < Date.now() - 1000000) {
        // Update existing service
        response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICES}${service.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: service.name,
            description: service.description,
            icon: service.icon,
            icon_svg: (service as any).icon_svg || '',
            order: service.order,
            is_active: service.is_active
          })
        })
      } else {
        // Create new service
        response = await fetch(API_ENDPOINTS.ADMIN_SERVICES, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: service.name,
            description: service.description,
            icon: service.icon,
            icon_svg: (service as any).icon_svg || '',
            order: service.order,
            is_active: service.is_active
          })
        })
      }
      
      if (response.ok) {
        setSuccessMessage(`Service "${service.name}" saved successfully!`)
        setShowSuccessModal(true)
        setErrors({})
        await fetchServices()
      } else {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
    } catch (err) {
      setSuccessMessage(`Error saving service "${service.name}": ${err instanceof Error ? err.message : 'Unknown error'}`)
      setShowSuccessModal(true)
    }
  }

  const addService = () => {
    const newService = {
      id: Date.now(),
      name: '',
      description: '',
      icon: 'web',
      order: services.length + 1,
      is_active: true
    }
    setServices([...services, newService])
    
    // Scroll to the new service after a short delay
    setTimeout(() => {
      if (servicesContainerRef.current) {
        const newServiceElement = servicesContainerRef.current.lastElementChild
        if (newServiceElement) {
          newServiceElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, 100)
  }

  const deleteService = async (index: number, service: any) => {
    const token = localStorage.getItem('access_token')
    if (service.id && service.id < 1000) {
      try {
        await fetch(`${API_ENDPOINTS.ADMIN_SERVICES}${service.id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (err) {
        console.error('Delete error:', err)
      }
    }
    setServices(services.filter((_, i) => i !== index))
  }

  const updateService = (index: number, field: string, value: any) => {
    const updated = [...services]
    ;(updated[index] as any)[field] = value
    setServices(updated)
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
          <h2 className="text-lg font-medium text-gray-900 mb-6">Services Management</h2>
          
          {/* Services Section Header */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-md font-medium text-gray-800 mb-4">Services Section Header</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.subtitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={servicesSection.subtitle}
                  onChange={(e) => {
                    setServicesSection({...servicesSection, subtitle: e.target.value})
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
                  value={servicesSection.button_text}
                  onChange={(e) => {
                    setServicesSection({...servicesSection, button_text: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
                />
                {errors.button_text && <p className="text-red-500 text-sm mt-1">{errors.button_text}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Main Title</label>
                <input
                  type="text"
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={servicesSection.title}
                  onChange={(e) => {
                    setServicesSection({...servicesSection, title: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Highlighted Title</label>
                <input
                  type="text"
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.title_highlight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={servicesSection.title_highlight}
                  onChange={(e) => {
                    setServicesSection({...servicesSection, title_highlight: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
                />
                {errors.title_highlight && <p className="text-red-500 text-sm mt-1">{errors.title_highlight}</p>}
              </div>
            </div>
            <button
              onClick={saveServicesSection}
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

          {/* Services List */}
          <div className="space-y-4" ref={servicesContainerRef}>
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-800">Services</h3>
              <button
                onClick={addService}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Service
              </button>
            </div>
            
            {services.map((service, index) => (
              <div key={service.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Name</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`name_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={service.name}
                      onChange={(e) => updateService(index, 'name', e.target.value)}
                    />
                    {errors[`name_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`name_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Icon Type</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={service.icon}
                      onChange={(e) => updateService(index, 'icon', e.target.value)}
                    >
                      <option value="web">Web Development</option>
                      <option value="design">Graphic Design</option>
                      <option value="video">Video Editing</option>
                      <option value="database">Database</option>
                      <option value="it">IT Solutions</option>
                      <option value="support">Technical Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={service.order}
                      onChange={(e) => updateService(index, 'order', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => saveService(index)}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      {service.id && service.id < Date.now() - 1000000 ? 'Update' : 'Save'}
                    </button>
                    <button
                      onClick={() => deleteService(index, service)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={2}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                      errors[`description_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                  />
                  {errors[`description_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`description_${index}`]}</p>}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Custom SVG Icon (Optional)</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-xs"
                    placeholder='<svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">...</svg>'
                    value={(service as any).icon_svg || ''}
                    onChange={(e) => updateService(index, 'icon_svg', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste SVG code here to use custom icon. Leave empty to use predefined icon.</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <p className="text-gray-600 text-sm">
              Save each service individually using the Save/Update buttons above.
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