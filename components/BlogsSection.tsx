'use client'

import { useEffect, useState } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS, getImageUrl } from '../lib/api'
import styles from './BlogsSection.module.css'

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

interface SectionData {
  subtitle: string
  title: string
  description: string
}

export default function BlogsSection() {
  const colors = useColors()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [sectionData, setSectionData] = useState<SectionData>({
    subtitle: 'Latest News',
    title: 'Our Blog',
    description: 'Stay updated with our latest insights, tips, and industry news.'
  })

  useEffect(() => {
    fetchBlogPosts()
    fetchSectionData()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.BLOG_POSTS)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.slice(0, 3)) // Limit to 3 posts
      } else {
        setDefaultPosts()
      }
    } catch (error) {
      setDefaultPosts()
    }
  }

  const fetchSectionData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.BLOGS_SECTION)
      if (response.ok) {
        const data = await response.json()
        setSectionData({
          subtitle: data.subtitle || sectionData.subtitle,
          title: data.title || sectionData.title,
          description: data.description || sectionData.description
        })
      }
    } catch (error) {
      console.log('Using default section data')
    }
  }

  const setDefaultPosts = () => {
    setPosts([
      {
        id: 1,
        title: 'The Future of Web Development',
        excerpt: 'Exploring the latest trends and technologies shaping the future of web development.',
        image: '',
        author: 'Inno8 Team',
        category: 'DEVELOPMENT',
        date_published: '2024-01-15T10:00:00Z',
        slug: 'future-of-web-development',
        is_featured: true
      },
      {
        id: 2,
        title: 'Best Practices for Mobile App Design',
        excerpt: 'Learn the essential principles for creating user-friendly mobile applications.',
        image: '',
        author: 'Inno8 Team',
        category: 'DESIGN',
        date_published: '2024-01-10T10:00:00Z',
        slug: 'mobile-app-design-practices',
        is_featured: false
      },
      {
        id: 3,
        title: 'Digital Transformation Guide',
        excerpt: 'A comprehensive guide to successfully implementing digital transformation.',
        image: '',
        author: 'Inno8 Team',
        category: 'BUSINESS',
        date_published: '2024-01-05T10:00:00Z',
        slug: 'digital-transformation-guide',
        is_featured: false
      }
    ])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
            <span className="text-gray-500 uppercase tracking-wider text-sm">
              {sectionData.subtitle}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#012340]">
            {sectionData.title.split(' ').map((word, index) => 
              word === 'Blog' ? (
                <span key={`title-${word}-${index}`} className="text-[#FCB316]">{word}</span>
              ) : (
                <span key={`title-${word}-${index}`}>{word} </span>
              )
            )}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {sectionData.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className={`${styles.blogCard} bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 group hover:border-gray-300`} style={{ '--primary-color': colors.primary_color } as any}>
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
                
                <h3 className="text-xl font-semibold mb-4 text-gray-800 leading-tight">
                  {post.title}
                </h3>
                
                <div className="mb-4">
                  <span className={`${styles.categoryTag} inline-block text-black px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide transition-all duration-300`} style={{ backgroundColor: colors.accent_color }}>
                    {post.category || 'DEVELOPMENT'}
                  </span>
                </div>
              </div>
              
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                {post.image ? (
                  <img 
                    src={getImageUrl(post.image)} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <a href={`/blogs/${post.id}`} className="text-gray-600 font-medium hover:text-gray-800 transition-colors flex items-center text-sm uppercase tracking-wide group">
                    DISCOVER MORE 
                    <svg className="w-4 h-4 ml-2 group-hover:ml-3 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <span className="font-bold text-sm" style={{ color: colors.accent_color }}>
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

        <div className="text-center mt-12">
          <a 
            href="/blogs"
            className="relative px-8 py-3 rounded-sm font-semibold transition-all duration-300 overflow-hidden group inline-block"
            style={{ 
              backgroundColor: colors.accent_color,
              color: colors.secondary_color
            }}
          >
            <span className="relative z-10 group-hover:text-white transition-colors">View All Posts</span>
            <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
          </a>
        </div>
      </div>
    </section>
  )
}