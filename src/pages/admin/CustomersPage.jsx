import { useState } from 'react'

function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const customers = [
    { name: "Sarvar", age: 28, gender: "Erkak", phone: "+998901234567", orders: 3, profile: "Fresh" },
    { name: "Dilnoza", age: 25, gender: "Ayol", phone: "+998901234568", orders: 2, profile: "Sweet & Oriental" },
    { name: "Jamshid", age: 32, gender: "Erkak", phone: "+998901234569", orders: 1, profile: "Ocean & Marine" },
    { name: "Aziza", age: 24, gender: "Ayol", phone: "+998901234570", orders: 1, profile: "Fresh" },
    { name: "Farhod", age: 30, gender: "Erkak", phone: "+998901234571", orders: 2, profile: "Sweet & Oriental" },
    { name: "Madina", age: 27, gender: "Ayol", phone: "+998901234572", orders: 1, profile: "Ocean & Marine" },
  ]

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase()
    return customer.name.toLowerCase().includes(query) || 
           customer.phone.includes(query)
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#111111]">Mijozlar</h1>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ism yoki telefon bo'yicha qidirish"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
              {filteredCustomers.map((customer, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-cream/50">
                  <td className="py-3 px-4 text-sm text-gray-700 font-medium">{customer.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{customer.age}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{customer.gender}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{customer.phone}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{customer.orders}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gold/20 text-gold">
                      {customer.profile}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomersPage

