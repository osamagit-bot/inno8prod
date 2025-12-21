export const API_CONFIG = {
  BASE_URL: 'http://localhost:8010'
}

export const API_ENDPOINTS = {
  SITE_SETTINGS: `${API_CONFIG.BASE_URL}/api/site-settings/`,
  MENU_ITEMS: `${API_CONFIG.BASE_URL}/api/menu-items/`,
  HERO_SECTIONS: `${API_CONFIG.BASE_URL}/api/hero-sections/`,
  ABOUT_SECTION: `${API_CONFIG.BASE_URL}/api/about-section/`,
  SERVICES_SECTION: `${API_CONFIG.BASE_URL}/api/services-section/`,
  SERVICES: `${API_CONFIG.BASE_URL}/api/services/`,
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
  ADMIN_COLOR_PALETTES: `${API_CONFIG.BASE_URL}/api/admin/color-palettes/`,
  ADMIN_COLOR_PALETTES_DEACTIVATE: `${API_CONFIG.BASE_URL}/api/admin/color-palettes/deactivate-all/`
}

export const getImageUrl = (imagePath: string) => {
  return imagePath ? `${API_CONFIG.BASE_URL}${imagePath}` : ''
}