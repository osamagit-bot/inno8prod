import AboutSection from '../components/AboutSection'
import BlogsSection from '../components/BlogsSection'
import ClientLogosSection from '../components/ClientLogosSection'
import CTASection from '../components/CTASection'
import FAQSection from '../components/FAQSection'
import ImageSection from '../components/ImageSection'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import ProjectsSection from '../components/ProjectsSection'
import ServicesSection from '../components/ServicesSection'
import TeamSection from '../components/TeamSection'
import TestimonialsSection from '../components/TestimonialsSection'
import WhyChooseUsSection from '../components/WhyChooseUsSection'
import WorkingProcess from '../components/WorkingProcess'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inno8 Software House - Custom Software Development & Digital Solutions',
  description: 'Leading software house delivering innovative digital solutions including web development, mobile app development, UI/UX design, cloud solutions, and custom software development. Transform your business with our expert team.',
  keywords: ['software development', 'web development', 'mobile app development', 'UI/UX design', 'digital solutions', 'software house', 'custom software', 'technology solutions', 'inno8'],
  openGraph: {
    title: 'Inno8 Software House - Custom Software Development & Digital Solutions',
    description: 'Leading software house delivering innovative digital solutions including web development, mobile apps, UI/UX design, and cloud solutions.',
    images: ['/images/inoo8%20With%20Bg.jpg'],
  },
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WorkingProcess />
      <ProjectsSection />
      <WhyChooseUsSection />
      <ClientLogosSection />
      <TeamSection />
      <TestimonialsSection />
      <BlogsSection />
       <FAQSection />
      <CTASection />
       <ImageSection />
      <Footer />
    </main>
  )
}