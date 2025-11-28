function FeedbackPage() {
  const feedbacks = [
    {
      customer: "Sarvar",
      product: "50 ml EDP",
      comment: "Probnikdan keyin 50 ml oldim. Kiyimdan ikki kun hid ketmadi.",
      videoUrl: ""
    },
    {
      customer: "Dilnoza",
      product: "10 ml Probnik",
      comment: "Surovnoma orqali tanlangan hid menga juda mos tushdi. Yengil, lekin sezilarli.",
      videoUrl: "https://youtube.com/watch?v=example1"
    },
    {
      customer: "Jamshid",
      product: "100 ml EDP",
      comment: "Yoqmasa almashtirish imkoniyati borligi uchun bemalol sinab ko'rdim.",
      videoUrl: ""
    },
    {
      customer: "Aziza",
      product: "10 ml Probnik",
      comment: "Hid juda yaxshi, lekin narx biroz yuqori.",
      videoUrl: "https://youtube.com/watch?v=example2"
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#111111]">Feedback</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.map((feedback, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
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
        ))}
      </div>
    </div>
  )
}

export default FeedbackPage

