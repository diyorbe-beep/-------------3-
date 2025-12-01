import { useState, useEffect } from 'react'
import { customersAPI } from '../../services/api'

function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await customersAPI.getAll()
      setCustomers(Array.isArray(data) ? data : [])
    } catch (error) {
      setCustomers([])
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold text-[#111111]">Mijozlar</h1>
        <button
          onClick={loadCustomers}
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-brown transition-colors"
        >
          Yangilash
        </button>
      </div>

      {customers.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ism</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Telefon</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Buyurtmalar</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-cream/50">
                    <td className="py-3 px-4 text-sm text-gray-700">{customer.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{customer.email || 'Aniqlanmagan'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{customer.phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{customer.orders || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Hozircha mijozlar yo'q</p>
        </div>
      )}
    </div>
  )
}

export default CustomersPage
