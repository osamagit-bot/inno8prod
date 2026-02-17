'use client'

import { useEffect } from 'react'

export default function StructuredData() {
  useEffect(() => {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Inno8 Software House",
      "alternateName": "Inno8",
      "url": "https://inno8solutions.com",
      "logo": "https://inno8solutions.com/images/inoo8%20With%20Bg.jpg",
      "description": "Leading software house delivering innovative digital solutions including web development, mobile app development, UI/UX design, and cloud solutions.",
      "foundingDate": "2019",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PK"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "url": "https://inno8solutions.com/contact"
      },
      "sameAs": [
        "https://www.linkedin.com/company/inno8-software-house",
        "https://www.facebook.com/inno8solutions"
      ],
      "services": [
        "Web Development",
        "Mobile App Development",
        "UI/UX Design",
        "Custom Software Development",
        "Cloud Solutions",
        "Digital Marketing"
      ]
    }

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Inno8 Software House",
      "url": "https://inno8solutions.com",
      "description": "Leading software house delivering innovative digital solutions including web development, mobile app development, UI/UX design, and cloud solutions.",
      "publisher": {
        "@type": "Organization",
        "name": "Inno8 Software House"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://inno8solutions.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }

    // Add structured data to head
    const script1 = document.createElement('script')
    script1.type = 'application/ld+json'
    script1.text = JSON.stringify(organizationSchema)
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.type = 'application/ld+json'
    script2.text = JSON.stringify(websiteSchema)
    document.head.appendChild(script2)

    return () => {
      document.head.removeChild(script1)
      document.head.removeChild(script2)
    }
  }, [])

  return null
}