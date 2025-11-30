import { useState, useEffect } from 'react'
import { surveysAPI } from '../../services/api'
import { jsPDF } from 'jspdf'

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
    
    // Sarlavha
    doc.setFontSize(20)
    doc.setTextColor(17, 17, 17)
    doc.setFont('helvetica', 'bold')
    doc.text('HIDIM - Shaxsiy Hid Surovnomasi', pageWidth / 2, 25, { align: 'center' })
    
    // Sana
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    const surveyDate = survey.created_at || survey.createdAt || new Date().toISOString()
    let formattedDate = 'Aniqlanmagan'
    try {
      const date = new Date(surveyDate)
      formattedDate = date.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (e) {
      formattedDate = surveyDate
    }
    doc.text(`Sana: ${formattedDate}`, pageWidth / 2, 35, { align: 'center' })
    
    let yPosition = 50
    
    // Helper function: maydon yozish
    const writeField = (label, value, isMultiline = false) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      
      const textValue = String(value || 'Kiritilmagan').trim()
      
      // Label
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 17, 17)
      doc.text(`${label}:`, margin, yPosition)
      
      // Value
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
    
    // Ma'lumotlar
    writeField('Ism', survey.name)
    
    // Tug'ilgan sana va yosh
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
    writeField('Fasl', survey.season)
    
    // Xarakter
    const character = survey.character || []
    let characterText = 'Kiritilmagan'
    if (Array.isArray(character) && character.length > 0) {
      characterText = character.join(', ')
    } else if (typeof character === 'string' && character.trim()) {
      characterText = character
    }
    writeField('Xarakter', characterText, true)
    
    // Yoqtirgan atirlar
    const favoritePerfumes = survey.favoritePerfumes || survey.favorite_perfumes || ''
    writeField('Yoqtirgan atirlar', favoritePerfumes || 'Kiritilmagan', true)
    
    // Yoqtirmaydigan hidlar
    const dislikedScents = survey.dislikedScents || survey.disliked_scents
    if (dislikedScents && dislikedScents.trim()) {
      writeField('Yoqtirmaydigan hidlar', dislikedScents, true)
    }
    
    // Intensivlik
    writeField('Intensivlik', survey.intensity)
    
    // Holat
    writeField('Holat', survey.occasion)
    
    // Telefon
    writeField('Telefon', survey.phone)
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.setFont('helvetica', 'normal')
      const footerY = pageHeight - 10
      doc.text('HIDIM - Shaxsiy parfum brendi', pageWidth / 2, footerY - 5, { align: 'center' })
      doc.text('www.hidim.uz | @hidim_parfum', pageWidth / 2, footerY, { align: 'center' })
    }
    
    // PDF yuklab olish
    const safeName = (survey.name || 'Foydalanuvchi').replace(/[^a-zA-Z0-9А-Яа-яЁё]/g, '_').substring(0, 20)
    const safeDate = formattedDate.replace(/[^0-9]/g, '-')
    const fileName = `HIDIM_Surovnoma_${safeName}_${safeDate}.pdf`
    
    try {
      const pdfBlob = doc.output('blob')
      const blobUrl = URL.createObjectURL(pdfBlob)
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const isAndroid = /Android/.test(navigator.userAgent)
      const isMobile = isIOS || isAndroid || window.innerWidth < 768
      
      if (isIOS) {
        const newWindow = window.open(blobUrl, '_blank')
        if (!newWindow) {
          const pdfDataUri = doc.output('datauristring')
          window.location.href = pdfDataUri
        } else {
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl)
          }, 1000)
        }
      } else if (isMobile) {
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        
        const touchEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1
        })
        
        link.dispatchEvent(touchEvent)
        
        setTimeout(() => {
          try {
            link.click()
          } catch (e) {
            window.open(blobUrl, '_blank')
          }
        }, 50)
        
        setTimeout(() => {
          if (link.parentNode) {
            document.body.removeChild(link)
          }
          URL.revokeObjectURL(blobUrl)
        }, 500)
      } else {
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(blobUrl)
        }, 100)
      }
    } catch (error) {
      try {
        doc.save(fileName)
      } catch (saveError) {
        alert('PDF yuklab olishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
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
      <h1 className="text-3xl font-bold text-[#111111]">Surovnomlar</h1>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ism</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yosh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sana</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {surveys.length > 0 ? (
              surveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111111]">
                    {survey.name || 'Noma\'lum'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {survey.age || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {survey.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {survey.createdAt || survey.created_at || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSurvey(survey)}
                        className="text-gold hover:text-brown font-medium"
                      >
                        Ko'rish
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(survey)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  Surovnomlar topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {surveys.length > 0 ? (
          surveys.map((survey) => (
            <div key={survey.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Ism</p>
                  <p className="text-sm font-medium text-[#111111]">{survey.name || 'Noma\'lum'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Yosh</p>
                  <p className="text-sm text-gray-700">{survey.age || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Telefon</p>
                  <p className="text-sm text-gray-700">{survey.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sana</p>
                  <p className="text-sm text-gray-700">{survey.createdAt || survey.created_at || '-'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSurvey(survey)}
                  className="flex-1 px-3 py-2 bg-gold text-white rounded-lg hover:bg-brown text-sm font-medium"
                >
                  Ko'rish
                </button>
                <button
                  onClick={() => handleDownloadPDF(survey)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  PDF
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            Surovnomlar topilmadi
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#111111]">Surovnoma tafsilotlari</h2>
              <button
                onClick={() => setSelectedSurvey(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Ism</p>
                <p className="text-base text-[#111111] mt-1">{selectedSurvey.name || 'Noma\'lum'}</p>
              </div>
              {(selectedSurvey.birthDate || selectedSurvey.birth_date) && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Tug'ilgan sana</p>
                  <p className="text-base text-[#111111] mt-1">
                    {(() => {
                      try {
                        const date = new Date(selectedSurvey.birthDate || selectedSurvey.birth_date)
                        return date.toLocaleDateString('uz-UZ', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })
                      } catch (e) {
                        return selectedSurvey.birthDate || selectedSurvey.birth_date
                      }
                    })()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Yosh</p>
                <p className="text-base text-[#111111] mt-1">{selectedSurvey.age || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Jins</p>
                <p className="text-base text-[#111111] mt-1">{selectedSurvey.gender || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fasl</p>
                <p className="text-base text-[#111111] mt-1">{selectedSurvey.season || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Xarakter</p>
                <p className="text-base text-[#111111] mt-1">
                  {Array.isArray(selectedSurvey.character) 
                    ? selectedSurvey.character.join(', ') 
                    : selectedSurvey.character || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Yoqtirgan atirlar</p>
                <p className="text-base text-[#111111] mt-1">
                  {selectedSurvey.favoritePerfumes || selectedSurvey.favorite_perfumes || '-'}
                </p>
              </div>
              {selectedSurvey.dislikedScents || selectedSurvey.disliked_scents ? (
                <div>
                  <p className="text-sm font-medium text-gray-500">Yoqtirmaydigan hidlar</p>
                  <p className="text-base text-[#111111] mt-1">
                    {selectedSurvey.dislikedScents || selectedSurvey.disliked_scents}
                  </p>
                </div>
              ) : null}
              <div>
                <p className="text-sm font-medium text-gray-500">Intensivlik</p>
                <p className="text-base text-[#111111] mt-1">{selectedSurvey.intensity || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Holat</p>
                <p className="text-base text-[#111111] mt-1">{selectedSurvey.occasion || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telefon</p>
                <p className="text-base text-[#111111] mt-1">{selectedSurvey.phone || '-'}</p>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => handleDownloadPDF(selectedSurvey)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                PDF yuklab olish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SurveysPage
