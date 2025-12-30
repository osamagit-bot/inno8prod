import { fallbackData } from './fallbackData'

// Utility function to fetch data with fallback
export const fetchWithFallback = async <T>(
  endpoint: string,
  fallbackKey: keyof typeof fallbackData,
  transform?: (data: any) => T
): Promise<T> => {
  try {
    const response = await fetch(endpoint)
    if (response.ok) {
      const data = await response.json()
      return transform ? transform(data) : data
    }
    throw new Error('API response not ok')
  } catch (error) {
    console.log(`Backend offline - using fallback data for ${fallbackKey}`)
    const fallback = fallbackData[fallbackKey] as T
    return fallback
  }
}

// Check if backend is online
export const checkBackendStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/health', { 
      method: 'HEAD',
      timeout: 5000 
    } as any)
    return response.ok
  } catch (error) {
    return false
  }
}

// Show offline indicator
export const showOfflineIndicator = () => {
  const indicator = document.createElement('div')
  indicator.id = 'offline-indicator'
  indicator.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f59e0b;
      color: white;
      text-align: center;
      padding: 8px;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    ">
      ⚠️ Backend is offline - Using cached content
    </div>
  `
  
  if (!document.getElementById('offline-indicator')) {
    document.body.appendChild(indicator)
  }
}

// Hide offline indicator
export const hideOfflineIndicator = () => {
  const indicator = document.getElementById('offline-indicator')
  if (indicator) {
    indicator.remove()
  }
}