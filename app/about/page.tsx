'use client'

import { useColors } from '../../contexts/ColorContext'

export default function AboutPage() {
  const colors = useColors()

  const teamMembers = [
    {
      name: "John Smith",
      position: "CEO & Founder",
      image: "/images/about1.avif",
      description: "Leading Inno8 with 10+ years of experience in software development and business strategy."
    },
    {
      name: "Sarah Johnson",
      position: "CTO",
      image: "/images/about2.webp",
      description: "Expert in full-stack development and system architecture with passion for innovation."
    },
    {
      name: "Mike Wilson",
      position: "Lead Developer",
      image: "/images/about1.avif",
      description: "Specialized in modern web technologies and mobile app development."
    },
    {
      name: "Emily Davis",
      position: "UI/UX Designer",
      image: "/images/about2.webp",
      description: "Creative designer focused on user experience and modern design principles."
    }
  ]

  const coreValues = [
    {
      icon: "🎯",
      title: "Innovation",
      description: "We constantly push boundaries to deliver cutting-edge solutions that drive your business forward."
    },
    {
      icon: "🤝",
      title: "Reliability",
      description: "Our commitment to quality and timely delivery ensures your projects are completed successfully."
    },
    {
      icon: "💡",
      title: "Excellence",
      description: "We strive for perfection in every project, delivering solutions that exceed expectations."
    },
    {
      icon: "🌟",
      title: "Customer Focus",
      description: "Your success is our priority. We work closely with you to understand and meet your unique needs."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4" style={{ backgroundColor: colors.primary_color }}>
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span style={{ color: colors.accent_color }}>Inno8</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            We are a passionate team of developers, designers, and innovators dedicated to transforming your ideas into powerful digital solutions.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary_color }}>
                Company Overview
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded with a vision to bridge the gap between innovative technology and business success, Inno8 has been at the forefront of digital transformation. We specialize in creating custom software solutions that help businesses thrive in the digital age.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our team combines technical expertise with creative thinking to deliver solutions that are not only functional but also user-friendly and scalable. From web development to mobile applications, we cover the full spectrum of digital services.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: colors.accent_color }}>50+</div>
                  <div className="text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: colors.accent_color }}>5+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/about1.avif"
                alt="About Inno8"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
              <span className="text-gray-500 uppercase tracking-wider text-sm">
                Mission & Vision
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#012340]">
              Our Purpose & Direction
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4" style={{ color: colors.accent_color }}>🎯</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary_color }}>Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To empower businesses with innovative technology solutions that drive growth, efficiency, and success. We are committed to delivering high-quality software that transforms ideas into reality and helps our clients achieve their goals.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4" style={{ color: colors.accent_color }}>🚀</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary_color }}>Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading software house that shapes the future of digital innovation. We envision a world where technology seamlessly integrates with business processes, creating opportunities for growth and transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.primary_color }}>
              Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the talented individuals who make Inno8 a success. Our diverse team brings together expertise from various fields to deliver exceptional results.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary_color }}>
                    {member.name}
                  </h3>
                  <p className="font-medium mb-3" style={{ color: colors.accent_color }}>
                    {member.position}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4" style={{ backgroundColor: colors.primary_color }}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Core Values
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Our values guide everything we do and shape the way we work with our clients and each other.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors duration-300">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {value.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: colors.primary_color }}>
            Ready to Work With Us?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and see how we can help bring your ideas to life with our expertise and dedication.
          </p>
          <button className="relative px-8 py-4 rounded-lg font-semibold text-white overflow-hidden group" style={{ backgroundColor: colors.accent_color }}>
            <span className="relative z-10 group-hover:text-white transition-colors">Get Started Today</span>
            <div className="absolute inset-0 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" style={{ backgroundColor: colors.primary_color }}></div>
          </button>
        </div>
      </section>
    </div>
  )
}