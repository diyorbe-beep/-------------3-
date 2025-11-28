import { useState } from 'react'

function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([
    { id: "#001", date: "2025-11-28", customer: "Sarvar", phone: "+998901234567", product: "50 ml EDP", price: "299 000", status: "Tayyorlanmoqda", comment: "Yengil hid kerak", address: "Toshkent sh., Chilonzor t., 15-uy", profile: "Fresh" },
    { id: "#002", date: "2025-11-28", customer: "Dilnoza", phone: "+998901234568", product: "10 ml Probnik", price: "45 000", status: "Yangi", comment: "", address: "Toshkent sh., Yunusobod t., 20-uy", profile: "Sweet & Oriental" },
    { id: "#003", date: "2025-11-27", customer: "Jamshid", phone: "+998901234569", product: "100 ml EDP", price: "499 000", status: "Yo'lda", comment: "Kuchli hid", address: "Toshkent sh., Mirzo Ulug'bek t., 5-uy", profile: "Ocean & Marine" },
    { id: "#004", date: "2025-11-27", customer: "Aziza", phone: "+998901234570", product: "10 ml Probnik", price: "45 000", status: "Yetkazildi", comment: "", address: "Toshkent sh., Shayxontohur t., 12-uy", profile: "Fresh" },
    { id: "#005", date: "2025-11-26", customer: "Farhod", phone: "+998901234571", product: "50 ml EDP", price: "299 000", status: "Tayyorlanmoqda", comment: "Romantik hid", address: "Toshkent sh., Sergeli t., 8-uy", profile: "Sweet & Oriental" },
  ])

  const [filters, setFilters] = useState({
    status: '',
    product: '',
    date: ''
  })

  const statusOptions = ['', 'Yangi', 'Tayyorlanmoqda', "Yo'lda", 'Yetkazildi']
  const productOptions = ['', '10 ml Probnik', '50 ml EDP', '100 ml EDP']

  const filteredOrders = orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false
    if (filters.product && order.product !== filters.product) return false
    if (filters.date && order.date !== filters.date) return false
    return true
  })

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    setSelectedOrder({ ...selectedOrder, status: newStatus })
  }

  const getStatusBadge = (status) => {
    const colors = {
      'Yangi': 'bg-blue-100 text-blue-700',
      'Tayyorlanmoqda': 'bg-yellow-100 text-yellow-700',
      "Yo'lda": 'bg-purple-100 text-purple-700',
      'Yetkazildi': 'bg-green-100 text-green-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#111111]">Buyurtmalar</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#111111] mb-4">Filtrlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Holat</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt || 'Barchasi'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mahsulot turi</label>
            <select
              value={filters.product}
              onChange={(e) => setFilters({ ...filters, product: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {productOptions.map(opt => (
                <option key={opt} value={opt}>{opt || 'Barchasi'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sana</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sana</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mijoz</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Telefon</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mahsulot</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Narx</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Holat</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-cream/50">
                  <td className="py-3 px-4 text-sm text-gray-700">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{order.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{order.customer}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{order.phone}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{order.product}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{order.price}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-gold hover:text-brown text-sm font-medium"
                    >
                      Ko'rish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111111]">Buyurtma ma'lumotlari</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                  <p className="text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mijoz</label>
                  <p className="text-gray-900">{selectedOrder.customer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <p className="text-gray-900">{selectedOrder.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mahsulot</label>
                  <p className="text-gray-900">{selectedOrder.product}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Narx</label>
                  <p className="text-gray-900">{selectedOrder.price} so'm</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hid profili</label>
                  <p className="text-gray-900">{selectedOrder.profile}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
                  <p className="text-gray-900">{selectedOrder.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
                  <p className="text-gray-900">{selectedOrder.comment || 'Izoh yo\'q'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Holatni o'zgartirish</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    {statusOptions.filter(opt => opt).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-[#111111] text-white rounded-lg hover:bg-gold transition-colors"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage

