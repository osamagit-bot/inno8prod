'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/login')
  }

  const menuItems = [
    { id: 'site-settings', name: 'Site Settings', href: '/admin/site-settings', icon: '⚙️' },
    { id: 'color-palette', name: 'Color Palette', href: '/admin/color-palette', icon: '🎨' },
    { id: 'hero-sections', name: 'Hero Sections', href: '/admin/hero-sections', icon: '🖼️' },
    { id: 'about-section', name: 'About Section', href: '/admin/about-section', icon: '📝' },
    { id: 'menu-items', name: 'Menu Items', href: '/admin/menu-items', icon: '📋' },
    { id: 'services', name: 'Services', href: '/admin/services', icon: '🛠️' },
    { id: 'working-process', name: 'Working Process', href: '/admin/working-process', icon: '⚡' },
    { id: 'projects', name: 'Projects', href: '/admin/projects', icon: '💼' },
    { id: 'testimonials', name: 'Testimonials', href: '/admin/testimonials', icon: '💬' },
    { id: 'team', name: 'Team', href: '/admin/team', icon: '👥' },
    { id: 'blogs', name: 'Blogs', href: '/admin/blogs', icon: '📝' },
    { id: 'contact-section', name: 'Contact Section', href: '/admin/contact-section', icon: '📞' },
    { id: 'contact-submissions', name: 'Contact Submissions', href: '/admin/contact-submissions', icon: '📧' },
    { id: 'faqs', name: 'FAQs', href: '/admin/faqs', icon: '❓' },
    { id: 'why-choose-us', name: 'Why Choose Us', href: '/admin/why-choose-us', icon: '⭐' },
    { id: 'client-logos', name: 'Client Logos', href: '/admin/client-logos', icon: '🏢' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50" style={{backgroundColor: '#0477BF', color: 'white', padding: '16px'}}>
        <a href="/" style={{color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold'}}>
          ← Back to Website
        </a>
      </div>
      
      <nav className="bg-white shadow-sm border-b mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold" style={{color: '#012340'}}>Inno8 Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Manage {item.name.toLowerCase()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}