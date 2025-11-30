import { useState, useEffect } from 'react'
import { profilesAPI } from '../../services/api'

function FragranceProfilesPage() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    notes: ''
  })

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      setLoading(true)
      const data = await profilesAPI.getAll()
      setProfiles(Array.isArray(data) ? data : [])
    } catch (error) {
      setProfiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await profilesAPI.create(formData)
      setShowForm(false)
      setFormData({ name: '', description: '', notes: '' })
      loadProfiles()
      alert('Profil muvaffaqiyatli qo\'shildi!')
    } catch (error) {
      alert('Profil qo\'shishda xatolik yuz berdi')
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
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-brown transition-colors"
        >
          {showForm ? 'Bekor qilish' : 'Yangi profil'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#111111] mb-4">Yangi profil qo'shish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#111111]">
                Nomi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Masalan: Fresh & Clean"
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
                placeholder="Profil tavsifi..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#111111]">
                Notalar
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                rows="3"
                placeholder="Hid notalari..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-[#111111] mb-2">{profile.name}</h3>
              {profile.description && (
                <p className="text-gray-700 mb-3">{profile.description}</p>
              )}
              {profile.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Notalar:</p>
                  <p className="text-sm text-gray-700">{profile.notes}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            Profillar topilmadi
          </div>
        )}
      </div>
    </div>
  )
}

export default FragranceProfilesPage
