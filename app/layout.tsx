import './globals.css'
import { Nunito } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import type { Metadata } from 'next'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Inno8 Software House - Custom Software Development & Digital Solutions',
    template: '%s | Inno8 Software House'
  },
  description: 'Inno8 is a leading software house delivering innovative digital solutions including web development, mobile app development, UI/UX design, and cloud solutions. Transform your business with our expert team.',
  keywords: ['software development', 'web development', 'mobile app development', 'UI/UX design', 'digital solutions', 'software house', 'custom software', 'technology solutions'],
  authors: [{ name: 'Inno8 Software House' }],
  creator: 'Inno8 Software House',
  publisher: 'Inno8 Software House',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://inno8solutions.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Inno8 Software House - Custom Software Development & Digital Solutions',
    description: 'Leading software house delivering innovative digital solutions including web development, mobile apps, UI/UX design, and cloud solutions.',
    url: 'https://inno8solutions.com',
    siteName: 'Inno8 Software House',
    images: [
      {
        url: '/images/inoo8%20With%20Bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Inno8 Software House Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inno8 Software House - Custom Software Development',
    description: 'Leading software house delivering innovative digital solutions including web development, mobile apps, and UI/UX design.',
    images: ['/images/inoo8%20With%20Bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/inoo8%20With%20Bg.jpg" />
        <meta name="google-site-verification" content="" />
      </head>
      <body className="cursor-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}