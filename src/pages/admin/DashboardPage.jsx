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
    { label: "Bugungi flakonlar (50/100 ml)", value: stats.todayFlakons, color: "bg-purple-100 text-purple-700" },
    { label: "Umumiy tushum (so'm)", value: formatPrice(stats.totalRevenue), color: "bg-gold/20 text-gold" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-[#111111]">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {displayStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
            <p className="text-xs lg:text-sm text-gray-600 mb-2">{stat.label}</p>
            <p className={`text-xl lg:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold text-[#111111] mb-4">Oxirgi 5 ta buyurtma</h2>
          <div className="overflow-x-auto -mx-4 lg:mx-0">
            <div className="min-w-full px-4 lg:px-0">
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">ID</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{String(order.id).substring(0, 8)}...</p>
                        </div>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">
                          {order.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Mijoz</p>
                        <p className="text-sm text-gray-900">{order.customer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Mahsulot</p>
                        <p className="text-sm text-gray-900">{order.product}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Narx</p>
                        <p className="text-sm font-semibold text-gray-900">{order.price}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Buyurtmalar yo'q</p>
                )}
              </div>
              {/* Desktop Table View */}
              <table className="hidden lg:table w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">ID</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Mijoz</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Mahsulot</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Narx</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Holat</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-cream/50">
                        <td className="py-3 px-2 text-sm text-gray-700">{order.id}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{order.customer}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{order.product}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{order.price}</td>
                        <td className="py-3 px-2">
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">Buyurtmalar yo'q</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Popular Profiles */}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold text-[#111111] mb-4">Eng ko'p tanlangan hid yo'nalishlari</h2>
          <div className="space-y-4">
            {popularProfiles.length > 0 ? (
              popularProfiles.map((profile, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{profile.name}</span>
                    <span className="text-sm font-semibold text-gold">{profile.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full transition-all"
                      style={{ width: `${profile.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Ma'lumotlar yo'q</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
