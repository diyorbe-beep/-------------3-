import { useState } from 'react'

function DiscountsPage() {
  const [promoCodes, setPromoCodes] = useState([
    { code: "VIDEO10", discount: 10, description: "Video fikr uchun", active: true },
    { code: "FIRST10", discount: 10, description: "Birinchi buyurtma uchun", active: true },
    { code: "WINTER15", discount: 15, description: "Qish mavsumi uchun", active: false },
    { code: "VIP20", discount: 20, description: "VIP mijozlar uchun", active: true },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setPromoCodes([...promoCodes, { ...formData, discount: parseInt(formData.discount), active: true }])
    setFormData({ code: '', discount: '', description: '' })
    setShowForm(false)
  }

  const toggleActive = (code) => {
    setPromoCodes(promoCodes.map(promo => 
      promo.code === code ? { ...promo, active: !promo.active } : promo
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#111111]">Chegirmalar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-[#111111] text-white rounded-lg hover:bg-gold transition-colors"
        >
          {showForm ? 'Bekor qilish' : 'Yangi promo kod qo\'shish'}
        </button>
      </div>

      {/* Add Promo Code Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">Yangi promo kod</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promo kod nomi</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Masalan: VIDEO10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chegirma foizi</label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Masalan: 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Izoh</label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Masalan: Video fikr uchun"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#111111] text-white rounded-lg hover:bg-gold transition-colors"
            >
              Qo'shish
            </button>
          </form>
        </div>
      )}

      {/* Promo Codes Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Promo kod</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chegirma foizi</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Izoh</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Holati</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-cream/50">
                  <td className="py-3 px-4 text-sm text-gray-700 font-mono font-semibold">{promo.code}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{promo.discount}%</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{promo.description}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {promo.active ? 'Aktiv' : 'Noaktiv'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleActive(promo.code)}
                      className="text-gold hover:text-brown text-sm font-medium"
                    >
                      {promo.active ? 'Noaktiv qilish' : 'Aktiv qilish'}
                    </button>
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

export default DiscountsPage

