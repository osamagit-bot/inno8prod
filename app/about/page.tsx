import AboutPageClient from './AboutPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Inno8 Software House | Leading Software Development Company',
  description: 'Learn about Inno8 Software House - a leading software development company delivering innovative digital solutions. Meet our expert team of developers, designers, and innovators.',
  keywords: ['about inno8', 'software house team', 'software development company', 'digital solutions', 'web development team', 'mobile app developers'],
  openGraph: {
    title: 'About Us - Inno8 Software House | Leading Software Development Company',
    description: 'Learn about Inno8 Software House - a leading software development company delivering innovative digital solutions. Meet our expert team.',
    images: ['/images/inoo8%20With%20Bg.jpg'],
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}