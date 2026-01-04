'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchMaintenanceStatus } from '@/lib/api'

export default function MaintenancePage() {
  const router = useRouter()

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const data = await fetchMaintenanceStatus()
        if (!data.maintenance_mode) {
          router.push('/')
        }
      } catch (error) {
        console.error('Failed to check maintenance status:', error)
      }
    }

    checkMaintenance()
    const interval = setInterval(checkMaintenance, 5000)
    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#012340'}}>
      <div className="text-center text-white px-4">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{backgroundColor: '#0477BF'}}>
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Site Under Maintenance</h1>
          <p className="text-xl mb-6" style={{color: '#FCB316'}}>
            We're currently performing scheduled maintenance to improve your experience.
          </p>
          <p className="text-lg opacity-80">
            We'll be back online shortly. Thank you for your patience!
          </p>
        </div>
        
        <div className="mt-8">
          <p className="text-sm opacity-60">
            For urgent inquiries, please contact us at{' '}
            <a href="mailto:info.inno8sh@gmail.com" className="underline" style={{color: '#FCB316'}}>
              info.inno8sh@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}