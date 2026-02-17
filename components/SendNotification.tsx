'use client'

import { useState, useEffect } from 'react'

export default function SendNotification() {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'blog' | 'project'>('blog')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [subscribers, setSubscribers] = useState<{email: string, subscribed_at: string}[]>([])
  const [showSubscribers, setShowSubscribers] = useState(false)
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(true)

  useEffect(() => {
    fetchSubscriberCount()
    fetchSubscribers()
  }, [])

  useEffect(() => {
    if (selectAll) {
      setSelectedEmails(subscribers.map(s => s.email))
    }
  }, [subscribers, selectAll])

  const fetchSubscriberCount = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010'
      const res = await fetch(`${apiUrl}/api/newsletter/count/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSubscriberCount(data.count)
      }
    } catch (err) {
      console.error('Failed to fetch subscriber count')
    }
  }

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010'
      const res = await fetch(`${apiUrl}/api/newsletter/subscribers/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSubscribers(data.subscribers || [])
      }
    } catch (err) {
      console.error('Failed to fetch subscribers')
    }
  }

  const handleToggleEmail = (email: string) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    )
    setSelectAll(false)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([])
      setSelectAll(false)
    } else {
      setSelectedEmails(subscribers.map(s => s.email))
      setSelectAll(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedEmails.length === 0) {
      setError('Please select at least one subscriber')
      return
    }
    
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010'
      const res = await fetch(`${apiUrl}/api/newsletter/send-notification/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, type, url, emails: selectedEmails })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message)
        setTitle('')
        setUrl('')
      } else {
        setError(data.error || 'Failed to send notification')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">📧 Send Newsletter Notification</h2>
      <p className="text-gray-600 mb-6">
        <span className="font-bold text-[#0477BF]">{selectedEmails.length}</span> of {subscriberCount} subscribers selected
        <button 
          onClick={() => setShowSubscribers(!showSubscribers)}
          className="ml-3 text-sm text-[#0477BF] underline"
        >
          {showSubscribers ? 'Hide' : 'Select'} Subscribers
        </button>
      </p>

      {showSubscribers && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Select Subscribers ({subscribers.length})</h3>
            <button
              onClick={handleSelectAll}
              className="text-sm px-3 py-1 bg-[#0477BF] text-white rounded hover:bg-[#035a8f]"
            >
              {selectAll ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {subscribers.length > 0 ? (
              <div className="space-y-2">
                {subscribers.map((sub, idx) => (
                  <label key={idx} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(sub.email)}
                      onChange={() => handleToggleEmail(sub.email)}
                      className="mr-3 w-4 h-4 text-[#0477BF] rounded focus:ring-[#0477BF]"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{sub.email}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({new Date(sub.subscribed_at).toLocaleDateString()})
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No subscribers yet</p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Content Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'blog' | 'project')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0477BF]"
          >
            <option value="blog">Blog Post</option>
            <option value="project">Project</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog/project title"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0477BF]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://inno8solutions.com/blog/..."
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0477BF]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || selectedEmails.length === 0}
          className="w-full px-6 py-3 bg-[#0477BF] text-white font-bold rounded-lg hover:bg-[#035a8f] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Sending...' : `Send to ${selectedEmails.length} Selected Subscriber${selectedEmails.length !== 1 ? 's' : ''}`}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold">✅ {message}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold">❌ {error}</p>
        </div>
      )}
    </div>
  )
}
