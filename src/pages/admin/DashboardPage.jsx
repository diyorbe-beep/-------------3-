function DashboardPage() {
  const stats = [
    { label: "Bugungi buyurtmalar", value: "12", color: "bg-blue-100 text-blue-700" },
    { label: "Bugungi probniklar", value: "8", color: "bg-green-100 text-green-700" },
    { label: "Bugungi flakonlar (50/100 ml)", value: "4", color: "bg-purple-100 text-purple-700" },
    { label: "Umumiy tushum (so'm)", value: "2 450 000", color: "bg-gold/20 text-gold" },
  ]

  const recentOrders = [
    { id: "#001", customer: "Sarvar", product: "50 ml EDP", price: "299 000", status: "Tayyorlanmoqda" },
    { id: "#002", customer: "Dilnoza", product: "10 ml Probnik", price: "45 000", status: "Yangi" },
    { id: "#003", customer: "Jamshid", product: "100 ml EDP", price: "499 000", status: "Yo'lda" },
    { id: "#004", customer: "Aziza", product: "10 ml Probnik", price: "45 000", status: "Yetkazildi" },
    { id: "#005", customer: "Farhod", product: "50 ml EDP", price: "299 000", status: "Tayyorlanmoqda" },
  ]

  const popularProfiles = [
    { name: "Fresh", percentage: 35 },
    { name: "Sweet & Oriental", percentage: 28 },
    { name: "Ocean & Marine", percentage: 22 },
    { name: "Woody", percentage: 15 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#111111]">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">Oxirgi 5 ta buyurtma</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
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
                {recentOrders.map((order) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Profiles */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">Eng ko'p tanlangan hid yo'nalishlari</h2>
          <div className="space-y-4">
            {popularProfiles.map((profile, index) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

