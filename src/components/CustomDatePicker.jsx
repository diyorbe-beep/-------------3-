import { useState, useRef, useEffect } from 'react'

function CustomDatePicker({ value, onChange, max, className = '', required = false, name = 'birthDate' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())
  const [inputText, setInputText] = useState(value || '')
  const pickerRef = useRef(null)

  useEffect(() => {
    if (value) {
      const parsed = new Date(value)
      if (!isNaN(parsed)) {
        setSelectedDate(parsed)
        setCurrentMonth(parsed)
      } else {
        setSelectedDate(null)
      }
      setInputText(value)
    } else {
      setSelectedDate(null)
      setInputText('')
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
      return () => document.removeEventListener('mousedown', handleClickOutside)
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
    
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Oldingi oyning oxirgi kunlari
    const prevMonth = new Date(year, month - 1, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false
      })
    }

    // Joriy oyning kunlari
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = date.toDateString() === today.toDateString()
      days.push({
        date,
        isCurrentMonth: true,
        isToday
      })
    }

    // Keyingi oyning birinchi kunlari (42 ta kundan to'ldirish)
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false
      })
    }

    return days
  }

  const handleDateSelect = (day) => {
    if (!day.isCurrentMonth) return
    
    const maxDate = max ? new Date(max) : null
    if (maxDate && day.date > maxDate) return

    setSelectedDate(day.date)
    const formattedDate = day.date.toISOString().split('T')[0]
    setInputText(formattedDate)
    onChange({ target: { name, value: formattedDate } })
    setIsOpen(false)
  }

  const parseManualDate = (text) => {
    const trimmed = text.trim()
    if (!trimmed) {
      setSelectedDate(null)
      onChange({ target: { name, value: '' } })
      return
    }

    let parsed = null

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      parsed = new Date(trimmed)
    } else if (/^\d{2}[./]\d{2}[./]\d{4}$/.test(trimmed)) {
      // DD.MM.YYYY yoki DD/MM/YYYY
      const parts = trimmed.split(/[./]/)
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const year = parseInt(parts[2], 10)
      parsed = new Date(year, month, day)
    }

    if (parsed && !isNaN(parsed)) {
      const maxDate = max ? new Date(max) : null
      if (maxDate && parsed > maxDate) {
        return
      }
      setSelectedDate(parsed)
      setCurrentMonth(parsed)
      const normalized = parsed.toISOString().split('T')[0]
      onChange({ target: { name, value: normalized } })
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    const maxDate = max ? new Date(max) : null
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    if (maxDate && nextMonth > maxDate) return
    setCurrentMonth(nextMonth)
  }

  const formatDisplayDate = () => {
    if (!selectedDate) return ''
    const day = selectedDate.getDate()
    const month = months[selectedDate.getMonth()]
    const year = selectedDate.getFullYear()
    return `${day} ${month} ${year}`
  }

  const days = getDaysInMonth(currentMonth)
  const maxDate = max ? new Date(max) : null

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Input Field + Calendar Icon */}
      <div
        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md sm:rounded-lg focus-within:ring-2 focus-within:ring-gold focus-within:border-transparent transition-all bg-white flex items-center gap-2 ${
          required && !selectedDate ? 'border-red-300' : 'border-gray-300'
        }`}
      >
        <input
          type="text"
          name={name}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value)
            parseManualDate(e.target.value)
          }}
          className="flex-1 bg-transparent outline-none text-sm sm:text-base text-[#111111] placeholder:text-gray-400"
          placeholder="Yil-oy-kun (masalan: 2001-05-12 yoki 12.05.2001)"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 sm:p-2 rounded-md hover:bg-cream transition-colors flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-gold"
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
        </button>
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-[280px] sm:w-[300px] p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 sm:p-2 hover:bg-cream rounded-md sm:rounded-lg transition-colors"
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
              className="p-1.5 sm:p-2 hover:bg-cream rounded-md sm:rounded-lg transition-colors"
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
              <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-600 py-1.5 sm:py-2">
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
                  onChange({ target: { name, value: formattedDate } })
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


