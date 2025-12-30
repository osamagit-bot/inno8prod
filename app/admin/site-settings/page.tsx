'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { API_ENDPOINTS, getImageUrl } from '../../../lib/api'

export default function SiteSettings() {
  const [siteSettings, setSiteSettings] = useState<{
    site_name: string
    email: string
    phone: string
    address: string
    working_hours: string
    facebook_url: string
    instagram_url: string
    telegram_url: string
    linkedin_url: string
    youtube_url: string
    logo: string | File | null
    mobile_logo: string | File | null
  }>({
    site_name: 'Inno8 Solutions',
    email: 'info.inno8sh@gmail.com',
    phone: '+93 711 167 380',
    address: 'Kabul, Afghanistan',
    working_hours: '9:00 am - 6:00 pm',
    facebook_url: '',
    instagram_url: '',
    telegram_url: '',
    linkedin_url: '',
    youtube_url: '',
    logo: null,
    mobile_logo: null
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!siteSettings.site_name.trim()) newErrors.site_name = 'Site name is required'
    if (!siteSettings.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteSettings.email)) newErrors.email = 'Invalid email format'
    if (!siteSettings.phone.trim()) newErrors.phone = 'Phone is required'
    if (!siteSettings.address.trim()) newErrors.address = 'Address is required'
    if (!siteSettings.working_hours.trim()) newErrors.working_hours = 'Working hours is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return siteSettings.site_name.trim() && 
           siteSettings.email.trim() && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteSettings.email) &&
           siteSettings.phone.trim() &&
           siteSettings.address.trim() &&
           siteSettings.working_hours.trim()
  }

  const updateSiteSettings = async () => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    try {
      let response
      const hasNewFiles = (siteSettings.logo && siteSettings.logo instanceof File) || (siteSettings.mobile_logo && siteSettings.mobile_logo instanceof File)
      
      if (hasNewFiles) {
        const formData = new FormData()
        formData.append('site_name', siteSettings.site_name)
        formData.append('email', siteSettings.email)
        formData.append('phone', siteSettings.phone)
        formData.append('address', siteSettings.address)
        formData.append('working_hours', siteSettings.working_hours)
        formData.append('facebook_url', siteSettings.facebook_url || '')
        formData.append('instagram_url', siteSettings.instagram_url || '')
        formData.append('telegram_url', siteSettings.telegram_url || '')
        formData.append('linkedin_url', siteSettings.linkedin_url || '')
        formData.append('youtube_url', siteSettings.youtube_url || '')
        
        if (siteSettings.logo instanceof File) {
          formData.append('logo', siteSettings.logo)
        }
        if (siteSettings.mobile_logo instanceof File) {
          formData.append('mobile_logo', siteSettings.mobile_logo)
        }
        
        response = await fetch(API_ENDPOINTS.ADMIN_SITE_SETTINGS, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
      } else {
        // Only send text fields when no new files are uploaded
        const textOnlyData = {
          site_name: siteSettings.site_name,
          email: siteSettings.email,
          phone: siteSettings.phone,
          address: siteSettings.address,
          working_hours: siteSettings.working_hours,
          facebook_url: siteSettings.facebook_url || '',
          instagram_url: siteSettings.instagram_url || '',
          telegram_url: siteSettings.telegram_url || '',
          linkedin_url: siteSettings.linkedin_url || '',
          youtube_url: siteSettings.youtube_url || ''
        }
        
        response = await fetch(API_ENDPOINTS.ADMIN_SITE_SETTINGS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(textOnlyData)
        })
      }
      
      if (response.ok) {
        setSuccessMessage('Settings updated successfully!')
        setShowSuccessModal(true)
        setErrors({})
        // Refresh the data from server
        await fetchSiteSettings()
      } else {
        const errorData = await response.text() // Use text() instead of json() in case response isn't JSON
        console.error('Server response:', errorData)
        setSuccessMessage(`Error updating settings: ${response.status} - ${response.statusText}`)
        setShowSuccessModal(true)
      }
    } catch (err) {
      setSuccessMessage('Error updating settings: Network error')
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
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.site_name ? 'border-red-500' : 'border-gray-300'
                }`}
                value={siteSettings.site_name}
                onChange={(e) => {
                  setSiteSettings({...siteSettings, site_name: e.target.value})
                  setTimeout(() => validateForm(), 0)
                }}
              />
              {errors.site_name && <p className="text-red-500 text-sm mt-1">{errors.site_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                value={siteSettings.email}
                onChange={(e) => {
                  setSiteSettings({...siteSettings, email: e.target.value})
                  setTimeout(() => validateForm(), 0)
                }}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                value={siteSettings.phone}
                onChange={(e) => {
                  setSiteSettings({...siteSettings, phone: e.target.value})
                  setTimeout(() => validateForm(), 0)
                }}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                value={siteSettings.address}
                onChange={(e) => {
                  setSiteSettings({...siteSettings, address: e.target.value})
                  setTimeout(() => validateForm(), 0)
                }}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Working Hours</label>
              <input
                type="text"
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                  errors.working_hours ? 'border-red-500' : 'border-gray-300'
                }`}
                value={siteSettings.working_hours}
                onChange={(e) => {
                  setSiteSettings({...siteSettings, working_hours: e.target.value})
                  setTimeout(() => validateForm(), 0)
                }}
              />
              {errors.working_hours && <p className="text-red-500 text-sm mt-1">{errors.working_hours}</p>}
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
            
            {/* Social Media URLs */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                  <input
                    type="url"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={siteSettings.facebook_url}
                    onChange={(e) => setSiteSettings({...siteSettings, facebook_url: e.target.value})}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                  <input
                    type="url"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={siteSettings.instagram_url}
                    onChange={(e) => setSiteSettings({...siteSettings, instagram_url: e.target.value})}
                    placeholder="https:instagram.com/yourhandle"
                  />
                </div>
                   <div>
                  <label className="block text-sm font-medium text-gray-700">Telegram URL</label>
                  <input
                    type="url"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={siteSettings.telegram_url}
                    onChange={(e) => setSiteSettings({...siteSettings, telegram_url: e.target.value})}
                    placeholder="https://telegram.com/yourhandle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <input
                    type="url"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={siteSettings.linkedin_url}
                    onChange={(e) => setSiteSettings({...siteSettings, linkedin_url: e.target.value})}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
                  <input
                    type="url"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={siteSettings.youtube_url}
                    onChange={(e) => setSiteSettings({...siteSettings, youtube_url: e.target.value})}
                    placeholder="https://youtube.com/channel/yourchannel"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={updateSiteSettings}
              disabled={!isFormValid()}
              className={`px-4 py-2 rounded-md ${
                isFormValid() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
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