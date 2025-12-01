import { useState, useEffect } from 'react'
import { ordersAPI } from '../../services/api'

function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    product: '',
    date: ''
  })

  useEffect(() => {
    loadOrders()
    // Har 10 soniyada avtomatik yangilash
    const interval = setInterval(() => {
      loadOrders()
    }, 10000) // 10 soniya
    
    return () => clearInterval(interval)
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      console.log('🔄 Buyurtmalar yuklanmoqda...')
      console.log('🌐 Backend URL: https://atir.onrender.com/api/orders')
      
      const data = await ordersAPI.getAll()
      console.log('✅ Buyurtmalar yuklandi:', data)
      console.log('📊 Buyurtmalar soni:', Array.isArray(data) ? data.length : 0)
      
      // Agar data array bo'lmasa, bo'sh array qaytaramiz
      const ordersArray = Array.isArray(data) ? data : []
      setOrders(ordersArray)
      
      if (ordersArray.length === 0) {
        console.warn('⚠️ Buyurtmalar topilmadi. Backend\'dan bo\'sh array qaytdi.')
        console.warn('⚠️ Backend URL:', 'https://atir.onrender.com/api/orders')
        console.warn('⚠️ Tekshirish: Backend server ishlayaptimi?')
        console.warn('⚠️ Yechim: Backend serverni tekshiring yoki local backend\'ni ishga tushiring')
        
        // Backend server ishlayaptimi tekshirish
        try {
          const healthCheck = await fetch('https://atir.onrender.com/api/health')
          if (healthCheck.ok) {
            const health = await healthCheck.json()
            console.log('✅ Backend server ishlayapti:', health)
          } else {
            console.error('❌ Backend server javob bermayapti')
          }
        } catch (healthError) {
          console.error('❌ Backend serverga ulanishda xatolik:', healthError)
          console.error('❌ Ehtimol, backend server ishlamayapti yoki internet muammosi bor')
        }
      } else {
        console.log('✅ Buyurtmalar muvaffaqiyatli yuklandi!')
        console.log('✅ Birinchi buyurtma:', ordersArray[0])
      }
    } catch (error) {
      console.error('❌ Error loading orders:', error)
      console.error('❌ Error details:', error.message)
      console.error('❌ Error stack:', error.stack)
      console.error('❌ Backend serverga ulanishda muammo bo\'lishi mumkin')
      
      // Xatolik bo'lsa ham bo'sh array qo'yamiz
      setOrders([])
      
      // Faqat birinchi marta xatolik bo'lsa alert ko'rsatamiz
      if (orders.length === 0) {
        console.error('❌ Buyurtmalarni yuklashda xatolik. Backend server ishlayaptimi?')
      }
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = ['', 'Yangi', 'Tayyorlanmoqda', "Yo'lda", 'Yetkazildi']
  const productOptions = ['', '10 ml Probnik', '50 ml EDP', '100 ml EDP']

  const filteredOrders = orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false
    if (filters.product && order.product !== filters.product) return false
    if (filters.date && order.date !== filters.date) return false
    return true
  })

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.update(orderId, { status: newStatus })
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      setSelectedOrder({ ...selectedOrder, status: newStatus })
      alert('Holat yangilandi!')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Holatni yangilashda xatolik yuz berdi')
    }
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
        <div>
          <h1 className="text-3xl font-bold text-[#111111]">Buyurtmalar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Jami: {orders.length} ta buyurtma
            {filteredOrders.length !== orders.length && ` (${filteredOrders.length} ta ko'rsatilmoqda)`}
          </p>
          {orders.length === 0 && (
            <p className="text-xs text-red-500 mt-1">
              ⚠️ Buyurtmalar topilmadi. Console'ni tekshiring (F12) yoki "Yangilash" tugmasini bosing.
            </p>
          )}
        </div>
        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-brown transition-colors font-medium"
        >
          🔄 Yangilash
        </button>
      </div>

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
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Telefon</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mahsulot</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Narx</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Holat</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-cream/50">
                    <td className="py-3 px-4 text-sm text-gray-700">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{order.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{order.customer}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{order.email || 'Aniqlanmagan'}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-gray-500 text-lg">Buyurtmalar topilmadi</p>
                      {orders.length === 0 && (
                        <p className="text-gray-400 text-sm">Hozircha hech qanday buyurtma qoldirilmagan</p>
                      )}
                      {orders.length > 0 && filteredOrders.length === 0 && (
                        <p className="text-gray-400 text-sm">Filtrlar bo'yicha buyurtmalar topilmadi</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedOrder.email || 'Aniqlanmagan'}</p>
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
                  <p className="text-gray-900">{selectedOrder.profile || 'Aniqlanmagan'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
                  <p className="text-gray-900">{selectedOrder.address || 'Manzil kiritilmagan'}</p>
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
