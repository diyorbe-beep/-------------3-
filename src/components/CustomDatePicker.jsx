import { useState, useRef, useEffect } from 'react'

function CustomDatePicker({ value, onChange, max, className = '', required = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)
  const pickerRef = useRef(null)

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value))
      setCurrentMonth(new Date(value))
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ]

  const weekDays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    // Hafta Dushanba bilan boshlanadi
    const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1

    const days = []
    
    // Oldingi oyning oxirgi kunlari
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = adjustedStartingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false
      })
    }
    
    // Joriy oyning kunlari
    const today = new Date()
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString()
      })
    }
    
    // Keyingi oyning birinchi kunlari (to'ldirish uchun)
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false
      })
    }
    
    return days
  }

  const handleDateSelect = (date) => {
    if (!date.isCurrentMonth) return
    
    const maxDate = max ? new Date(max) : null
    if (maxDate && date.date > maxDate) return

    setSelectedDate(date.date)
    const formattedDate = date.date.toISOString().split('T')[0]
    onChange({ target: { name: 'birthDate', value: formattedDate } })
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const formatDisplayDate = () => {
    if (!selectedDate) return ''
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const year = selectedDate.getFullYear()
    return `${day}.${month}.${year}`
  }

  const days = getDaysInMonth(currentMonth)
  const maxDate = max ? new Date(max) : null

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all cursor-pointer bg-white flex items-center justify-between text-sm sm:text-base ${
          required && !selectedDate ? 'border-red-300' : 'border-gray-300'
        }`}
      >
        <span className={selectedDate ? 'text-[#111111]' : 'text-gray-400'}>
          {selectedDate ? formatDisplayDate() : 'Yil-oy-kun'}
        </span>
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-full max-w-[280px] sm:max-w-[300px] p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 sm:p-2 hover:bg-cream rounded-lg transition-colors"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-base sm:text-lg font-semibold text-[#111111]">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-1.5 sm:p-2 hover:bg-cream rounded-lg transition-colors disabled:opacity-50"
              type="button"
              disabled={maxDate && currentMonth.getMonth() >= maxDate.getMonth() && currentMonth.getFullYear() >= maxDate.getFullYear()}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-600 py-1 sm:py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {days.map((day, index) => {
              const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString()
              const isDisabled = !day.isCurrentMonth || (maxDate && day.date > maxDate)
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={isDisabled}
                  className={`
                    aspect-square flex items-center justify-center text-xs sm:text-sm rounded-md sm:rounded-lg transition-all min-h-[32px] sm:min-h-[36px]
                    ${isSelected
                      ? 'bg-gold text-white font-semibold'
                      : day.isToday
                      ? 'bg-cream text-[#111111] font-semibold border-2 border-gold'
                      : day.isCurrentMonth
                      ? 'text-[#111111] hover:bg-cream'
                      : 'text-gray-300 cursor-not-allowed'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {day.date.getDate()}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                const today = new Date()
                if (!maxDate || today <= maxDate) {
                  setSelectedDate(today)
                  setCurrentMonth(today)
                  const formattedDate = today.toISOString().split('T')[0]
                  onChange({ target: { name: 'birthDate', value: formattedDate } })
                  setIsOpen(false)
                }
              }}
              className="text-xs sm:text-sm text-gold hover:text-brown font-medium transition-colors px-2 py-1"
              type="button"
            >
              Bugun
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs sm:text-sm text-gray-600 hover:text-[#111111] font-medium transition-colors px-2 py-1"
              type="button"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomDatePicker

