'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '../../../lib/api'

interface ContactSubmission {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  submitted_at: string
  is_read: boolean
}

export default function ContactSubmissionsAdmin() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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
      const response = await fetch(API_ENDPOINTS.CONTACT_SUBMISSIONS, {
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

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_ENDPOINTS.ADMIN_CONTACT_SUBMISSIONS}${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_read: true })
      })
      
      if (response.ok) {
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === id ? { ...sub, is_read: true } : sub
          )
        )
      }
    } catch (error) {
      console.error('Error marking as read:', error)
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
      const response = await fetch(`${API_ENDPOINTS.ADMIN_CONTACT_SUBMISSIONS}${submissionToDelete}/`, {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
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
                  No contact submissions yet.
                </div>
              ) : (
                submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedSubmission?.id === submission.id ? 'bg-blue-50 border-blue-200' : ''
                    } ${!submission.is_read ? 'bg-yellow-50' : ''}`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{submission.name}</h3>
                          {!submission.is_read && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{submission.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {submission.subject || 'No subject'}
                        </p>
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
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{selectedSubmission.email}</p>
                  </div>
                  
                  {selectedSubmission.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-gray-900">{selectedSubmission.phone}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <p className="mt-1 text-gray-900">{selectedSubmission.subject || 'No subject'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                    <p className="mt-1 text-gray-900">{formatDate(selectedSubmission.submitted_at)}</p>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    {!selectedSubmission.is_read && (
                      <button
                        onClick={() => markAsRead(selectedSubmission.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark as Read
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
                <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this contact submission? This action cannot be undone.</p>
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