export default function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.cookies.access_token
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    res.status(200).json({ authenticated: true })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}