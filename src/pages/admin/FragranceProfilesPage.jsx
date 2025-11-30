import { useState, useEffect } from 'react'
import { profilesAPI } from '../../services/api'

function FragranceProfilesPage() {
  const [profiles, setProfiles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  })

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      setLoading(true)
      const data = await profilesAPI.getAll()
      setProfiles(data)
    } catch (error) {
      alert('Profillarni yuklashda xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const newProfile = await profilesAPI.create(formData)
      setProfiles([...profiles, newProfile])
      setFormData({ name: '', code: '', description: '' })
      setShowForm(false)
      alert('Profil muvaffaqiyatli qo\'shildi!')
    } catch (error) {
      alert('Profil qo\'shishda xatolik yuz berdi')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bu profilni o\'chirishni xohlaysizmi?')) {
      try {
        await profilesAPI.delete(id)
        setProfiles(profiles.filter(p => p.id != id))
        alert('Profil o\'chirildi!')
      } catch (error) {
        alert('Profilni o\'chirishda xatolik yuz berdi')
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
        <h1 className="text-3xl font-bold text-[#111111]">Hid profillari</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-[#111111] text-white rounded-lg hover:bg-gold transition-colors"
        >
          {showForm ? 'Bekor qilish' : 'Yangi profil qo\'shish'}
        </button>
      </div>

      {/* Add Profile Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">Yangi hid profili</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profil nomi</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Masalan: Fresh"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ichki kod</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Masalan: FRESH_01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tavsif</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Profil haqida qisqa ma'lumot"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#111111] text-white rounded-lg hover:bg-gold transition-colors"
            >
              Saqlash
            </button>
          </form>
        </div>
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-semibold text-[#111111]">{profile.name}</h3>
              <button
                onClick={() => handleDelete(profile.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">Kod: {profile.code}</p>
            <p className="text-sm text-gray-700 mb-4">{profile.description}</p>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Nechta mijozda tanlangan: <span className="font-semibold text-gold">{profile.customers || 0}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FragranceProfilesPage
