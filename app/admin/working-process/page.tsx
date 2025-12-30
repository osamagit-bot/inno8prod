'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS } from '../../../lib/api'

interface Step {
  id?: number
  number: string
  title: string
  description: string
  icon_svg: string
  order: number
  is_active: boolean
}

interface SectionData {
  subtitle: string
  title: string
  description: string
}

export default function WorkingProcess() {
  const [sectionData, setSectionData] = useState<SectionData>({
    subtitle: 'How We Work',
    title: 'Our Working Process',
    description: 'We follow a proven methodology to deliver exceptional results for every project'
  })
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, number: '01', title: 'Discovery & Planning', description: 'We analyze your requirements and create a comprehensive project roadmap.', icon_svg: '', order: 1, is_active: true },
    { id: 2, number: '02', title: 'Design & Development', description: 'Our expert team brings your vision to life with cutting-edge technology.', icon_svg: '', order: 2, is_active: true },
    { id: 3, number: '03', title: 'Testing & Quality', description: 'Rigorous testing ensures your solution meets the highest standards.', icon_svg: '', order: 3, is_active: true },
    { id: 4, number: '04', title: 'Launch & Support', description: 'We deploy your solution and provide ongoing support for success.', icon_svg: '', order: 4, is_active: true }
  ])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleteStep, setDeleteStep] = useState<Step | null>(null)
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
      fetchSteps()
    }
  }, [router])

  const fetchSectionData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WORKING_PROCESS_SECTION)
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

  const fetchSteps = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WORKING_PROCESS)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setSteps(data)
        }
      }
    } catch (err) {
      console.log('Using default steps')
    }
  }

  const validateForm = () => {
    if (!hasInteracted) return true
    
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
    
    // Validate steps
    steps.forEach((step, index) => {
      if (!step.number.trim()) {
        newErrors[`number_${index}`] = 'Step number is required'
      }
      if (!step.title.trim()) {
        newErrors[`title_${index}`] = 'Title is required'
      }
      if (!step.description.trim()) {
        newErrors[`description_${index}`] = 'Description is required'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return sectionData.subtitle.trim() && 
           sectionData.title.trim() && 
           sectionData.description.trim() &&
           steps.every(s => 
             s.number.trim() && 
             s.title.trim() && 
             s.description.trim()
           )
  }

  const saveSectionData = async () => {
    setHasInteracted(true)
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN_WORKING_PROCESS.replace('/working-process/', '/working-process-sections/')}1/`, {
        method: 'PUT',
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
        // Try POST if PUT fails (for creating new record)
        const postResponse = await fetch(`${API_ENDPOINTS.ADMIN_WORKING_PROCESS.replace('/working-process/', '/working-process-sections/')}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(sectionData)
        })
        if (postResponse.ok) {
          setSuccessMessage('Section data created successfully!')
          setShowSuccessModal(true)
          setErrors({})
        }
      }
    } catch (err) {
      setSuccessMessage('Error updating section data')
      setShowSuccessModal(true)
    }
  }

  const saveStep = async (index: number) => {
    setHasInteracted(true)
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    if (!token) {
      setSuccessMessage('Please login again')
      setShowSuccessModal(true)
      return
    }
    
    const step = steps[index]
    
    try {
      let response
      if (step.id && step.id < Date.now() - 1000000) {
        // Update existing step
        response = await fetch(`${API_ENDPOINTS.ADMIN_WORKING_PROCESS}${step.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            number: step.number,
            title: step.title,
            description: step.description,
            icon_svg: step.icon_svg || '',
            order: step.order,
            is_active: step.is_active
          })
        })
      } else {
        // Create new step
        response = await fetch(API_ENDPOINTS.ADMIN_WORKING_PROCESS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            number: step.number,
            title: step.title,
            description: step.description,
            icon_svg: step.icon_svg || '',
            order: step.order,
            is_active: step.is_active
          })
        })
      }
      
      if (response.ok) {
        setSuccessMessage(`Step "${step.title}" saved successfully!`)
        setShowSuccessModal(true)
        setErrors({})
        await fetchSteps()
      } else {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
    } catch (err) {
      setSuccessMessage(`Error saving step "${step.title}": ${err instanceof Error ? err.message : String(err)}`)
      setShowSuccessModal(true)
    }
  }

  const addStep = () => {
    const newStep: Step = {
      id: Date.now(),
      number: String(steps.length + 1).padStart(2, '0'),
      title: '',
      description: '',
      icon_svg: '',
      order: steps.length + 1,
      is_active: true
    }
    setSteps([...steps, newStep])
  }

  const confirmDelete = (index: number, step: Step) => {
    setDeleteIndex(index)
    setDeleteStep(step)
    setShowDeleteModal(true)
  }

  const handleDeleteStep = async () => {
    const token = localStorage.getItem('access_token')
    if (deleteStep && deleteStep.id && deleteStep.id < 1000) {
      try {
        await fetch(`${API_ENDPOINTS.ADMIN_WORKING_PROCESS}${deleteStep.id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (err) {
        console.error('Delete error:', err)
      }
    }
    setSteps(steps.filter((_, i) => i !== deleteIndex))
    setShowDeleteModal(false)
    setDeleteIndex(null)
    setDeleteStep(null)
  }

  const updateStep = (index: number, field: string, value: any) => {
    setHasInteracted(true)
    const updated = [...steps]
    ;(updated[index] as any)[field] = value
    setSteps(updated)
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
          <h2 className="text-lg font-medium text-gray-900 mb-6">Working Process Management</h2>
          
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
                    setHasInteracted(true)
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
                    setHasInteracted(true)
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
                    setHasInteracted(true)
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

          {/* Process Steps */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-800">Process Steps</h3>
              <button
                onClick={addStep}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Step
              </button>
            </div>
            
            {steps.map((step, index) => (
              <div key={step.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Step Number</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`number_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={step.number}
                      onChange={(e) => updateStep(index, 'number', e.target.value)}
                    />
                    {errors[`number_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`number_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`title_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={step.title}
                      onChange={(e) => updateStep(index, 'title', e.target.value)}
                    />
                    {errors[`title_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`title_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={step.order}
                      onChange={(e) => updateStep(index, 'order', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => saveStep(index)}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      {step.id && step.id < Date.now() - 1000000 ? 'Update' : 'Save'}
                    </button>
                    <button
                      onClick={() => confirmDelete(index, step)}
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
                    value={step.description}
                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                  />
                  {errors[`description_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`description_${index}`]}</p>}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">SVG Icon</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-xs"
                    placeholder='<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">...</svg>'
                    value={step.icon_svg || ''}
                    onChange={(e) => updateStep(index, 'icon_svg', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste SVG code here for the step icon.</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <p className="text-gray-600 text-sm">
              Save each step individually using the Save/Update buttons above.
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Step</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this step? This action cannot be undone.</p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStep}
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