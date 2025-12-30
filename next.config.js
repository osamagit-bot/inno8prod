/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8010',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8010',
        pathname: '/images/**',
      },
    ],
  },
}

module.exports = nextConfig