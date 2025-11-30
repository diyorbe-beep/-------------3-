import { useState, useEffect } from 'react'
import { discountsAPI } from '../../services/api'

function DiscountsPage() {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    description: ''
  })

  useEffect(() => {
    loadDiscounts()
  }, [])

  const loadDiscounts = async () => {
    try {
      setLoading(true)
      const data = await discountsAPI.getAll()
      setDiscounts(Array.isArray(data) ? data : [])
    } catch (error) {
      setDiscounts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await discountsAPI.create(formData)
      setShowForm(false)
      setFormData({ code: '', discount: '', description: '' })
      loadDiscounts()
      alert('Promo kod muvaffaqiyatli qo\'shildi!')
    } catch (error) {
      alert('Promo kod qo\'shishda xatolik yuz berdi')
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
        <h1 className="text-3xl font-bold text-[#111111]">Chegirmalar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-brown transition-colors"
        >
          {showForm ? 'Bekor qilish' : 'Yangi promo kod'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">Yangi promo kod qo'shish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#111111]">
                Promo kod <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Masalan: WELCOME10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#111111]">
                Chegirma <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Masalan: 10% yoki 50000 so'm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#111111]">
                Tavsif
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                rows="3"
                placeholder="Promo kod tavsifi..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#111111] text-white px-4 py-2 rounded-lg hover:bg-gold transition-colors"
            >
              Qo'shish
            </button>
          </form>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo kod</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chegirma</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tavsif</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discounts.length > 0 ? (
              discounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111111]">
                    {discount.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {discount.discount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {discount.description || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                  Promo kodlar topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {discounts.length > 0 ? (
          discounts.map((discount) => (
            <div key={discount.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Promo kod</p>
                  <p className="text-sm font-medium text-[#111111]">{discount.code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Chegirma</p>
                  <p className="text-sm text-gray-700">{discount.discount}</p>
                </div>
                {discount.description && (
                  <div>
                    <p className="text-xs text-gray-500">Tavsif</p>
                    <p className="text-sm text-gray-700">{discount.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            Promo kodlar topilmadi
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountsPage
