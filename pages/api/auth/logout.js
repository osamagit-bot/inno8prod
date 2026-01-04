export default function handler(req, res) {
  if (req.method === 'POST') {
    // Clear cookies
    res.setHeader('Set-Cookie', [
      `access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
      `refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
    ])

    res.status(200).json({ success: true })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}