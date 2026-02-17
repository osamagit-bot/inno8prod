'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SendNotification from '@/components/SendNotification'

export default function NewsletterPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0477BF] text-white p-4">
        <a href="/admin/dashboard" className="text-white font-bold">← Back to Dashboard</a>
      </div>

      <div className="max-w-4xl mx-auto py-6 px-4 mt-16">
        <SendNotification />
      </div>
    </div>
  )
}
