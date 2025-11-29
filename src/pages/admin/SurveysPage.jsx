import { useState, useEffect } from 'react'
import { surveysAPI } from '../../services/api'

function SurveysPage() {
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    date: ''
  })

  useEffect(() => {
    loadSurveys()
    // Har 10 soniyada avtomatik yangilash
    const interval = setInterval(() => {
      loadSurveys()
    }, 10000) // 10 soniya
    
    return () => clearInterval(interval)
  }, [])

  const loadSurveys = async () => {
    try {
      setLoading(true)
      const data = await surveysAPI.getAll()
      console.log('So\'rovlar yuklandi:', data)
      // Agar data array bo'lmasa, bo'sh array qaytaramiz
      setSurveys(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading surveys:', error)
      setSurveys([])
      if (surveys.length === 0) {
        alert(`So'rovlarni yuklashda xatolik yuz berdi: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredSurveys = surveys.filter(survey => {
    if (filters.name && !survey.name?.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.phone && !survey.phone?.includes(filters.phone)) return false
    if (filters.date && survey.createdAt && !survey.createdAt.startsWith(filters.date)) return false
    return true
  })

  // Sana formatlash
  const formatDate = (dateString) => {
    if (!dateString) return 'Aniqlanmagan'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
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
        <h1 className="text-3xl font-bold text-[#111111]">So'rovlar (Surovnomalar)</h1>
        <button
          onClick={loadSurveys}
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-brown transition-colors font-medium"
        >
          🔄 Yangilash
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#111111] mb-4">Filtrlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ism</label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              placeholder="Ism bo'yicha qidirish..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <input
              type="text"
              value={filters.phone}
              onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
              placeholder="Telefon bo'yicha qidirish..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sana</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </div>

      {/* Surveys Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ism</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Telefon</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Yosh</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Jins</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sana</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredSurveys.length > 0 ? (
                filteredSurveys.map((survey) => (
                  <tr key={survey.id} className="border-b border-gray-100 hover:bg-cream/50">
                    <td className="py-3 px-4 text-sm text-gray-700">#{survey.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{survey.name || 'Aniqlanmagan'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{survey.phone || 'Aniqlanmagan'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{survey.age || 'Aniqlanmagan'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{survey.gender || 'Aniqlanmagan'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatDate(survey.createdAt)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedSurvey(survey)}
                        className="text-gold hover:text-brown text-sm font-medium"
                      >
                        Ko'rish
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">So'rovlar topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111111]">So'rov ma'lumotlari</h2>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                    <p className="text-gray-900">{selectedSurvey.name || 'Aniqlanmagan'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <p className="text-gray-900">{selectedSurvey.phone || 'Aniqlanmagan'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yosh</label>
                    <p className="text-gray-900">{selectedSurvey.age || 'Aniqlanmagan'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jins</label>
                    <p className="text-gray-900">{selectedSurvey.gender || 'Aniqlanmagan'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mavsum</label>
                    <p className="text-gray-900">{selectedSurvey.season || 'Aniqlanmagan'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sana</label>
                    <p className="text-gray-900">{formatDate(selectedSurvey.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xarakter</label>
                  <p className="text-gray-900">
                    {Array.isArray(selectedSurvey.character) 
                      ? selectedSurvey.character.join(', ') 
                      : selectedSurvey.character || 'Aniqlanmagan'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yoqtirgan parfumlar</label>
                  <p className="text-gray-900">{selectedSurvey.favoritePerfumes || 'Aniqlanmagan'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yoqtirmagan hidlar</label>
                  <p className="text-gray-900">{selectedSurvey.dislikedScents || 'Aniqlanmagan'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intensivlik</label>
                  <p className="text-gray-900">{selectedSurvey.intensity || 'Aniqlanmagan'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vaziyat</label>
                  <p className="text-gray-900">{selectedSurvey.occasion || 'Aniqlanmagan'}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="px-6 py-2 bg-[#111111] text-white rounded-lg hover:bg-gold transition-colors"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SurveysPage

