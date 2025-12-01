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
              <label className="block text-sm font-medium mb-2 text-[#111111]">Kod</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#111111]">Chegirma (%)</label>
              <input
                type="number"
                required
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
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

      {discounts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Kod</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chegirma</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tavsif</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount) => (
                  <tr key={discount.id} className="border-b border-gray-100 hover:bg-cream/50">
                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{discount.code}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{discount.discount}%</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{discount.description || 'Tavsif yo\'q'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Hozircha promo kodlar yo'q</p>
        </div>
      )}
    </div>
  )
}

export default DiscountsPage
