// Test API route to check if proxy is working
export default async function handler(req, res) {
  try {
    const response = await fetch('http://localhost:8010/api/menu-items/')
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Django', details: error.message })
  }
}