import { useState, useEffect } from 'react'
import { settingsAPI } from '../../services/api'

function SettingsPage() {
  const [settings, setSettings] = useState({
    telegram: "",
    instagram: "",
    email: "",
    phone: "",
    probnikPrice: "",
    price50ml: "",
    price100ml: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await settingsAPI.get()
      setSettings(data)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await settingsAPI.update(settings)
      alert('Sozlamalar saqlandi!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Sozlamalarni saqlashda xatolik yuz berdi')
    } finally {
      setSaving(false)
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
      <h1 className="text-3xl font-bold text-[#111111]">Sozlamalar</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">Kontakt ma'lumotlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telegram username</label>
              <input
                type="text"
                name="telegram"
                value={settings.telegram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="@hidim_parfum"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="text"
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="@hidim.official"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="info@hidim.uz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asosiy telefon raqami</label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="+998901234567"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-[#111111] mb-4">Narxlar</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Probnik narxi (so'm)</label>
                <input
                  type="number"
                  name="probnikPrice"
                  value={settings.probnikPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="45000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">50 ml narxi (so'm)</label>
                <input
                  type="number"
                  name="price50ml"
                  value={settings.price50ml}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="299000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">100 ml narxi (so'm)</label>
                <input
                  type="number"
                  name="price100ml"
                  value={settings.price100ml}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="499000"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#111111] text-white rounded-lg hover:bg-gold transition-colors font-medium disabled:opacity-50"
            >
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SettingsPage
