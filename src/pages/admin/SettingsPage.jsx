import { useState, useEffect } from 'react'
import { settingsAPI } from '../../services/api'

function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    socialMedia: {
      instagram: '',
      telegram: '',
      facebook: ''
    }
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
      if (data) {
        setSettings({
          siteName: data.siteName || '',
          contactPhone: data.contactPhone || '',
          contactEmail: data.contactEmail || '',
          address: data.address || '',
          socialMedia: {
            instagram: data.socialMedia?.instagram || '',
            telegram: data.socialMedia?.telegram || '',
            facebook: data.socialMedia?.facebook || ''
          }
        })
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await settingsAPI.update(settings)
      alert('Sozlamalar muvaffaqiyatli saqlandi!')
    } catch (error) {
      alert('Sozlamalarni saqlashda xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    if (field.startsWith('socialMedia.')) {
      const socialField = field.split('.')[1]
      setSettings(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value
        }
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }))
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

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#111111]">
            Sayt nomi
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            placeholder="HIDIM"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#111111]">
            Kontakt telefon
          </label>
          <input
            type="tel"
            value={settings.contactPhone}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            placeholder="+998901234567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#111111]">
            Kontakt email
          </label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            placeholder="info@hidim.uz"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#111111]">
            Manzil
          </label>
          <textarea
            value={settings.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            rows="3"
            placeholder="Manzil..."
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-[#111111] mb-4">Ijtimoiy tarmoqlar</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#111111]">
                Instagram
              </label>
              <input
                type="text"
                value={settings.socialMedia.instagram}
                onChange={(e) => handleChange('socialMedia.instagram', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="@hidim_parfum"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#111111]">
                Telegram
              </label>
              <input
                type="text"
                value={settings.socialMedia.telegram}
                onChange={(e) => handleChange('socialMedia.telegram', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="@hidim_parfum"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#111111]">
                Facebook
              </label>
              <input
                type="text"
                value={settings.socialMedia.facebook}
                onChange={(e) => handleChange('socialMedia.facebook', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="hidim.parfum"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#111111] text-white rounded-lg hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsPage
