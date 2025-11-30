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

      // Popular profiles (dummy calculation)
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
    { label: "Bugungi buyurtmalar", value: stats.todayOrders, color: "bg-blue-100 text-blue-700" },
    { label: "Bugungi probniklar", value: stats.todayProbniks, color: "bg-green-100 text-green-700" },
    { label: "Bugungi flakonlar", value: stats.todayFlakons, color: "bg-purple-100 text-purple-700" },
    { label: "Jami daromad", value: `${formatPrice(stats.totalRevenue)} so'm`, color: "bg-gold text-white" },
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
      <h1 className="text-3xl font-bold text-[#111111]">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-6 shadow-sm`}>
            <p className="text-sm font-medium opacity-90 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders & Popular Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">So'nggi buyurtmalar</h2>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#111111]">{order.name}</p>
                    <p className="text-sm text-gray-600">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#111111]">{order.price}</p>
                    <p className="text-xs text-gray-500">{order.date || order.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Buyurtmalar topilmadi</p>
          )}
        </div>

        {/* Popular Profiles */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">Mashhur profillar</h2>
          {popularProfiles.length > 0 ? (
            <div className="space-y-3">
              {popularProfiles.map((profile, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{profile.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gold h-2 rounded-full" 
                        style={{ width: `${profile.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12 text-right">{profile.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Ma'lumotlar topilmadi</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
