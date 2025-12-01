import { useState, useEffect } from 'react'
import { customersAPI, ordersAPI } from '../../services/api'

function CustomerPanel({ customer, onLogout }) {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [customer])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const customerOrders = await customersAPI.getOrders(customer.id)
      setOrders(customerOrders)
    } catch (error) {
      console.error('Buyurtmalarni yuklash xatosi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Yangi':
        return 'bg-blue-100 text-blue-800'
      case 'Jarayonda':
        return 'bg-yellow-100 text-yellow-800'
      case 'Tayyor':
        return 'bg-green-100 text-green-800'
      case 'Yetkazildi':
        return 'bg-purple-100 text-purple-800'
      case 'Bekor qilindi':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#111111]">Mening buyurtmalarim</h1>
              <p className="text-sm text-gray-600 mt-1">
                {customer.firstName} {customer.lastName} • {customer.phone}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gold transition-colors"
            >
              Chiqish
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Buyurtmalar topilmadi</h3>
            <p className="mt-2 text-sm text-gray-500">
              Siz hali hech qanday buyurtma qilmadingiz
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[#111111]">
                        {order.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Mahsulot:</span> {order.product}
                    </p>
                    {order.volume && (
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Hajm:</span> {order.volume} ml
                      </p>
                    )}
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Narx:</span> {order.price} so'm
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(order.date).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#111111]">Buyurtma tafsilotlari</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Buyurtma raqami</span>
                <p className="text-lg font-semibold text-[#111111] mt-1">{selectedOrder.id}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Holat</span>
                <p className="mt-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Mahsulot</span>
                <p className="text-lg text-[#111111] mt-1">{selectedOrder.product}</p>
              </div>

              {selectedOrder.volume && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Hajm</span>
                  <p className="text-lg text-[#111111] mt-1">{selectedOrder.volume} ml</p>
                </div>
              )}

              <div>
                <span className="text-sm font-medium text-gray-500">Narx</span>
                <p className="text-lg font-semibold text-gold mt-1">{selectedOrder.price} so'm</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Sana</span>
                <p className="text-[#111111] mt-1">
                  {new Date(selectedOrder.date).toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {selectedOrder.comment && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Izoh</span>
                  <p className="text-[#111111] mt-1">{selectedOrder.comment}</p>
                </div>
              )}

              {selectedOrder.email && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Email</span>
                  <p className="text-[#111111] mt-1">{selectedOrder.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerPanel

