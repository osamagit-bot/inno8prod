'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS, getImageUrl } from '../../../lib/api'

interface TeamMember {
  id: number
  name: string
  position: string
  image: string | File | null
  facebook_url: string
  twitter_url: string
  google_plus_url: string
  pinterest_url: string
  is_active: boolean
  imageUrl?: string
  imagePreview?: string
}

export default function TeamAdmin() {
  const [sectionData, setSectionData] = useState({
    subtitle: 'OUR PROFESSIONAL',
    title: 'Meet Our Experts People'
  })
  const [members, setMembers] = useState<TeamMember[]>([
    { 
      id: 1, 
      name: '', 
      position: '', 
      image: null, 
      facebook_url: '', 
      twitter_url: '', 
      google_plus_url: '', 
      pinterest_url: '',
      is_active: true
    }
  ])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleteMember, setDeleteMember] = useState<TeamMember | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchSectionData()
      fetchMembers()
    }
  }, [router])

  const fetchSectionData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TEAM_SECTION)
      if (response.ok) {
        const data = await response.json()
        setSectionData({
          subtitle: data.subtitle || sectionData.subtitle,
          title: data.title || sectionData.title
        })
      }
    } catch (err) {
      console.log('Using default section data')
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_TEAM_MEMBERS, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          const membersWithImageUrls = data.map((member: any) => ({
            ...member,
            imageUrl: member.image ? getImageUrl(member.image) : null
          }))
          setMembers(membersWithImageUrls)
        }
      }
    } catch (err) {
      console.log('Using default members')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!sectionData.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required'
    }
    if (!sectionData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`name_${index}`] = 'Name is required'
      }
      if (!member.position.trim()) {
        newErrors[`position_${index}`] = 'Position is required'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return sectionData.subtitle.trim() && 
           sectionData.title.trim() &&
           members.every(m => m.name.trim() && m.position.trim())
  }

  const saveSectionData = async () => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_TEAM_SECTIONS, {
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
      }
    } catch (err) {
      setSuccessMessage('Error updating section data')
      setShowSuccessModal(true)
    }
  }

  const saveMember = async (index: number) => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    const member = members[index]
    
    try {
      const formData = new FormData()
      formData.append('name', member.name)
      formData.append('position', member.position)
      formData.append('facebook_url', member.facebook_url || '')
      formData.append('twitter_url', member.twitter_url || '')
      formData.append('google_plus_url', member.google_plus_url || '')
      formData.append('pinterest_url', member.pinterest_url || '')
      formData.append('is_active', String(member.is_active !== false))
      
      if (member.image && typeof member.image === 'object' && (member.image as any) instanceof File) {
        formData.append('image', member.image)
      }
      
      let response
      if (member.id && member.id < Date.now() - 1000000) {
        response = await fetch(`${API_ENDPOINTS.ADMIN_TEAM_MEMBERS}${member.id}/`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })
      } else {
        response = await fetch(API_ENDPOINTS.ADMIN_TEAM_MEMBERS, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })
      }
      
      if (response.ok) {
        setSuccessMessage(`Team member "${member.name}" saved successfully!`)
        setShowSuccessModal(true)
        setErrors({})
        await fetchMembers()
      } else {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
    } catch (err) {
      setSuccessMessage(`Error saving member "${member.name}": ${err instanceof Error ? err.message : String(err)}`)
      setShowSuccessModal(true)
    }
  }

  const addMember = () => {
    const newMember: TeamMember = {
      id: Date.now(),
      name: '',
      position: '',
      image: null,
      facebook_url: '',
      twitter_url: '',
      google_plus_url: '',
      pinterest_url: '',
      is_active: true
    }
    setMembers([...members, newMember])
  }

  const confirmDelete = (index: number, member: TeamMember) => {
    setDeleteIndex(index)
    setDeleteMember(member)
    setShowDeleteModal(true)
  }

  const handleDeleteMember = async () => {
    const token = localStorage.getItem('access_token')
    if (deleteMember && deleteMember.id && deleteMember.id < 1000) {
      try {
        await fetch(`${API_ENDPOINTS.ADMIN_TEAM_MEMBERS}${deleteMember.id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      } catch (err) {
        console.error('Delete error:', err)
      }
    }
    setMembers(members.filter((_, i) => i !== deleteIndex))
    setShowDeleteModal(false)
    setDeleteIndex(null)
    setDeleteMember(null)
  }

  const updateMember = (index: number, field: string, value: any) => {
    const updated = [...members]
    ;(updated[index] as any)[field] = value
    setMembers(updated)
    setTimeout(() => validateForm(), 0)
  }

  const handleImageUpload = (index: number, file: File) => {
    const updated = [...members]
    updated[index].image = file
    if (file) {
      updated[index].imagePreview = URL.createObjectURL(file)
    }
    setMembers(updated)
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
          <h2 className="text-lg font-medium text-gray-900 mb-6">Team Management</h2>
          
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

          {/* Team Members */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-800">Team Members</h3>
              <button
                onClick={addMember}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Member
              </button>
            </div>
            
            {members.map((member, index) => (
              <div key={member.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`name_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
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
                      value={member.position}
                      onChange={(e) => updateMember(index, 'position', e.target.value)}
                    />
                    {errors[`position_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`position_${index}`]}</p>}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Profile Image</label>
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
                  {member.image && (member.image as any) instanceof File && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Selected: {(member.image as File).name}</p>
                      {member.imagePreview && (
                        <div className="w-32 h-32 border rounded overflow-hidden">
                          <img 
                            src={member.imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {member.imageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Current image:</p>
                      <div className="w-32 h-32 border rounded overflow-hidden bg-gray-100">
                        <img 
                          src={member.imageUrl} 
                          alt="Current" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                    <input
                      type="url"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={member.facebook_url}
                      onChange={(e) => updateMember(index, 'facebook_url', e.target.value)}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
                    <input
                      type="url"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={member.twitter_url}
                      onChange={(e) => updateMember(index, 'twitter_url', e.target.value)}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                    <input
                      type="url"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={member.google_plus_url}
                      onChange={(e) => updateMember(index, 'google_plus_url', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                    <input
                      type="url"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={member.pinterest_url}
                      onChange={(e) => updateMember(index, 'pinterest_url', e.target.value)}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={member.is_active !== false}
                      onChange={(e) => updateMember(index, 'is_active', e.target.checked)}
                      className="mr-2"
                    />
                    Active Member
                  </label>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => saveMember(index)}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      {member.id && member.id < Date.now() - 1000000 ? 'Update' : 'Save'}
                    </button>
                    <button
                      onClick={() => confirmDelete(index, member)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Team Member</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this team member? This action cannot be undone.</p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMember}
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