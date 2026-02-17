'use client'

import { useEffect, useState } from 'react'

interface AnalyticsStat {
  date?: string
  month?: string
  year?: string
  count: number
}

interface AnalyticsData {
  period: string
  stats: AnalyticsStat[]
  total: number
}

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken') // You need to implement admin auth
      const response = await fetch(`http://localhost:8000/api/analytics/stats/?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        setError('Failed to fetch analytics')
      }
    } catch (err) {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (stat: AnalyticsStat) => {
    if (stat.date) return new Date(stat.date).toLocaleDateString()
    if (stat.month) return new Date(stat.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    if (stat.year) return new Date(stat.year).getFullYear().toString()
    return ''
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6">Website Analytics</h2>
      
      {/* Period Selector */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setPeriod('daily')}
          className={`px-6 py-2 rounded ${period === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Daily
        </button>
        <button
          onClick={() => setPeriod('monthly')}
          className={`px-6 py-2 rounded ${period === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setPeriod('yearly')}
          className={`px-6 py-2 rounded ${period === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Yearly
        </button>
      </div>

      {/* Total Visits */}
      {data && (
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <h3 className="text-xl font-semibold">Total Visits: {data.total}</h3>
        </div>
      )}

      {/* Stats Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : data ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Period</th>
                <th className="border p-3 text-left">Visits</th>
              </tr>
            </thead>
            <tbody>
              {data.stats.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-3">{formatDate(stat)}</td>
                  <td className="border p-3 font-semibold">{stat.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
