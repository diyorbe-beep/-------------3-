import { useState, useEffect } from 'react'
import { dashboardAPI, ordersAPI } from '../../services/api'

function DashboardPage() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayProbniks: 0,
    todayFlakons: 0,
    totalRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [popularProfiles, setPopularProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsData, ordersData] = await Promise.all([
        dashboardAPI.getStats(),
        ordersAPI.getAll()
      ])
      
      setStats({
        todayOrders: statsData.todayOrders,
        todayProbniks: statsData.todayProbniks,
        todayFlakons: statsData.todayFlakons,
        totalRevenue: statsData.totalRevenue
      })

      // Recent 5 orders
      const sorted = ordersData.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      setRecentOrders(sorted.slice(0, 5))

      // Popular profiles
      const profileCounts = {}
      ordersData.forEach(order => {
        if (order.profile) {
          profileCounts[order.profile] = (profileCounts[order.profile] || 0) + 1
        }
      })
      const total = Object.values(profileCounts).reduce((sum, count) => sum + count, 0)
      const profiles = Object.entries(profileCounts).map(([name, count]) => ({
        name,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      })).sort((a, b) => b.percentage - a.percentage).slice(0, 4)
      setPopularProfiles(profiles)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('uz-UZ')
    }
    return price
  }

  const displayStats = [
    { 
      label: "Bugungi buyurtmalar", 
      value: stats.todayOrders, 
      color: "bg-blue-50 border-blue-200 text-blue-700",
      iconBg: "bg-blue-100",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      label: "Bugungi probniklar", 
      value: stats.todayProbniks, 
      color: "bg-green-50 border-green-200 text-green-700",
      iconBg: "bg-green-100",
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      label: "Bugungi flakonlar", 
      value: stats.todayFlakons, 
      color: "bg-purple-50 border-purple-200 text-purple-700",
      iconBg: "bg-purple-100",
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      label: "Jami daromad", 
      value: `${formatPrice(stats.totalRevenue)} so'm`, 
      color: "bg-gold/10 border-gold/30 text-brown",
      iconBg: "bg-gold/20",
      icon: (
        <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#111111]">Dashboard</h1>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString('uz-UZ', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
          <div key={index} className={`bg-white rounded-xl shadow-md border-2 ${stat.color} p-6 hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color.includes('text-') ? '' : 'text-[#111111]'}`}>
              {stat.value}
            </p>
            <div className={`mt-4 h-1 ${stat.iconBg} rounded-full`}></div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md border border-gold/20 p-6">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-semibold text-[#111111]">So'nggi buyurtmalar</h2>
        </div>
        {recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-cream rounded-lg hover:bg-gold/10 transition-colors border border-gold/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">{order.id || order.customer}</p>
                    <p className="text-sm text-gray-600">{order.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">{order.date}</p>
                  {order.price && (
                    <p className="text-sm font-semibold text-gold">{order.price} so'm</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 font-medium">Hozircha buyurtmalar yo'q</p>
          </div>
        )}
      </div>

      {/* Popular Profiles */}
      {popularProfiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gold/20 p-6">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <h2 className="text-xl font-semibold text-[#111111]">Mashhur profillar</h2>
          </div>
          <div className="space-y-4">
            {popularProfiles.map((profile, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-cream rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                    <span className="text-gold font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-gray-700 font-medium">{profile.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${profile.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gold font-bold text-lg min-w-[3rem] text-right">{profile.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
