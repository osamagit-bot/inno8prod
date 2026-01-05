'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '../../../lib/api'

interface TestimonialSubmission {
  id: number
  name: string
  position: string
  company: string
  content: string
  rating: number
  submitted_at: string
  is_approved: boolean
}

export default function TestimonialSubmissionsAdmin() {
  const [submissions, setSubmissions] = useState<TestimonialSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<TestimonialSubmission | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchSubmissions()
  }, [router])

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(API_ENDPOINTS.TESTIMONIAL_SUBMISSIONS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      } else if (response.status === 401) {
        localStorage.removeItem('access_token')
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleApproval = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_ENDPOINTS.ADMIN_TESTIMONIAL_SUBMISSIONS}${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_approved: !currentStatus })
      })
      
      if (response.ok) {
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === id ? { ...sub, is_approved: !currentStatus } : sub
          )
        )
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(prev => prev ? { ...prev, is_approved: !currentStatus } : null)
        }
      }
    } catch (error) {
      console.error('Error updating approval:', error)
    }
  }

  const addToTestimonials = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token')
      const submission = submissions.find(s => s.id === id)
      if (!submission || !submission.is_approved) return
      
      // First check if testimonial already exists
      const checkResponse = await fetch(API_ENDPOINTS.ADMIN_TESTIMONIALS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (checkResponse.ok) {
        const existingTestimonials = await checkResponse.json()
        const testimonialsList = existingTestimonials.results || existingTestimonials
        const duplicate = testimonialsList.find((t: any) => 
          t.name.toLowerCase() === submission.name.toLowerCase() && 
          t.company.toLowerCase() === submission.company.toLowerCase()
        )
        
        if (duplicate) {
          setShowDuplicateModal(true)
          return
        }
      }
      
      const response = await fetch(`${API_ENDPOINTS.ADMIN_TESTIMONIALS}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: submission.name,
          position: submission.position,
          company: submission.company,
          content: submission.content,
          rating: submission.rating,
          order: 0,
          is_active: true
        })
      })
      
      if (response.ok) {
        setShowSuccessModal(true)
      } else {
        alert('Error adding testimonial')
      }
    } catch (error) {
      alert('Error adding testimonial')
    }
  }

  const deleteSubmission = async (id: number) => {
    setSubmissionToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!submissionToDelete) return
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_ENDPOINTS.ADMIN_TESTIMONIAL_SUBMISSIONS}${submissionToDelete}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setSubmissions(prev => prev.filter(sub => sub.id !== submissionToDelete))
        if (selectedSubmission?.id === submissionToDelete) {
          setSelectedSubmission(null)
        }
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
    } finally {
      setShowDeleteModal(false)
      setSubmissionToDelete(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonial submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50" style={{backgroundColor: '#0477BF', color: 'white', padding: '16px'}}>
        <a href="/" style={{color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold'}}>
          ← Back to Website
        </a>
      </div>
      
      <div className="container mx-auto px-4 py-8" style={{marginTop: '64px'}}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Testimonial Submissions</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submissions List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">All Submissions ({submissions.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {submissions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No testimonial submissions yet.
                </div>
              ) : (
                submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedSubmission?.id === submission.id ? 'bg-blue-50 border-blue-200' : ''
                    } ${!submission.is_approved ? 'bg-yellow-50' : 'bg-green-50'}`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{submission.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            submission.is_approved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {submission.is_approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{submission.position}, {submission.company}</p>
                        <div className="flex items-center mt-1">
                          {renderStars(submission.rating)}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(submission.submitted_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Submission Details</h2>
            </div>
            <div className="p-6">
              {selectedSubmission ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-gray-900">{selectedSubmission.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <p className="mt-1 text-gray-900">{selectedSubmission.position}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <p className="mt-1 text-gray-900">{selectedSubmission.company}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <div className="mt-1 flex items-center">
                      {renderStars(selectedSubmission.rating)}
                      <span className="ml-2 text-gray-600">({selectedSubmission.rating}/5)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Review</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.content}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                    <p className="mt-1 text-gray-900">{formatDate(selectedSubmission.submitted_at)}</p>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => toggleApproval(selectedSubmission.id, selectedSubmission.is_approved)}
                      className={`px-4 py-2 text-white rounded ${
                        selectedSubmission.is_approved 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {selectedSubmission.is_approved ? 'Unapprove' : 'Approve'}
                    </button>
                    {selectedSubmission.is_approved && (
                      <button
                        onClick={() => addToTestimonials(selectedSubmission.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add to Testimonials
                      </button>
                    )}
                    <button
                      onClick={() => deleteSubmission(selectedSubmission.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Select a submission to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowSuccessModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
                <p className="text-sm text-gray-500 mb-6">Testimonial added successfully to the website.</p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDuplicateModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Duplicate Testimonial</h3>
                <p className="text-sm text-gray-500 mb-6">Testimonial already exists for this person and company.</p>
                <button
                  onClick={() => setShowDuplicateModal(false)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Submission</h3>
                <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this testimonial submission? This action cannot be undone.</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}