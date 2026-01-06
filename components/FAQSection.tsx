'use client'

import { useState, useEffect } from 'react'
import { useColors } from '../contexts/ColorContext'
import { API_ENDPOINTS } from '../lib/api'

interface FAQItem {
  id: number
  question: string
  answer: string
  order: number
  is_active: boolean
}

export default function FAQSection() {
  const colors = useColors()
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [faqData, setFaqData] = useState<FAQItem[]>([])

  useEffect(() => {
    fetchFAQs()
    
    // Initialize AOS
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      })
    })
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.FAQS)
      if (response.ok) {
        const data = await response.json()
        setFaqData(data)
      } else {
        setDefaultFAQs()
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      setDefaultFAQs()
    }
  }

  const setDefaultFAQs = () => {
    setFaqData([
      {
        id: 1,
        question: "What services does Inno8 offer?",
        answer: "We offer comprehensive software development services including web development, mobile app development, UI/UX design, cloud solutions, and digital transformation consulting.",
        order: 1,
        is_active: true
      },
      {
        id: 2,
        question: "How long does a typical project take?",
        answer: "Project timelines vary based on complexity and scope. Simple websites take 2-4 weeks, while complex applications can take 3-6 months. We provide detailed timelines during our initial consultation.",
        order: 2,
        is_active: true
      },
      {
        id: 3,
        question: "Do you provide ongoing support and maintenance?",
        answer: "Yes, we offer comprehensive support and maintenance packages to ensure your software remains secure, updated, and performs optimally after launch.",
        order: 3,
        is_active: true
      },
      {
        id: 4,
        question: "What technologies do you work with?",
        answer: "We work with modern technologies including React, Next.js, Node.js, Python, Django, React Native, Flutter, AWS, and many more based on project requirements.",
        order: 4,
        is_active: true
      }
    ])
  }

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[#FCB316] mr-4"></div>
            <span className="text-gray-500 uppercase tracking-wider text-sm">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.primary_color }} data-aos="fade-up" data-aos-delay="200">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="400">
            Find answers to common questions about our services, processes, and how we can help your business grow.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div key={faq.id} className="mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
              <div 
                className="bg-[#FAFAFA] rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-sm"
                onClick={() => toggleFAQ(faq.id)}
              >
                <div className={`p-6 flex justify-between items-center transition-all duration-300 ${openFAQ === faq.id ? 'text-white' : 'text-gray-900'}`} style={{ backgroundColor: openFAQ === faq.id ? colors.primary_color : '#FAFAFA' }}>
                  <h3 className="text-lg font-medium pr-4">
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${openFAQ === faq.id ? 'bg-white' : ''}`} style={{ backgroundColor: openFAQ === faq.id ? 'white' : colors.primary_color }}>
                    <svg className={`w-4 h-4 transition-all duration-300 ${openFAQ === faq.id ? 'text-gray-900' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {openFAQ === faq.id ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      )}
                    </svg>
                  </div>
                </div>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}