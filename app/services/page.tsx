import ServicesPageClient from './ServicesPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services - Inno8 Software House | Web Development, Mobile Apps & More',
  description: 'Explore Inno8 Software House services including web development, mobile app development, UI/UX design, custom software development, and digital solutions.',
  keywords: ['software development services', 'web development', 'mobile app development', 'UI/UX design', 'custom software', 'digital solutions', 'inno8 services'],
  openGraph: {
    title: 'Our Services - Inno8 Software House | Web Development, Mobile Apps & More',
    description: 'Explore Inno8 Software House services including web development, mobile app development, UI/UX design, and custom software development.',
    images: ['/images/inoo8%20With%20Bg.jpg'],
  },
}

export default function ServicesPage() {
  return <ServicesPageClient />
}