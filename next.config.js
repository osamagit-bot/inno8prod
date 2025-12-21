/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8010',
        pathname: '/media/**',
      },
    ],
  },
  // Removed rewrites to prevent conflicts with API routes
}

module.exports = nextConfig