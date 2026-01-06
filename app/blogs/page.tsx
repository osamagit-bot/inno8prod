'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Footer from '../../components/Footer'
import { useColors } from '../../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../../lib/api'
import { fallbackData } from '../../lib/fallbackData'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  author: string
  category: string
  date_published: string
  slug: string
  is_featured: boolean
}

export default function BlogsPage() {
  const colors = useColors()
  const [posts, setPosts] = useState<BlogPost[]>(fallbackData.blogPosts)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.BLOG_POSTS)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.log('Backend offline - using fallback blog posts')
      setPosts(fallbackData.blogPosts)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: colors.primary_color }}></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fallbackData.subpageHeros.blogs})` }}
        ></div>
        
        <div 
          className="absolute inset-0" 
          style={{
            background: `linear-gradient(90deg, ${colors.primary_color} 0%, ${colors.primary_color}E6 40%, ${colors.primary_color}30 100%)`
          }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-4 text-left">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              OUR BLOGS
            </h1>
            
            <nav className="flex items-center space-x-2 text-white">
              <a href="/" className="hover:text-opacity-80 transition-colors">HOME</a>
              <span className="text-white/60">-</span>
              <span className="text-white/80">BLOGS</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 group hover:border-gray-300">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: colors.primary_color }}>
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <span className="text-gray-400 uppercase text-xs font-medium">{post.author}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 leading-tight tracking-wide" style={{ color: colors.primary_color }}>
                    {post.title}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="inline-block text-black px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide" style={{ backgroundColor: colors.accent_color }}>
                      {post.category || 'DEVELOPMENT'}
                    </span>
                  </div>
                </div>
                
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {post.image ? (
                    <Image 
                      src={getImageUrl(post.image)} 
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {post.image && (
                      <button
                        onClick={() => {
                          setSelectedImage(getImageUrl(post.image))
                          setTimeout(() => setIsModalOpen(true), 10)
                        }}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 z-10 cursor-pointer"
                        style={{ color: colors.primary_color }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <a href={`/blogs/${post.id}`} className="text-gray-600 font-medium hover:text-gray-800 transition-colors flex items-center text-sm uppercase tracking-wide group">
                      READ MORE 
                      <svg className="w-4 h-4 ml-2 group-hover:ml-3 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                    <span className="font-medium text-sm" style={{ color: colors.accent_color }}>
                      {new Date(post.date_published).toLocaleDateString('en-US', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      }).replace(',', '').toUpperCase()}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 cursor-pointer transition-all duration-500 ease-out ${
            isModalOpen ? 'opacity-100' : 'opacity-0'
          }`} 
          onClick={() => {
            setIsModalOpen(false)
            setTimeout(() => setSelectedImage(null), 500)
          }}
        >
          <div 
            className={`relative max-w-4xl max-h-full transition-all duration-500 ease-out ${
              isModalOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Blog Image"
              className="max-w-full max-h-full object-contain rounded-lg cursor-default"
            />
            <button
              onClick={() => {
                setIsModalOpen(false)
                setTimeout(() => setSelectedImage(null), 500)
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}