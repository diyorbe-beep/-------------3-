import { useState, useEffect } from 'react'
import { surveysAPI } from '../../services/api'
import jsPDF from 'jspdf'

function SurveysPage() {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSurvey, setSelectedSurvey] = useState(null)

  useEffect(() => {
    loadSurveys()
  }, [])

  const loadSurveys = async () => {
    try {
      setLoading(true)
      const data = await surveysAPI.getAll()
      setSurveys(Array.isArray(data) ? data : [])
    } catch (error) {
      setSurveys([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = (survey) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    const labelWidth = 60
    const valueX = margin + labelWidth + 5
    let yPosition = 50

    // Helper function: maydon yozish
    const writeField = (label, value, isMultiline = false) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }

      const textValue = String(value || 'Kiritilmagan').trim()

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 17, 17)
      doc.text(`${label}:`, margin, yPosition)

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(50, 50, 50)

      if (isMultiline || textValue.length > 40) {
        const maxValueWidth = contentWidth - labelWidth - 10
        const lines = doc.splitTextToSize(textValue, maxValueWidth)

        if (lines.length > 0) {
          doc.text(lines[0], valueX, yPosition)
          yPosition += 6
        }

        for (let i = 1; i < lines.length; i++) {
          if (yPosition > pageHeight - 30) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(lines[i], valueX, yPosition)
          yPosition += 6
        }
      } else {
        doc.text(textValue, valueX, yPosition)
        yPosition += 8
      }
      yPosition += 4
    }

    // Sarlavha
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(17, 17, 17)
    doc.text('Surovnoma natijalari', margin, 30)

    // Ma'lumotlar
    writeField('Ism', survey.name)
    const lastName = survey.lastName || survey.last_name
    if (lastName) {
      writeField('Familiya', lastName)
    }
    const middleName = survey.middleName || survey.middle_name
    if (middleName) {
      writeField('Sharif', middleName)
    }
    const birthDate = survey.birthDate || survey.birth_date
    if (birthDate) {
      try {
        const date = new Date(birthDate)
        const formattedBirthDate = date.toLocaleDateString('uz-UZ', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        writeField('Tug\'ilgan sana', formattedBirthDate)
      } catch (e) {
        writeField('Tug\'ilgan sana', birthDate)
      }
    }
    writeField('Yosh', survey.age)
    writeField('Jins', survey.gender)
    writeField('Mavsum', survey.season)
    writeField('Xarakter', Array.isArray(survey.character) ? survey.character.join(', ') : survey.character, true)
    writeField('Yoqtirgan atirlar', survey.favoritePerfumes || survey.favorite_perfumes, true)
    writeField('Yoqtirmaydigan hidlar', survey.dislikedScents || survey.disliked_scents, true)
    writeField('Intensivlik', survey.intensity)
    writeField('Holat', survey.occasion)
    writeField('Telefon', survey.phone)

    // PDF yuklab olish
    const fileName = `surovnoma_${survey.id || Date.now()}.pdf`
    
    // Mobile va Desktop uchun
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Mobile uchun
      const pdfBlob = doc.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      
      // iOS Safari uchun
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const newWindow = window.open()
        if (newWindow) {
          newWindow.location.href = url
        }
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 100)
      } else {
        // Android uchun
        link.click()
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 100)
      }
    } else {
      // Desktop uchun
      doc.save(fileName)
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
        <h1 className="text-3xl font-bold text-[#111111]">Surovnomlar</h1>
        <button
          onClick={loadSurveys}
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-brown transition-colors"
        >
          Yangilash
        </button>
      </div>

      {surveys.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ism</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Yosh</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Jins</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Telefon</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sana</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey) => (
                  <tr key={survey.id} className="border-b border-gray-100 hover:bg-cream/50">
                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{survey.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{survey.age}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{survey.gender}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{survey.phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {survey.createdAt || survey.created_at || survey.date || 'Aniqlanmagan'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedSurvey(survey)}
                          className="text-gold hover:text-brown text-sm font-medium"
                        >
                          Ko'rish
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(survey)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Hozircha surovnomlar yo'q</p>
        </div>
      )}

      {/* Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111111]">Surovnoma ma'lumotlari</h2>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                  <p className="text-gray-900">{selectedSurvey.name}</p>
                </div>
                {(selectedSurvey.lastName || selectedSurvey.last_name) ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Familiya</label>
                    <p className="text-gray-900">{selectedSurvey.lastName || selectedSurvey.last_name}</p>
                  </div>
                ) : null}
                {(selectedSurvey.middleName || selectedSurvey.middle_name) ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sharif</label>
                    <p className="text-gray-900">{selectedSurvey.middleName || selectedSurvey.middle_name}</p>
                  </div>
                ) : null}
                {selectedSurvey.birthDate || selectedSurvey.birth_date ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tug'ilgan sana</label>
                    <p className="text-gray-900">
                      {(() => {
                        try {
                          const date = new Date(selectedSurvey.birthDate || selectedSurvey.birth_date)
                          return date.toLocaleDateString('uz-UZ')
                        } catch (e) {
                          return selectedSurvey.birthDate || selectedSurvey.birth_date
                        }
                      })()}
                    </p>
                  </div>
                ) : null}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yosh</label>
                  <p className="text-gray-900">{selectedSurvey.age}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jins</label>
                  <p className="text-gray-900">{selectedSurvey.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mavsum</label>
                  <p className="text-gray-900">{selectedSurvey.season}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xarakter</label>
                  <p className="text-gray-900">
                    {Array.isArray(selectedSurvey.character) 
                      ? selectedSurvey.character.join(', ') 
                      : selectedSurvey.character || 'Kiritilmagan'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yoqtirgan atirlar</label>
                  <p className="text-gray-900">{selectedSurvey.favoritePerfumes || selectedSurvey.favorite_perfumes || 'Kiritilmagan'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yoqtirmaydigan hidlar</label>
                  <p className="text-gray-900">{selectedSurvey.dislikedScents || selectedSurvey.disliked_scents || 'Kiritilmagan'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intensivlik</label>
                  <p className="text-gray-900">{selectedSurvey.intensity}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Holat</label>
                  <p className="text-gray-900">{selectedSurvey.occasion}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <p className="text-gray-900">{selectedSurvey.phone}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => handleDownloadPDF(selectedSurvey)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  PDF yuklab olish
                </button>
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
