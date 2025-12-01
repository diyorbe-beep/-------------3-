import { useState, useEffect } from 'react'
import { feedbackAPI } from '../../services/api'

function FeedbackPage() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeedback()
  }, [])

  const loadFeedback = async () => {
    try {
      setLoading(true)
      const data = await feedbackAPI.getAll()
      setFeedback(Array.isArray(data) ? data : [])
    } catch (error) {
      setFeedback([])
    } finally {
      setLoading(false)
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
        <h1 className="text-3xl font-bold text-[#111111]">Feedback</h1>
        <button
          onClick={loadFeedback}
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-brown transition-colors"
        >
          Yangilash
        </button>
      </div>

      {feedback.length > 0 ? (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-[#111111]">{item.name || 'Aniqlanmagan'}</p>
                  <p className="text-sm text-gray-600">{item.email || item.phone || 'Kontakt yo\'q'}</p>
                </div>
                <p className="text-xs text-gray-500">{item.date || item.createdAt || ''}</p>
              </div>
              <p className="text-gray-700">{item.message || item.comment || 'Xabar yo\'q'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Hozircha feedback yo'q</p>
        </div>
      )}
    </div>
  )
}

export default FeedbackPage
