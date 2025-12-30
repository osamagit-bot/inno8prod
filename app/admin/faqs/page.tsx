'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '../../../lib/api'

interface FAQ {
  id?: number
  question: string
  answer: string
  order: number
  is_active: boolean
}

export default function FAQsAdmin() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchFAQs()
  }, [router])

  const fetchFAQs = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(API_ENDPOINTS.ADMIN_FAQS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setFaqs(data.sort((a: FAQ, b: FAQ) => a.order - b.order))
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (faqData: FAQ) => {
    try {
      const token = localStorage.getItem('access_token')
      const url = editingFAQ 
        ? `${API_ENDPOINTS.ADMIN_FAQS}${editingFAQ.id}/`
        : API_ENDPOINTS.ADMIN_FAQS
      
      const response = await fetch(url, {
        method: editingFAQ ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(faqData)
      })
      
      if (response.ok) {
        fetchFAQs()
        setShowForm(false)
        setEditingFAQ(null)
      }
    } catch (error) {
      console.error('Error saving FAQ:', error)
    }
  }

  const deleteFAQ = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_ENDPOINTS.ADMIN_FAQS}${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchFAQs()
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50" style={{backgroundColor: '#0477BF', color: 'white', padding: '16px'}}>
        <a href="/admin/dashboard" style={{color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold'}}>
          ← Back to Website
        </a>
      </div>
      
      <nav className="bg-white shadow-sm border-b mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold" style={{color: '#012340'}}>Manage FAQs</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Add FAQ
              </button>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{faq.order}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{faq.question}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${faq.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {faq.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => {
                        setEditingFAQ(faq)
                        setShowForm(true)
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFAQ(faq.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <FAQForm
          faq={editingFAQ}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingFAQ(null)
          }}
        />
      )}
    </div>
  )
}

function FAQForm({ faq, onSubmit, onCancel }: {
  faq: FAQ | null
  onSubmit: (faq: FAQ) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<FAQ>({
    question: faq?.question || '',
    answer: faq?.answer || '',
    order: faq?.order || 0,
    is_active: faq?.is_active ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{faq ? 'Edit FAQ' : 'Add FAQ'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Answer</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {faq ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}