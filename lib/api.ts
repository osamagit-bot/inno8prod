export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010'
}

export const API_ENDPOINTS = {
  SITE_SETTINGS: `${API_CONFIG.BASE_URL}/api/site-settings/`,
  MENU_ITEMS: `${API_CONFIG.BASE_URL}/api/menu-items/`,
  HERO_SECTIONS: `${API_CONFIG.BASE_URL}/api/hero-sections/`,
  ABOUT_SECTION: `${API_CONFIG.BASE_URL}/api/about-section/`,
  SERVICES_SECTION: `${API_CONFIG.BASE_URL}/api/services-section/`,
  SERVICES: `${API_CONFIG.BASE_URL}/api/services/`,
  PROJECTS: `${API_CONFIG.BASE_URL}/api/projects/`,
  WHY_CHOOSE_US: `${API_CONFIG.BASE_URL}/api/why-choose-us/`,
  WHY_CHOOSE_US_SECTION: `${API_CONFIG.BASE_URL}/api/why-choose-us-section/`,
  WORKING_PROCESS: `${API_CONFIG.BASE_URL}/api/working-process/`,
  WORKING_PROCESS_SECTION: `${API_CONFIG.BASE_URL}/api/working-process-section/`,
  CLIENT_LOGOS: `${API_CONFIG.BASE_URL}/api/client-logos/`,
  TESTIMONIALS: `${API_CONFIG.BASE_URL}/api/testimonials/`,
  TESTIMONIALS_SECTION: `${API_CONFIG.BASE_URL}/api/testimonials-section/`,
  CONTACT_INFO: `${API_CONFIG.BASE_URL}/api/contact-info/`,
  CONTACT_SECTION: `${API_CONFIG.BASE_URL}/api/contact-section/`,
  BLOG_POSTS: `${API_CONFIG.BASE_URL}/api/blog-posts/`,
  BLOGS_SECTION: `${API_CONFIG.BASE_URL}/api/blogs-section/`,
  TEAM_MEMBERS: `${API_CONFIG.BASE_URL}/api/team-members/`,
  TEAM_SECTION: `${API_CONFIG.BASE_URL}/api/team-section/`,
  COLOR_PALETTE: `${API_CONFIG.BASE_URL}/api/color-palette/`,
  LOGIN: `${API_CONFIG.BASE_URL}/api/login/`,
  // Admin endpoints
  ADMIN_SITE_SETTINGS: `${API_CONFIG.BASE_URL}/api/admin/site-settings/`,
  ADMIN_MENU_ITEMS: `${API_CONFIG.BASE_URL}/api/admin/menu-items/`,
  ADMIN_HERO_SECTIONS: `${API_CONFIG.BASE_URL}/api/admin/hero-sections/`,
  ADMIN_HERO_SECTIONS_DELETE_ALL: `${API_CONFIG.BASE_URL}/api/admin/hero-sections/delete-all/`,
  ADMIN_ABOUT_SECTION: `${API_CONFIG.BASE_URL}/api/admin/about-section/`,
  ADMIN_SERVICES_SECTION: `${API_CONFIG.BASE_URL}/api/admin/services-section/`,
  ADMIN_SERVICES: `${API_CONFIG.BASE_URL}/api/admin/services/`,
  ADMIN_PROJECTS: `${API_CONFIG.BASE_URL}/api/admin/projects/`,
  ADMIN_WHY_CHOOSE_US: `${API_CONFIG.BASE_URL}/api/admin/why-choose-us-features/`,
  ADMIN_WORKING_PROCESS: `${API_CONFIG.BASE_URL}/api/admin/working-process/`,
  ADMIN_CLIENT_LOGOS: `${API_CONFIG.BASE_URL}/api/admin/client-logos/`,
  ADMIN_TESTIMONIALS: `${API_CONFIG.BASE_URL}/api/admin/testimonials/`,
  ADMIN_TESTIMONIALS_SECTION: `${API_CONFIG.BASE_URL}/api/admin/testimonials-section/`,
  ADMIN_CONTACT_INFO: `${API_CONFIG.BASE_URL}/api/admin/contact-info/`,
  ADMIN_CONTACT_SECTION: `${API_CONFIG.BASE_URL}/api/admin/contact-section/`,
  ADMIN_BLOG_POSTS: `${API_CONFIG.BASE_URL}/api/admin/blog-posts/`,
  ADMIN_BLOGS_SECTION: `${API_CONFIG.BASE_URL}/api/admin/blogs-section/`,
  ADMIN_TEAM_MEMBERS: `${API_CONFIG.BASE_URL}/api/admin/team-members/`,
  ADMIN_TEAM_SECTIONS: `${API_CONFIG.BASE_URL}/api/admin/team-sections/`,
  ADMIN_COLOR_PALETTES: `${API_CONFIG.BASE_URL}/api/admin/color-palettes/`,
  ADMIN_COLOR_PALETTES_DEACTIVATE: `${API_CONFIG.BASE_URL}/api/admin/color-palettes/deactivate-all/`,
  CONTACT_SUBMIT: `${API_CONFIG.BASE_URL}/api/contact-submit/`,
  CONTACT_SUBMISSIONS: `${API_CONFIG.BASE_URL}/api/contact-submissions/`,
  ADMIN_CONTACT_SUBMISSIONS: `${API_CONFIG.BASE_URL}/api/admin/contact-submissions/`,
  FAQS: `${API_CONFIG.BASE_URL}/api/faqs/`,
  ADMIN_FAQS: `${API_CONFIG.BASE_URL}/api/admin/faqs/`
}

export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  
  // Check if we're in development (localhost)
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  
  if (isLocalhost) {
    return `${API_CONFIG.BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`
  }
  
  // For production deployment - decode URL encoding
  let decodedPath = decodeURIComponent(imagePath)
  if (decodedPath.startsWith('/media/') || decodedPath.startsWith('media/')) {
    return decodedPath.replace(/^\/?(media\/)/, '/images/')
  }
  return decodedPath.startsWith('/') ? decodedPath : '/' + decodedPath
}

// Team API functions
export const fetchTeamMembers = async () => {
  const response = await fetch(API_ENDPOINTS.TEAM_MEMBERS)
  if (!response.ok) throw new Error('Failed to fetch team members')
  return response.json()
}

export const fetchTeamSection = async () => {
  const response = await fetch(API_ENDPOINTS.TEAM_SECTION)
  if (!response.ok) throw new Error('Failed to fetch team section')
  return response.json()
}