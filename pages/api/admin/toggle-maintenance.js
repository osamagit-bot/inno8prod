export default async function handler(req, res) {
  if (req.method === 'POST') {
    const token = req.cookies.access_token
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const response = await fetch('http://localhost:8010/api/admin/toggle-maintenance/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        res.status(200).json(data)
      } else {
        res.status(response.status).json({ error: 'Failed to toggle maintenance' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}