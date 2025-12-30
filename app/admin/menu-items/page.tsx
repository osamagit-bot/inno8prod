'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS } from '../../../lib/api'

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Home', url: '/', order: 1, parent: null },
    { id: 2, name: 'About', url: '/about', order: 2, parent: null },
    { id: 3, name: 'Services', url: '/services', order: 3, parent: null },
    { id: 4, name: 'Web Development', url: '/web-development', order: 1, parent: 3 },
    { id: 5, name: 'Graphic Design', url: '/graphic-design', order: 2, parent: 3 },
    { id: 6, name: 'Projects', url: '/projects', order: 4, parent: null },
    { id: 7, name: 'Contact Us', url: '/contact', order: 5, parent: null }
  ])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const menuContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchMenuItems()
    }
  }, [router])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MENU_ITEMS)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setMenuItems(data)
        }
      }
    } catch (err) {
      console.log('Using default menu items')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    menuItems.forEach((item) => {
      if (!item.name.trim()) newErrors[`name_${item.id}`] = 'Menu name is required'
      if (!item.url.trim()) newErrors[`url_${item.id}`] = 'URL is required'
      else if (!item.url.startsWith('/')) newErrors[`url_${item.id}`] = 'URL must start with /'
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return menuItems.every(item => 
      item.name.trim() && 
      item.url.trim() && 
      item.url.startsWith('/')
    )
  }

  const saveMenuItems = async () => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    try {
      const menuData = menuItems.map(item => ({
        id: item.id,
        name: item.name,
        url: item.url,
        order: item.order,
        parent: item.parent,
        is_active: true
      }))
      
      const response = await fetch(API_ENDPOINTS.ADMIN_MENU_ITEMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(menuData)
      })
      
      if (response.ok) {
        setSuccessMessage('Menu items updated successfully!')
        setShowSuccessModal(true)
        setErrors({})
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        setSuccessMessage('Error updating menu items')
        setShowSuccessModal(true)
      }
    } catch (err) {
      console.error('Save error:', err)
      setSuccessMessage('Error updating menu items')
      setShowSuccessModal(true)
    }
  }

  const addMainMenuItem = () => {
    const newItem = {
      id: Date.now(),
      name: 'New Menu Item',
      url: '/new-item',
      order: menuItems.filter(i => !i.parent).length + 1,
      parent: null
    }
    setMenuItems([...menuItems, newItem])
    
    // Scroll to the new item after a short delay
    setTimeout(() => {
      if (menuContainerRef.current) {
        const newItemElement = menuContainerRef.current.lastElementChild
        if (newItemElement) {
          newItemElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, 100)
  }

  const addSubmenuItem = (parentId: number) => {
    const newChild = {
      id: Date.now(),
      name: 'New Submenu',
      url: '/new-submenu',
      order: menuItems.filter(i => i.parent === parentId).length + 1,
      parent: parentId
    }
    setMenuItems([...menuItems, newChild])
    
    // Scroll to the new submenu item after a short delay
    setTimeout(() => {
      if (menuContainerRef.current) {
        const allItems = menuContainerRef.current.children
        const newItemElement = Array.from(allItems).find(el => 
          el.querySelector('input')?.value === 'New Submenu'
        )
        if (newItemElement) {
          newItemElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, 100)
  }

  const deleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(i => i.id !== id))
  }

  const updateMenuItem = (id: number, field: string, value: any) => {
    const updated = [...menuItems]
    const itemIndex = updated.findIndex(i => i.id === id)
    if (itemIndex !== -1) {
      ;(updated[itemIndex] as any)[field] = value
      setMenuItems(updated)
      setTimeout(() => validateForm(), 0)
    }
  }

  const moveItem = (id: number, direction: string) => {
    const updated = [...menuItems]
    const currentIndex = updated.findIndex(i => i.id === id)
    if (currentIndex === -1) return

    const item = updated[currentIndex]
    const siblings = updated.filter(i => i.parent === item.parent)
    const siblingIndex = siblings.findIndex(i => i.id === id)
    
    if (direction === 'up' && siblingIndex > 0) {
      const temp = siblings[siblingIndex].order
      siblings[siblingIndex].order = siblings[siblingIndex - 1].order
      siblings[siblingIndex - 1].order = temp
    } else if (direction === 'down' && siblingIndex < siblings.length - 1) {
      const temp = siblings[siblingIndex].order
      siblings[siblingIndex].order = siblings[siblingIndex + 1].order
      siblings[siblingIndex + 1].order = temp
    }
    
    setMenuItems(updated)
  }

  const getSortedItems = () => {
    const sortedItems: any[] = []
    const parents = menuItems.filter(item => !item.parent).sort((a, b) => a.order - b.order)
    
    parents.forEach(parent => {
      sortedItems.push(parent)
      const children = menuItems.filter(item => item.parent === parent.id).sort((a, b) => a.order - b.order)
      sortedItems.push(...children)
    })
    
    return sortedItems
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Menu Items Management</h2>
            <button
              onClick={addMainMenuItem}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add Main Menu Item
            </button>
          </div>
          
          <div className="space-y-3" ref={menuContainerRef}>
            {getSortedItems().map((item) => (
              <div key={item.id} className={`p-4 border rounded-lg ${
                item.parent ? 'bg-blue-50 ml-8 border-blue-200' : 'bg-gray-50 border-gray-300'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveItem(item.id, 'up')}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                      ↑
                    </button>
                    <span className="text-xs text-center font-medium">{item.order}</span>
                    <button
                      onClick={() => moveItem(item.id, 'down')}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                      ↓
                    </button>
                  </div>

                  <div className="w-20">
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.parent ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.parent ? 'Submenu' : 'Main'}
                    </span>
                  </div>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Menu Name"
                      className={`w-full border rounded px-3 py-2 ${
                        errors[`name_${item.id}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={item.name}
                      onChange={(e) => updateMenuItem(item.id, 'name', e.target.value)}
                    />
                    {errors[`name_${item.id}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`name_${item.id}`]}</p>
                    )}
                  </div>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="URL (e.g., /about)"
                      className={`w-full border rounded px-3 py-2 ${
                        errors[`url_${item.id}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={item.url}
                      onChange={(e) => updateMenuItem(item.id, 'url', e.target.value)}
                    />
                    {errors[`url_${item.id}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`url_${item.id}`]}</p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {!item.parent && (
                      <button
                        onClick={() => addSubmenuItem(item.id)}
                        className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                      >
                        + Sub
                      </button>
                    )}
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={saveMenuItems}
              disabled={!isFormValid()}
              className={`px-6 py-3 rounded-md ${
                isFormValid() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save All Changes
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