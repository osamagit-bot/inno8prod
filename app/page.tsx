import AboutSection from '../components/AboutSection'
import BlogsSection from '../components/BlogsSection'
import ClientLogosSection from '../components/ClientLogosSection'
import CTASection from '../components/CTASection'
import FAQSection from '../components/FAQSection'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import ProjectsSection from '../components/ProjectsSection'
import ServicesSection from '../components/ServicesSection'
import TeamSection from '../components/TeamSection'
import TestimonialsSection from '../components/TestimonialsSection'
import WhyChooseUsSection from '../components/WhyChooseUsSection'
import WorkingProcess from '../components/WorkingProcess'

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
      <Footer />
    </main>
  )
}