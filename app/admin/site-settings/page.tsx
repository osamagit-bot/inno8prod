'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS, getImageUrl } from '../../../lib/api'

export default function SiteSettings() {
  const [siteSettings, setSiteSettings] = useState({
    site_name: 'Inno8 Solutions',
    email: 'info.inno8sh@gmail.com',
    phone: '+93 711 167 380',
    address: 'Kabul, Afghanistan',
    working_hours: '9:00 am - 6:00 pm',
    logo: null,
    mobile_logo: null
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchSiteSettings()
    }
  }, [router])

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SITE_SETTINGS)
      if (response.ok) {
        const data = await response.json()
        setSiteSettings(data)
      }
    } catch (err) {
      console.log('Using default settings')
    }
  }

  const updateSiteSettings = async () => {
    const token = localStorage.getItem('access_token')
    try {
      if (siteSettings.logo instanceof File || siteSettings.mobile_logo instanceof File) {
        const formData = new FormData()
        formData.append('site_name', siteSettings.site_name)
        formData.append('email', siteSettings.email)
        formData.append('phone', siteSettings.phone)
        formData.append('address', siteSettings.address)
        formData.append('working_hours', siteSettings.working_hours)
        
        if (siteSettings.logo instanceof File) {
          formData.append('logo', siteSettings.logo)
        }
        if (siteSettings.mobile_logo instanceof File) {
          formData.append('mobile_logo', siteSettings.mobile_logo)
        }
        
        await fetch(API_ENDPOINTS.ADMIN_SITE_SETTINGS, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
      } else {
        await fetch(API_ENDPOINTS.ADMIN_SITE_SETTINGS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(siteSettings)
        })
      }
      setSuccessMessage('Settings updated successfully!')
      setShowSuccessModal(true)
    } catch (err) {
      setSuccessMessage('Error updating settings')
      setShowSuccessModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50" style={{backgroundColor: '#0477BF', color: 'white', padding: '16px'}}>
        <Link href="/admin/dashboard" style={{color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold'}}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="pt-16 max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Site Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={siteSettings.site_name}
                onChange={(e) => setSiteSettings({...siteSettings, site_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={siteSettings.email}
                onChange={(e) => setSiteSettings({...siteSettings, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={siteSettings.phone}
                onChange={(e) => setSiteSettings({...siteSettings, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={siteSettings.address}
                onChange={(e) => setSiteSettings({...siteSettings, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Working Hours</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={siteSettings.working_hours}
                onChange={(e) => setSiteSettings({...siteSettings, working_hours: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Desktop Logo</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSiteSettings({...siteSettings, logo: file})
                  }
                }}
              />
              {siteSettings.logo && (
                <img 
                  src={typeof siteSettings.logo === 'string' ? getImageUrl(siteSettings.logo) : URL.createObjectURL(siteSettings.logo)} 
                  alt="Desktop Logo Preview" 
                  className="mt-2 h-12 w-auto object-contain" 
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Logo</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSiteSettings({...siteSettings, mobile_logo: file})
                  }
                }}
              />
              {siteSettings.mobile_logo && (
                <img 
                  src={typeof siteSettings.mobile_logo === 'string' ? getImageUrl(siteSettings.mobile_logo) : URL.createObjectURL(siteSettings.mobile_logo)} 
                  alt="Mobile Logo Preview" 
                  className="mt-2 h-10 w-auto object-contain" 
                />
              )}
            </div>
            <button
              onClick={updateSiteSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Update Settings
            </button>
          </div>
        </div>
      </div>

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