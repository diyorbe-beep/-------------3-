import { useState, useEffect } from 'react'
import { discountsAPI } from '../../services/api'

function DiscountsPage() {
  const [promoCodes, setPromoCodes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
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
      setPromoCodes(data)
    } catch (error) {
      console.error('Error loading discounts:', error)
      alert('Chegirmalarni yuklashda xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const newDiscount = await discountsAPI.create({
        ...formData,
        discount: parseInt(formData.discount),
        active: true
      })
      setPromoCodes([...promoCodes, newDiscount])
      setFormData({ code: '', discount: '', description: '' })
      setShowForm(false)
      alert('Promo kod muvaffaqiyatli qo\'shildi!')
    } catch (error) {
      console.error('Error creating discount:', error)
      alert('Promo kod qo\'shishda xatolik yuz berdi')
    }
  }

  const toggleActive = async (id) => {
    try {
      const discount = promoCodes.find(d => d.id === id)
      const updated = await discountsAPI.update(id, { active: !discount.active })
      setPromoCodes(promoCodes.map(d => d.id === id ? updated : d))
    } catch (error) {
      console.error('Error updating discount:', error)
      alert('Holatni yangilashda xatolik yuz berdi')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bu promo kodni o\'chirishni xohlaysizmi?')) {
      try {
        await discountsAPI.delete(id)
        setPromoCodes(promoCodes.filter(d => d.id != id))
        alert('Promo kod o\'chirildi!')
      } catch (error) {
        console.error('Error deleting discount:', error)
        alert('Promo kodni o\'chirishda xatolik yuz berdi')
      }
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
              {promoCodes.length > 0 ? (
                promoCodes.map((promo) => (
                  <tr key={promo.id} className="border-b border-gray-100 hover:bg-cream/50">
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleActive(promo.id)}
                          className="text-gold hover:text-brown text-sm font-medium"
                        >
                          {promo.active ? 'Noaktiv qilish' : 'Aktiv qilish'}
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          O'chirish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">Promo kodlar topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DiscountsPage
