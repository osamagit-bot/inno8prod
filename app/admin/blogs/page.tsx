'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS, getImageUrl } from '../../../lib/api'

export default function BlogsAdmin() {
  const [sectionData, setSectionData] = useState({
    subtitle: 'Latest News',
    title: 'Our Blog',
    description: 'Stay updated with our latest insights, tips, and industry news.'
  })
  const [posts, setPosts] = useState([
    { id: 1, title: '', excerpt: '', content: '', author: 'Inno8 Team', category: 'DEVELOPMENT', slug: '', image: null, is_featured: false, is_active: true }
  ])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deletePost, setDeletePost] = useState<any>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    } else {
      fetchSectionData()
      fetchPosts()
    }
  }, [router])

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
    } catch (err) {
      console.log('Using default section data')
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_BLOG_POSTS, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched posts:', data) // Debug log
        if (data.length > 0) {
          // Add imageUrl for existing images
          const postsWithImageUrls = data.map((post: any) => {
            console.log('Post image field:', post.image) // Debug log
            return {
              ...post,
              imageUrl: post.image ? getImageUrl(post.image) : null
            }
          })
          console.log('Posts with image URLs:', postsWithImageUrls) // Debug log
          setPosts(postsWithImageUrls)
        }
      }
    } catch (err) {
      console.log('Using default posts')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!sectionData.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required'
    }
    if (!sectionData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!sectionData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    posts.forEach((post, index) => {
      if (!post.title.trim()) {
        newErrors[`title_${index}`] = 'Title is required'
      }
      if (!post.excerpt.trim()) {
        newErrors[`excerpt_${index}`] = 'Excerpt is required'
      }
      if (!post.content.trim()) {
        newErrors[`content_${index}`] = 'Content is required'
      }
      if (!post.slug.trim()) {
        newErrors[`slug_${index}`] = 'Slug is required'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return sectionData.subtitle.trim() && 
           sectionData.title.trim() && 
           sectionData.description.trim() &&
           posts.every(p => 
             p.title.trim() && 
             p.excerpt.trim() &&
             p.content.trim() &&
             p.slug.trim()
           )
  }

  const saveSectionData = async () => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_BLOGS_SECTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sectionData)
      })
      if (response.ok) {
        setSuccessMessage('Section data updated successfully!')
        setShowSuccessModal(true)
        setErrors({})
      }
    } catch (err) {
      setSuccessMessage('Error updating section data')
      setShowSuccessModal(true)
    }
  }

  const savePost = async (index: number) => {
    if (!validateForm()) return
    const token = localStorage.getItem('access_token')
    const post = posts[index]
    
    try {
      const formData = new FormData()
      formData.append('title', post.title)
      formData.append('excerpt', post.excerpt)
      formData.append('content', post.content)
      formData.append('author', post.author || 'Inno8 Team')
      formData.append('slug', post.slug)
      formData.append('category', post.category || 'DEVELOPMENT')
      formData.append('is_featured', (post.is_featured || false).toString())
      formData.append('is_active', (post.is_active !== false).toString())
      
      if (post.image && (post.image as any) instanceof File) {
        formData.append('image', post.image as unknown as File)
      }
      
      let response
      if (post.id && post.id < Date.now() - 1000000) {
        // Update existing post (ID from backend is smaller)
        response = await fetch(`${API_ENDPOINTS.ADMIN_BLOG_POSTS}${post.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
      } else {
        // Create new post (ID is timestamp or doesn't exist)
        response = await fetch(API_ENDPOINTS.ADMIN_BLOG_POSTS, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
      }
      
      if (response.ok) {
        setSuccessMessage(`Post "${post.title}" saved successfully!`)
        setShowSuccessModal(true)
        setErrors({})
        await fetchPosts()
      } else {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
    } catch (err) {
      setSuccessMessage(`Error saving post "${post.title}": ${err instanceof Error ? err.message : 'Unknown error'}`)
      setShowSuccessModal(true)
    }
  }

  const addPost = () => {
    const newPost = {
      id: Date.now(),
      title: '',
      excerpt: '',
      content: '',
      author: 'Inno8 Team',
      category: 'DEVELOPMENT',
      slug: '',
      image: null,
      is_featured: false,
      is_active: true
    }
    setPosts([...posts, newPost])
  }

  const confirmDelete = (index: number, post: any) => {
    setDeleteIndex(index)
    setDeletePost(post)
    setShowDeleteModal(true)
  }

  const handleDeletePost = async () => {
    const token = localStorage.getItem('access_token')
    if (deletePost && deletePost.id && deletePost.id < 1000) {
      try {
        await fetch(`${API_ENDPOINTS.ADMIN_BLOG_POSTS}${deletePost.id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      } catch (err) {
        console.error('Delete error:', err)
      }
    }
    setPosts(posts.filter((_, i) => i !== deleteIndex))
    setShowDeleteModal(false)
    setDeleteIndex(null)
    setDeletePost(null)
  }

  const updatePost = (index: number, field: string, value: any) => {
    const updated = [...posts]
    ;(updated[index] as any)[field] = value
    setPosts(updated)
    setTimeout(() => validateForm(), 0)
  }

  const handleImageUpload = (index: number, file: File) => {
    const updated = [...posts]
    ;(updated[index] as any).image = file
    // Create preview URL for the uploaded file
    if (file) {
      ;(updated[index] as any).imagePreview = URL.createObjectURL(file)
    }
    setPosts(updated)
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
          <h2 className="text-lg font-medium text-gray-900 mb-6">Blogs Management</h2>
          
          {/* Section Header */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-md font-medium text-gray-800 mb-4">Section Header</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.subtitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={sectionData.subtitle}
                  onChange={(e) => {
                    setSectionData({...sectionData, subtitle: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
                />
                {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={sectionData.title}
                  onChange={(e) => {
                    setSectionData({...sectionData, title: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={sectionData.description}
                  onChange={(e) => {
                    setSectionData({...sectionData, description: e.target.value})
                    setTimeout(() => validateForm(), 0)
                  }}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
            <button
              onClick={saveSectionData}
              disabled={!isFormValid()}
              className={`mt-4 px-4 py-2 rounded-md ${
                isFormValid() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Section Header
            </button>
          </div>

          {/* Blog Posts */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-800">Blog Posts</h3>
              <button
                onClick={addPost}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Post
              </button>
            </div>
            
            {posts.map((post, index) => (
              <div key={post.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`title_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={post.title}
                      onChange={(e) => updatePost(index, 'title', e.target.value)}
                    />
                    {errors[`title_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`title_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={post.author}
                      onChange={(e) => updatePost(index, 'author', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      value={post.category || 'DEVELOPMENT'}
                      onChange={(e) => updatePost(index, 'category', e.target.value)}
                    >
                      <option value="DEVELOPMENT">DEVELOPMENT</option>
                      <option value="DESIGN">DESIGN</option>
                      <option value="MARKETING">MARKETING</option>
                      <option value="BUSINESS">BUSINESS</option>
                      <option value="TECHNOLOGY">TECHNOLOGY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                      type="text"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        errors[`slug_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={post.slug}
                      onChange={(e) => updatePost(index, 'slug', e.target.value)}
                    />
                    {errors[`slug_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`slug_${index}`]}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                  <textarea
                    rows={2}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                      errors[`excerpt_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={post.excerpt}
                    onChange={(e) => updatePost(index, 'excerpt', e.target.value)}
                  />
                  {errors[`excerpt_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`excerpt_${index}`]}</p>}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    rows={4}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                      errors[`content_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={post.content}
                    onChange={(e) => updatePost(index, 'content', e.target.value)}
                  />
                  {errors[`content_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`content_${index}`]}</p>}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Blog Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(index, file)
                      }
                    }}
                  />
                  {post.image && (post.image as any) instanceof File && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Selected: {(post.image as any).name}</p>
                      {(post as any).imagePreview && (
                        <div className="w-32 h-20 border rounded overflow-hidden">
                          <img 
                            src={(post as any).imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {(post as any).imageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Current image:</p>
                      <div className="w-32 h-20 border rounded overflow-hidden bg-gray-100">
                        <img 
                          src={(post as any).imageUrl} 
                          alt="Current" 
                          className="w-full h-full object-cover"
                          onLoad={() => console.log('Image loaded successfully:', (post as any).imageUrl)}
                          onError={(e) => {
                            console.log('Image load error:', (post as any).imageUrl)
                            console.log('Error event:', e)
                            ;(e.target as any).style.display = 'none'
                            ;(e.target as any).nextSibling.style.display = 'block'
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                          Image not found
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">URL: {(post as any).imageUrl}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Upload an image for the blog post (optional).</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={post.is_featured}
                        onChange={(e) => updatePost(index, 'is_featured', e.target.checked)}
                        className="mr-2"
                      />
                      Featured Post
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={post.is_active}
                        onChange={(e) => updatePost(index, 'is_active', e.target.checked)}
                        className="mr-2"
                      />
                      Active
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => savePost(index)}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      {post.id && post.id < Date.now() - 1000000 ? 'Update' : 'Save'}
                    </button>
                    <button
                      onClick={() => confirmDelete(index, post)}
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
            <p className="text-gray-600 text-sm">
              Save each post individually using the Save/Update buttons above.
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Post</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this blog post? This action cannot be undone.</p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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