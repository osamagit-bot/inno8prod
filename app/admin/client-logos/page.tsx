'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS, getImageUrl } from '../../../lib/api'
import Image from 'next/image'

interface ClientLogo {
  id?: number
  name: string
  logo: string | File
  order: number
  is_active: boolean
}

export default function AdminClientLogos() {
  const [logos, setLogos] = useState<ClientLogo[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchLogos()
    }
  }, [router])

  const fetchLogos = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(API_ENDPOINTS.ADMIN_CLIENT_LOGOS, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setLogos(data)
      }
    } catch (error) {
      console.log('Using empty logos list')
    }
  }

  const saveAllLogos = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setSuccessMessage('Please login again')
      setShowSuccessModal(true)
      return
    }
    
    try {
      for (const logo of logos) {
        if (!logo.id && !(logo.logo instanceof File)) {
          continue
        }
        
        let response
        if (logo.id) {
          if (logo.logo instanceof File) {
            const formData = new FormData()
            formData.append('name', logo.name)
            formData.append('order', logo.order.toString())
            formData.append('is_active', logo.is_active.toString())
            formData.append('logo', logo.logo)
            
            response = await fetch(`${API_ENDPOINTS.ADMIN_CLIENT_LOGOS}${logo.id}/`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}` },
              body: formData
            })
          } else {
            response = await fetch(`${API_ENDPOINTS.ADMIN_CLIENT_LOGOS}${logo.id}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                name: logo.name,
                order: logo.order,
                is_active: logo.is_active
              })
            })
          }
        } else {
          const formData = new FormData()
          formData.append('name', logo.name)
          formData.append('order', logo.order.toString())
          formData.append('is_active', logo.is_active.toString())
          formData.append('logo', logo.logo)
          
          response = await fetch(API_ENDPOINTS.ADMIN_CLIENT_LOGOS, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          })
        }
        
        if (!response.ok) {
          throw new Error(`Failed to save logo: ${logo.name}`)
        }
      }
      setSuccessMessage('Client logos saved successfully!')
      setShowSuccessModal(true)
      await fetchLogos()
    } catch (err) {
      setSuccessMessage(`Error: ${err.message}`)
      setShowSuccessModal(true)
    }
  }

  const addLogo = () => {
    const newLogo: ClientLogo = {
      name: 'New Client',
      logo: '',
      order: logos.length,
      is_active: true
    }
    setLogos([...logos, newLogo])
  }

  const deleteLogo = async (index: number) => {
    setDeleteIndex(index)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (deleteIndex === null) return
    
    const logo = logos[deleteIndex]
    if (logo.id) {
      const token = localStorage.getItem('access_token')
      try {
        const response = await fetch(`${API_ENDPOINTS.ADMIN_CLIENT_LOGOS}${logo.id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          setLogos(logos.filter((_, i) => i !== deleteIndex))
          setSuccessMessage('Client logo deleted successfully!')
          setShowSuccessModal(true)
        }
      } catch (err) {
        setSuccessMessage('Error deleting logo')
        setShowSuccessModal(true)
      }
    } else {
      setLogos(logos.filter((_, i) => i !== deleteIndex))
    }
    setShowDeleteModal(false)
    setDeleteIndex(null)
  }

  const updateLogo = (index: number, field: keyof ClientLogo, value: any) => {
    const updated = [...logos]
    updated[index][field] = value
    setLogos(updated)
  }

  const handleImageUpload = (index: number, file: File) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      updateLogo(index, 'logo', file)
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
          <h2 className="text-lg font-medium text-gray-900 mb-6">Client Logos Management</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-800">Client Logos</h3>
              <button
                onClick={addLogo}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Logo
              </button>
            </div>
            
            {logos.map((logo, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={logo.name}
                      onChange={(e) => updateLogo(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={logo.order}
                      onChange={(e) => updateLogo(index, 'order', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => deleteLogo(index)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Logo Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(index, file)
                      }
                    }}
                  />
                  {logo.logo && (
                    <div className="mt-2">
                      <Image
                        src={typeof logo.logo === 'string' ? getImageUrl(logo.logo) : URL.createObjectURL(logo.logo)}
                        alt="Preview"
                        width={120}
                        height={60}
                        className="object-contain rounded"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={logo.is_active}
                      onChange={(e) => updateLogo(index, 'is_active', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={saveAllLogos}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Save All Logos
            </button>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Logo</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this logo? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
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