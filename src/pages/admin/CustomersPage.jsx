import { useState, useEffect } from 'react'
import { customersAPI } from '../../services/api'

function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await customersAPI.getAll()
      setCustomers(data)
    } catch (error) {
      console.error('Error loading customers:', error)
      alert('Mijozlarni yuklashda xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase()
    return customer.name?.toLowerCase().includes(query) || 
           customer.phone?.includes(query)
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-[#111111]">Mijozlar</h1>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ism yoki telefon bo'yicha qidirish"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm lg:text-base"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <div key={customer.id || index} className="p-4 space-y-2 hover:bg-cream/50">
                <div>
                  <p className="text-xs text-gray-500">Ism</p>
                  <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Yosh</p>
                    <p className="text-sm text-gray-900">{customer.age}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Jins</p>
                    <p className="text-sm text-gray-900">{customer.gender}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Telefon</p>
                  <p className="text-sm text-gray-900">{customer.phone}</p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="text-xs text-gray-500">Buyurtmalar</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.orders || 0} ta</p>
                  </div>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-gold/20 text-gold">
                    {customer.profile || 'Aniqlanmagan'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">Mijozlar topilmadi</div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ism</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Yosh</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Jins</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Telefon</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nechta buyurtma</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Asosiy hid profili</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer.id || index} className="border-b border-gray-100 hover:bg-cream/50">
                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{customer.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{customer.age}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{customer.gender}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{customer.phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{customer.orders || 0}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gold/20 text-gold">
                        {customer.profile || 'Aniqlanmagan'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">Mijozlar topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomersPage
