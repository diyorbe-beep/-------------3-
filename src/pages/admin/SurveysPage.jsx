import { useState, useEffect } from 'react'
import { surveysAPI } from '../../services/api'
import jsPDF from 'jspdf'

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
      // Agar data array bo'lmasa, bo'sh array qaytaramiz
      setSurveys(Array.isArray(data) ? data : [])
    } catch (error) {
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

  // PDF yuklab olish funksiyasi
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
    
    // Helper function: maydon yozish (jadval ko'rinishida)
    const writeField = (label, value, isMultiline = false) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      
      const textValue = String(value || 'Kiritilmagan').trim()
      
      // Label (qalin shrift)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 17, 17)
      doc.text(`${label}:`, margin, yPosition)
      
      // Value (oddiy shrift)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(50, 50, 50)
      
      if (isMultiline || textValue.length > 40) {
        // Uzun matnlar uchun qatorlarga bo'lish
        const maxValueWidth = contentWidth - labelWidth - 10
        const lines = doc.splitTextToSize(textValue, maxValueWidth)
        
        // Birinchi qator
        if (lines.length > 0) {
          doc.text(lines[0], valueX, yPosition)
          yPosition += 6
        }
        
        // Qolgan qatorlar
        for (let i = 1; i < lines.length; i++) {
          if (yPosition > pageHeight - 30) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(lines[i], valueX, yPosition)
          yPosition += 6
        }
      } else {
        // Qisqa matnlar
        doc.text(textValue, valueX, yPosition)
        yPosition += 8
      }
      
      yPosition += 4 // Maydonlar orasidagi bo'sh joy
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
    
    // Footer (har bir sahifada)
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
    
    // PDF yuklab olish - mobil brauzerlar uchun optimallashtirilgan
    const safeName = (survey.name || 'Foydalanuvchi').replace(/[^a-zA-Z0-9А-Яа-яЁё]/g, '_').substring(0, 20)
    const safeDate = formattedDate.replace(/[^0-9]/g, '-')
    const fileName = `HIDIM_Surovnoma_${safeName}_${safeDate}.pdf`
    
    // Mobil brauzerlar uchun Blob va URL.createObjectURL ishlatish
    try {
      // iOS Safari aniqlash
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const isAndroid = /Android/.test(navigator.userAgent)
      const isMobile = isIOS || isAndroid || window.innerWidth < 768
      
      if (isIOS) {
        // iOS Safari uchun data URI ishlatish
        // iOS Safari'da to'g'ridan-to'g'ri yuklab olish qiyin, shuning uchun yangi oynada ochamiz
        const pdfDataUri = doc.output('datauristring')
        
        // Yangi oynada PDF ni ko'rsatish
        const newWindow = window.open('', '_blank')
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${fileName}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #f5f5f5;
                    padding: 20px;
                  }
                  .container {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 100%;
                  }
                  h1 {
                    color: #111;
                    margin-bottom: 15px;
                    font-size: 20px;
                  }
                  p {
                    color: #666;
                    margin-bottom: 15px;
                    font-size: 14px;
                    line-height: 1.5;
                  }
                  .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background: #111;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 10px 0;
                    font-size: 16px;
                  }
                  iframe {
                    width: 100%;
                    height: 70vh;
                    border: 1px solid #ddd;
                    margin-top: 20px;
                    border-radius: 5px;
                  }
                  .instructions {
                    background: #fff3cd;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                    font-size: 13px;
                    color: #856404;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>PDF yuklab olish</h1>
                  <p>PDF fayl tayyor. Yuklab olish uchun quyidagi tugmani bosing:</p>
                  <a href="${pdfDataUri}" download="${fileName}" class="button">📥 PDF yuklab olish</a>
                  <iframe src="${pdfDataUri}"></iframe>
                  <div class="instructions">
                    <strong>Yuklab olish:</strong><br>
                    1. PDF'ni ko'rib chiqing<br>
                    2. Brauzerning "Share" tugmasini bosing (pastki o'ng burchak)<br>
                    3. "Save to Files" yoki "Add to Photos" ni tanlang
                  </div>
                </div>
              </body>
            </html>
          `)
          newWindow.document.close()
        } else {
          // Agar pop-up blokirovka qilingan bo'lsa, data URI ni to'g'ridan-to'g'ri ochish
          window.location.href = pdfDataUri
        }
      } else if (isMobile) {
        // Android va boshqa mobil brauzerlar uchun
        const pdfBlob = doc.output('blob')
        const url = URL.createObjectURL(pdfBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 100)
      } else {
        // Desktop brauzerlar uchun
        const pdfBlob = doc.output('blob')
        const url = URL.createObjectURL(pdfBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 100)
      }
    } catch (error) {
      // Fallback: oddiy save metodi
      try {
        doc.save(fileName)
      } catch (fallbackError) {
        // Eng oxirgi fallback: data URI
        try {
          const pdfDataUri = doc.output('datauristring')
          const link = document.createElement('a')
          link.href = pdfDataUri
          link.download = fileName
          link.target = '_blank'
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          setTimeout(() => {
            if (link.parentNode) {
              document.body.removeChild(link)
            }
          }, 100)
        } catch (finalError) {
          alert('PDF yuklab olishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring yoki boshqa brauzerda sinab ko\'ring.')
        }
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
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#111111]">So'rovlar (Surovnomalar)</h1>
        <button
          onClick={loadSurveys}
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-brown transition-colors font-medium text-sm lg:text-base whitespace-nowrap"
        >
          🔄 Yangilash
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <h2 className="text-base lg:text-lg font-semibold text-[#111111] mb-4">Filtrlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
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
        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredSurveys.length > 0 ? (
            filteredSurveys.map((survey) => (
              <div key={survey.id} className="p-4 space-y-2 hover:bg-cream/50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">ID</p>
                    <p className="text-sm font-medium text-gray-900">#{String(survey.id).substring(0, 8)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSurvey(survey)}
                      className="px-2 py-1 text-xs bg-gold text-white rounded hover:bg-brown"
                    >
                      Ko'rish
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(survey)}
                      className="px-2 py-1 text-xs bg-[#111111] text-white rounded hover:bg-gray-700 flex items-center gap-1"
                      title="PDF yuklab olish"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ism</p>
                  <p className="text-sm font-medium text-gray-900">{survey.name || 'Aniqlanmagan'}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Telefon</p>
                    <p className="text-sm text-gray-900">{survey.phone || 'Aniqlanmagan'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Yosh</p>
                    <p className="text-sm text-gray-900">{survey.age || 'Aniqlanmagan'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Jins</p>
                    <p className="text-sm text-gray-900">{survey.gender || 'Aniqlanmagan'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sana</p>
                    <p className="text-sm text-gray-900">{formatDate(survey.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">So'rovlar topilmadi</div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
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
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedSurvey(survey)}
                          className="text-gold hover:text-brown text-sm font-medium"
                        >
                          Ko'rish
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(survey)}
                          className="text-[#111111] hover:text-gold text-sm font-medium flex items-center gap-1"
                          title="PDF yuklab olish"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDF
                        </button>
                      </div>
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
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-[#111111]">So'rov ma'lumotlari</h2>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl lg:text-3xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
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

              <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row justify-end gap-2 lg:gap-3">
                <button
                  onClick={() => handleDownloadPDF(selectedSurvey)}
                  className="w-full sm:w-auto px-4 lg:px-6 py-2 bg-white border-2 border-[#111111] text-[#111111] rounded-lg hover:bg-cream transition-colors flex items-center justify-center gap-2 text-sm lg:text-base"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF yuklab olish
                </button>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="w-full sm:w-auto px-4 lg:px-6 py-2 bg-[#111111] text-white rounded-lg hover:bg-gold transition-colors text-sm lg:text-base"
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



