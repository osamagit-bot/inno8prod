'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Stat {
  date?: string
  month?: string
  year?: string
  count: number
  ip_data?: {ip_address: string, visit_count: number}[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily')
  const [stats, setStats] = useState<Stat[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [uniqueVisitors, setUniqueVisitors] = useState(0)
  const [topPages, setTopPages] = useState<{path: string, count: number}[]>([])
  const [deviceStats, setDeviceStats] = useState<{device_type: string, count: number}[]>([])
  const [browserStats, setBrowserStats] = useState<{browser: string, count: number}[]>([])
  const [countryStats, setCountryStats] = useState<{country: string, count: number}[]>([])
  const [referrerStats, setReferrerStats] = useState<{referrer: string, count: number}[]>([])
  const [trafficSourceStats, setTrafficSourceStats] = useState<{traffic_source: string, count: number}[]>([])
  const [socialMediaStats, setSocialMediaStats] = useState<{traffic_source: string, count: number}[]>([])
  const [showResetModal, setShowResetModal] = useState(false)

  const handleReset = async () => {
    setShowResetModal(false)
    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010'
      const res = await fetch(`${apiUrl}/api/analytics/reset/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchStats()
      }
    } catch (err) {
      console.error('Failed to reset')
    }
  }

  const exportCSV = () => {
    const csv = ['Period,Visits', ...stats.map(s => `${formatDate(s)},${s.count}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${period}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const avgPerDay = total > 0 && stats.length > 0 ? (total / stats.length).toFixed(1) : 0

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010'
      const res = await fetch(`${apiUrl}/api/analytics/stats/?period=${period}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setTotal(data.total)
        setUniqueVisitors(data.unique_visitors || 0)
        setTopPages(data.top_pages || [])
        setDeviceStats(data.device_stats || [])
        setBrowserStats(data.browser_stats || [])
        setCountryStats(data.country_stats || [])
        setReferrerStats(data.referrer_stats || [])
        setTrafficSourceStats(data.traffic_source_stats || [])
        setSocialMediaStats(data.social_media_stats || [])
      } else {
        console.error('Failed to fetch:', res.status, await res.text())
      }
    } catch (err) {
      console.error('Error:', err)
    }
    setLoading(false)
  }

  const formatDate = (stat: Stat) => {
    if (stat.date) return new Date(stat.date).toLocaleDateString()
    if (stat.month) return new Date(stat.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    if (stat.year) return new Date(stat.year).getFullYear()
    return ''
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0477BF] text-white p-4">
        <a href="/admin/dashboard" className="text-white font-bold">? Back to Dashboard</a>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 mt-16">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Website Analytics</h1>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Export CSV</button>
              <button onClick={() => setShowResetModal(true)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reset All</button>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button onClick={() => setPeriod('daily')} className={`px-6 py-2 rounded ${period === 'daily' ? 'bg-[#0477BF] text-white' : 'bg-gray-200'}`}>Daily</button>
            <button onClick={() => setPeriod('monthly')} className={`px-6 py-2 rounded ${period === 'monthly' ? 'bg-[#0477BF] text-white' : 'bg-gray-200'}`}>Monthly</button>
            <button onClick={() => setPeriod('yearly')} className={`px-6 py-2 rounded ${period === 'yearly' ? 'bg-[#0477BF] text-white' : 'bg-gray-200'}`}>Yearly</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-blue-50 rounded">
              <h3 className="text-lg font-semibold">Total Visits</h3>
              <p className="text-3xl font-bold">{total}</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <h3 className="text-lg font-semibold">Unique Visitors</h3>
              <p className="text-3xl font-bold">{uniqueVisitors}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded">
              <h3 className="text-lg font-semibold">Avg Visits/Day</h3>
              <p className="text-3xl font-bold">{avgPerDay}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-purple-50 rounded">
              <h3 className="text-lg font-semibold mb-3">Top Pages</h3>
              {topPages.slice(0, 5).map((page, i) => (
                <div key={i} className="flex justify-between text-sm mb-2">
                  <span className="truncate">{page.path}</span>
                  <span className="font-semibold ml-2">{page.count}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-yellow-50 rounded">
              <h3 className="text-lg font-semibold mb-3">Devices</h3>
              {deviceStats.map((d, i) => (
                <div key={i} className="flex justify-between text-sm mb-2">
                  <span>{d.device_type || 'Unknown'}</span>
                  <span className="font-semibold">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-pink-50 rounded">
              <h3 className="text-lg font-semibold mb-3">Browsers</h3>
              {browserStats.slice(0, 5).map((b, i) => (
                <div key={i} className="flex justify-between text-sm mb-2">
                  <span>{b.browser || 'Unknown'}</span>
                  <span className="font-semibold">{b.count}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-indigo-50 rounded">
              <h3 className="text-lg font-semibold mb-3">Top Countries</h3>
              {countryStats.slice(0, 5).map((c, i) => (
                <div key={i} className="flex justify-between text-sm mb-2">
                  <span>{c.country}</span>
                  <span className="font-semibold">{c.count}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-teal-50 rounded">
              <h3 className="text-lg font-semibold mb-3">Top Referrers</h3>
              {referrerStats.slice(0, 5).map((r, i) => (
                <div key={i} className="flex justify-between text-sm mb-2">
                  <span className="truncate text-xs">{r.referrer}</span>
                  <span className="font-semibold ml-2">{r.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded border-2 border-blue-200">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">?? Traffic Sources</h3>
              {trafficSourceStats.length > 0 ? trafficSourceStats.map((t, i) => (
                <div key={i} className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{t.traffic_source}</span>
                  <span className="font-bold text-blue-600">{t.count}</span>
                </div>
              )) : <p className="text-gray-500 text-sm">No data yet</p>}
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-orange-50 rounded border-2 border-pink-200">
              <h3 className="text-lg font-semibold mb-3 text-pink-800">?? Social Media Traffic</h3>
              {socialMediaStats.length > 0 ? socialMediaStats.map((s, i) => {
                const icons: {[key: string]: string} = {
                  'Facebook': '??',
                  'Instagram': '??',
                  'Twitter': '??',
                  'LinkedIn': '??',
                  'TikTok': '??',
                  'YouTube': '??'
                }
                return (
                  <div key={i} className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{icons[s.traffic_source] || '??'} {s.traffic_source}</span>
                    <span className="font-bold text-pink-600">{s.count}</span>
                  </div>
                )
              }) : <p className="text-gray-500 text-sm">No social media traffic yet</p>}
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Period</th>
                  <th className="border p-3 text-left">Visits</th>
                  <th className="border p-3 text-left">Unique Visitors</th>
                  <th className="border p-3 text-left">IP Addresses (Visits)</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border p-3">{formatDate(stat)}</td>
                    <td className="border p-3 font-semibold">{stat.count}</td>
                    <td className="border p-3 font-semibold text-green-600">{stat.ip_data?.length || 0}</td>
                    <td className="border p-3 text-gray-600 text-sm">
                      {stat.ip_data?.map((ip, idx) => (
                        <span key={idx} className="inline-block mr-3 mb-1">
                          {ip.ip_address} <span className="font-semibold text-blue-600">({ip.visit_count})</span>
                        </span>
                      )) || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-red-600">?? Reset Analytics</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to delete all analytics data? This action cannot be undone!</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowResetModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleReset} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes, Delete All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
