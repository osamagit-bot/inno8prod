import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ServicesSection from '../components/ServicesSection'
import WorkingProcess from '../components/WorkingProcess'
import ProjectsSection from '../components/ProjectsSection'
import WhyChooseUsSection from '../components/WhyChooseUsSection'
import ClientLogosSection from '../components/ClientLogosSection'
import TestimonialsSection from '../components/TestimonialsSection'

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
      <TestimonialsSection />
      {/* Add more sections here */}
    </main>
  )
}