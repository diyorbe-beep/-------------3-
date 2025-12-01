import { useState } from 'react'
import { customersAPI } from '../services/api'

function CustomerAuth({ onLoginSuccess, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        // Login
        if (!formData.phone || !formData.password) {
          setError('Iltimos, barcha maydonlarni to\'ldiring')
          setIsLoading(false)
          return
        }

        const result = await customersAPI.login({
          phone: formData.phone,
          password: formData.password
        })

        if (result.success) {
          // LocalStorage'ga saqlash
          localStorage.setItem('customer', JSON.stringify(result.customer))
          onLoginSuccess(result.customer)
          onClose()
        }
      } else {
        // Register
        if (!formData.phone || !formData.password || !formData.firstName) {
          setError('Iltimos, majburiy maydonlarni to\'ldiring')
          setIsLoading(false)
          return
        }

        // Telefon raqam formatini tekshirish
        const cleanPhone = formData.phone.replace(/\s/g, '').replace(/-/g, '')
        if (!cleanPhone.startsWith('+998') || cleanPhone.length !== 13) {
          setError('Iltimos, to\'g\'ri telefon raqamini kiriting (masalan: +998901234567)')
          setIsLoading(false)
          return
        }

        const result = await customersAPI.register({
          phone: cleanPhone,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName || '',
          email: formData.email || ''
        })

        if (result.success) {
          // LocalStorage'ga saqlash
          localStorage.setItem('customer', JSON.stringify(result.customer))
          onLoginSuccess(result.customer)
          onClose()
        }
      }
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-[#111111] mb-6">
          {isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ism <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Ismingizni kiriting"
                  required={!isLogin}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Familiya
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Familiyangizni kiriting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Email manzilingiz (ixtiyoriy)"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon raqam <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="+998901234567"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parol <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Parolingizni kiriting"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#111111] text-white px-6 py-3 rounded-lg hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Kutilmoqda...' : (isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setFormData({
                phone: '',
                password: '',
                firstName: '',
                lastName: '',
                email: ''
              })
            }}
            className="text-gold hover:text-brown font-medium text-sm transition-colors"
          >
            {isLogin ? 'Ro\'yxatdan o\'tmaganmisiz? Ro\'yxatdan o\'ting' : 'Allaqachon ro\'yxatdan o\'tganmisiz? Kirish'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomerAuth

