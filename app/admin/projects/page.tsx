'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS, getImageUrl } from '../../../lib/api'
import Image from 'next/image'

interface Project {
  id?: number
  title: string
  description: string
  image: string | File
  url: string
  learn_more_url: string
  live_preview_url: string
  technologies: string
  is_featured: boolean
  is_active: boolean
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const projectsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchProjects()
    }
  }, [router])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(API_ENDPOINTS.ADMIN_PROJECTS, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.log('Using empty projects list')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    projects.forEach((project, index) => {
      if (!project.title.trim()) newErrors[`title_${index}`] = 'Title is required'
      if (!project.description.trim()) newErrors[`description_${index}`] = 'Description is required'
      if (!project.technologies.trim()) newErrors[`technologies_${index}`] = 'Technologies is required'
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return projects.every(p => 
      p.title.trim() && 
      p.description.trim() && 
      p.technologies.trim()
    )
  }

  const saveProject = async (index: number) => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    if (!token) {
      setSuccessMessage('Please login again')
      setShowSuccessModal(true)
      return
    }
    
    const project = projects[index]
    
    try {
      const formData = new FormData()
      formData.append('title', project.title)
      formData.append('description', project.description)
      formData.append('url', project.url || '')
      formData.append('learn_more_url', project.learn_more_url || '')
      formData.append('live_preview_url', project.live_preview_url || '')
      formData.append('technologies', project.technologies)
      formData.append('is_featured', project.is_featured.toString())
      formData.append('is_active', project.is_active.toString())
      
      if (project.image instanceof File) {
        formData.append('image', project.image)
      }
      
      let response
      if (project.id) {
        response = await fetch(`${API_ENDPOINTS.ADMIN_PROJECTS}${project.id}/`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })
      } else {
        response = await fetch(API_ENDPOINTS.ADMIN_PROJECTS, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })
      }
      
      if (response.ok) {
        setSuccessMessage(`Project "${project.title}" saved successfully!`)
        setShowSuccessModal(true)
        setErrors({})
        await fetchProjects()
      } else {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
    } catch (err) {
      setSuccessMessage(`Error saving project "${project.title}": ${err instanceof Error ? err.message : 'Unknown error'}`)
      setShowSuccessModal(true)
    }
  }

  const addProject = () => {
    const newProject: Project = {
      title: '',
      description: '',
      image: '',
      url: '',
      learn_more_url: '',
      live_preview_url: '',
      technologies: '',
      is_featured: false,
      is_active: true
    }
    setProjects([...projects, newProject])
    
    // Scroll to the new project after a short delay
    setTimeout(() => {
      if (projectsContainerRef.current) {
        const newProjectElement = projectsContainerRef.current.lastElementChild
        if (newProjectElement) {
          newProjectElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, 100)
  }

  const deleteProject = async (index: number) => {
    setDeleteIndex(index)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (deleteIndex === null) return
    
    const project = projects[deleteIndex]
    if (project.id) {
      const token = localStorage.getItem('access_token')
      try {
        const response = await fetch(`${API_ENDPOINTS.ADMIN_PROJECTS}${project.id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          setProjects(projects.filter((_, i) => i !== deleteIndex))
          setSuccessMessage('Project deleted successfully!')
          setShowSuccessModal(true)
        }
      } catch (err) {
        console.error('Delete error:', err)
        setSuccessMessage('Error deleting project')
        setShowSuccessModal(true)
      }
    } else {
      setProjects(projects.filter((_, i) => i !== deleteIndex))
    }
    setShowDeleteModal(false)
    setDeleteIndex(null)
  }

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects]
    ;(updated[index] as any)[field] = value
    setProjects(updated)
    setTimeout(() => validateForm(), 0)
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
      updateProject(index, 'image', file)
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
          <h2 className="text-lg font-medium text-gray-900 mb-6">Projects Management</h2>
          
          <div className="space-y-4" ref={projectsContainerRef}>
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-800">Projects</h3>
              <button
                onClick={addProject}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Project
              </button>
            </div>
            
            {projects.map((project, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project Title</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`title_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={project.title}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                    />
                    {errors[`title_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`title_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project URL</label>
                    <input
                      type="url"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={project.url}
                      onChange={(e) => updateProject(index, 'url', e.target.value)}
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => saveProject(index)}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      {project.id ? 'Update' : 'Save'}
                    </button>
                    <button
                      onClick={() => deleteProject(index)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Learn More URL</label>
                    <input
                      type="url"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={project.learn_more_url}
                      onChange={(e) => updateProject(index, 'learn_more_url', e.target.value)}
                      placeholder="https://example.com/learn-more"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Live Preview URL</label>
                    <input
                      type="url"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={project.live_preview_url}
                      onChange={(e) => updateProject(index, 'live_preview_url', e.target.value)}
                      placeholder="https://example.com/live-demo"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                      errors[`description_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                  />
                  {errors[`description_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`description_${index}`]}</p>}
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Technologies (comma separated)</label>
                  <input
                    type="text"
                    className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                      errors[`technologies_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={project.technologies}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                    placeholder="React, Node.js, MongoDB"
                  />
                  {errors[`technologies_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`technologies_${index}`]}</p>}
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Project Image</label>
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
                  {project.image && (
                    <div className="mt-2">
                      <Image
                        src={typeof project.image === 'string' ? getImageUrl(project.image) : URL.createObjectURL(project.image)}
                        alt="Preview"
                        width={128}
                        height={80}
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={project.is_featured}
                      onChange={(e) => updateProject(index, 'is_featured', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Project</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={project.is_active}
                      onChange={(e) => updateProject(index, 'is_active', e.target.checked)}
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
              Save each project individually using the Save/Update buttons above.
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Project</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this project? This action cannot be undone.</p>
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