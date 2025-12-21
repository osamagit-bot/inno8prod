'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ColorPalette() {
  const [colorPalette, setColorPalette] = useState({
    id: null,
    name: 'Default Inno8 Palette',
    primary_color: '#0477BF',
    secondary_color: '#012340',
    accent_color: '#FCB316',
    light_color: '#048ABF'
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchColorPalette()
    }
  }, [router])

  const fetchColorPalette = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:8010/api/admin/color-palettes/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        const activePalette = data.filter(p => p.is_active).sort((a, b) => b.id - a.id)[0]
        if (activePalette) {
          setColorPalette({
            id: activePalette.id,
            name: activePalette.name,
            primary_color: activePalette.primary_color,
            secondary_color: activePalette.secondary_color,
            accent_color: activePalette.accent_color,
            light_color: activePalette.light_color
          })
        }
      }
    } catch (err) {
      console.log('Using default color palette')
    }
  }

  const saveColorPalette = async () => {
    const token = localStorage.getItem('access_token')
    try {
      await fetch('http://localhost:8010/api/admin/color-palettes/deactivate-all/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const response = await fetch(`http://localhost:8010/api/admin/color-palettes/${colorPalette.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(colorPalette)
      })
      if (response.ok) {
        setSuccessMessage('Color palette saved successfully!')
        setShowSuccessModal(true)
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        const error = await response.json()
        setSuccessMessage('Error saving color palette: ' + (error.detail || 'Bad Request'))
        setShowSuccessModal(true)
      }
    } catch (err) {
      setSuccessMessage('Error saving color palette')
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">Color Palette Management</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Palette Name</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                value={colorPalette.name}
                onChange={(e) => setColorPalette({...colorPalette, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color (Blue)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    className="w-12 h-10 border border-gray-300 rounded"
                    value={colorPalette.primary_color.length === 7 ? colorPalette.primary_color : '#000000'}
                    onChange={(e) => setColorPalette({...colorPalette, primary_color: e.target.value})}
                  />
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    value={colorPalette.primary_color}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                        setColorPalette({...colorPalette, primary_color: value})
                      }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Secondary Color (Dark Blue)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    className="w-12 h-10 border border-gray-300 rounded"
                    value={colorPalette.secondary_color.length === 7 ? colorPalette.secondary_color : '#000000'}
                    onChange={(e) => setColorPalette({...colorPalette, secondary_color: e.target.value})}
                  />
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    value={colorPalette.secondary_color}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                        setColorPalette({...colorPalette, secondary_color: value})
                      }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Accent Color (Orange)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    className="w-12 h-10 border border-gray-300 rounded"
                    value={colorPalette.accent_color.length === 7 ? colorPalette.accent_color : '#000000'}
                    onChange={(e) => setColorPalette({...colorPalette, accent_color: e.target.value})}
                  />
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    value={colorPalette.accent_color}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                        setColorPalette({...colorPalette, accent_color: value})
                      }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Light Color (Light Blue)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    className="w-12 h-10 border border-gray-300 rounded"
                    value={colorPalette.light_color.length === 7 ? colorPalette.light_color : '#000000'}
                    onChange={(e) => setColorPalette({...colorPalette, light_color: e.target.value})}
                  />
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    value={colorPalette.light_color}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                        setColorPalette({...colorPalette, light_color: value})
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={saveColorPalette}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Save Color Palette
          </button>
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