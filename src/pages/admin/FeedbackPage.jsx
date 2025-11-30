import { useState, useEffect } from 'react'
import { feedbackAPI } from '../../services/api'

function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeedback()
  }, [])

  const loadFeedback = async () => {
    try {
      setLoading(true)
      const data = await feedbackAPI.getAll()
      setFeedbacks(data)
    } catch (error) {
      alert('Feedback yuklashda xatolik yuz berdi')
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
      <h1 className="text-3xl font-bold text-[#111111]">Feedback</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#111111]">{feedback.customer}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feedback.product}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">{feedback.comment}</p>
              {feedback.videoUrl && (
                <a
                  href={feedback.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-brown text-sm font-medium flex items-center gap-2"
                >
                  <span>▶</span>
                  Video URL
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500 py-8">
            Feedback topilmadi
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedbackPage
