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
              <label className="block text-sm font-medium mb-2 text-[#111111]">Nomi</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#111111]">Tavsif</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                rows="3"
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

      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#111111] mb-2">{profile.name}</h3>
              <p className="text-gray-700 text-sm">{profile.description || 'Tavsif yo\'q'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Hozircha profillar yo'q</p>
        </div>
      )}
    </div>
  )
}

export default FragranceProfilesPage
