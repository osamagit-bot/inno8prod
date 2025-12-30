'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Footer from '../../../components/Footer'
import { useColors } from '../../../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../../../lib/api'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  category: string
  date_published: string
  slug: string
  is_featured: boolean
}

export default function BlogDetailPage() {
  const colors = useColors()
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      fetchBlogPost()
    }
  }, [params?.id])

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.BLOG_POSTS)
      if (response.ok) {
        const data = await response.json()
        const foundPost = data.find((p: BlogPost) => p.id.toString() === params?.id)
        setPost(foundPost || null)
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
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

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.primary_color }}>Blog Post Not Found</h1>
          <a href="/blogs" className="text-blue-600 hover:underline">← Back to Blogs</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/abouthero.jpg"
            alt="Blog Hero"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              e.currentTarget.src = '/images/abouthero.jpg'
            }}
          />
        </div>
        
        <div 
          className="absolute inset-0" 
          style={{
            background: `linear-gradient(90deg, ${colors.primary_color} 0%, ${colors.primary_color}E6 40%, ${colors.primary_color}30 100%)`
          }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-4 text-left">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              BLOG DETAILS
            </h1>
            
            <nav className="flex items-center space-x-2 text-white">
              <a href="/" className="hover:text-opacity-80 transition-colors">HOME</a>
              <span className="text-white/60">-</span>
              <a href="/blogs" className="hover:text-opacity-80 transition-colors">BLOGS</a>
              <span className="text-white/60">-</span>
              <span className="text-white/80">{post.title.toUpperCase()}</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Blog Header */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="inline-block text-black px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide mr-4" style={{ backgroundColor: colors.accent_color }}>
                  {post.category}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(post.date_published).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4" style={{ color: colors.primary_color }}>
                {post.title}
              </h1>
              
              <div className="flex items-center text-gray-600">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: colors.primary_color }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <span>By {post.author}</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(post.image)}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <a
                href="/blogs"
                className="relative px-8 py-4 rounded-sm font-semibold border-2 transition-all duration-300 hover:shadow-lg overflow-hidden group inline-block"
                style={{ 
                  borderColor: colors.primary_color, 
                  color: colors.primary_color,
                  backgroundColor: 'transparent'
                }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors">← Back to Blogs</span>
                <div className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}