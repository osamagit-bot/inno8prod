export default function handler(req, res) {
  if (req.method === 'POST') {
    const { access, refresh } = req.body

    // Set httpOnly cookies
    res.setHeader('Set-Cookie', [
      `access_token=${access}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`,
      `refresh_token=${refresh}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    ])

    res.status(200).json({ success: true })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}