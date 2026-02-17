'use client'

import { useState, useEffect } from 'react'

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      })
    })
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010'
      const res = await fetch(`${apiUrl}/api/newsletter/subscribe/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message)
        setEmail('')
      } else {
        setError(data.error || 'Failed to subscribe')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#FAFAFA]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 md:w-12 h-0.5 bg-[#FCB316] mr-3 md:mr-4"></div>
              <span className="text-[#012340]/70 uppercase tracking-wider text-xs md:text-sm font-medium">
                Stay Connected
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#012340] mb-4 md:mb-6 px-4" data-aos="fade-up" data-aos-delay="200">
              Subscribe to Our <span className="text-[#0477BF]">Newsletter</span>
            </h2>
            <p className="text-base md:text-lg text-[#012340]/70 max-w-2xl mx-auto px-4" data-aos="fade-up" data-aos-delay="400">
              Get the latest updates on our projects, blogs, and tech insights delivered straight to your inbox.
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="600">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-2xl mx-auto px-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-3 md:left-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#0477BF]/50 group-focus-within:text-[#0477BF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 rounded-lg md:rounded-xl border-2 border-[#0477BF]/20 bg-white text-[#012340] text-sm md:text-base placeholder:text-[#012340]/40 focus:outline-none focus:border-[#0477BF] focus:ring-2 focus:ring-[#0477BF]/20 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="relative px-6 md:px-8 py-3 md:py-4 bg-[#FCB316] text-[#012340] font-semibold text-sm md:text-base rounded-sm shadow-sm overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <span className="relative z-10 group-hover:text-white transition-colors">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    'Subscribe Now'
                  )}
                </span>
                <div
                  className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out bg-[#0477BF]"
                ></div>
              </button>
            </form>

            {message && (
              <div className="mt-4 md:mt-6 mx-4 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg md:rounded-xl flex items-center gap-2 md:gap-3 max-w-2xl md:mx-auto" data-aos="fade-in">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-700 font-medium text-sm md:text-base">{message}</p>
              </div>
            )}
            {error && (
              <div className="mt-4 md:mt-6 mx-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg md:rounded-xl flex items-center gap-2 md:gap-3 max-w-2xl md:mx-auto" data-aos="fade-in">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-700 font-medium text-sm md:text-base">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
