import { useState } from 'react'
import { surveysAPI } from './services/api'
import './App.css'

function Survey({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    birthDate: '',
    gender: '',
    season: '',
    character: [],
    favoritePerfumes: '',
    dislikedScents: '',
    intensity: '',
    occasion: '',
    phone: ''
  })

  // Tug'ilgan sanadan yoshni hisoblash
  const calculateAge = (birthDate) => {
    if (!birthDate) return ''
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age > 0 ? age.toString() : ''
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      }
      // Agar tug'ilgan sana o'zgarsa, yoshni avtomatik hisobla
      if (name === 'birthDate') {
        updated.age = calculateAge(value)
      }
      return updated
    })
  }

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      character: checked
        ? [...prev.character, value]
        : prev.character.filter(item => item !== value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await surveysAPI.create(formData)
      alert('Surovnoma muvaffaqiyatli yuborildi! Tez orada sizga mos hid yo\'nalishi bilan bog\'lanamiz.')
      setFormData({
        name: '',
        age: '',
        birthDate: '',
        gender: '',
        season: '',
        character: [],
        favoritePerfumes: '',
        dislikedScents: '',
        intensity: '',
        occasion: '',
        phone: ''
      })
    } catch (error) {
      alert('Surovnoma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-[#111111]">HIDIM</h1>
              <p className="text-xs text-gray-600">Shaxsiy parfum brendi</p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="text-[#111111] hover:text-gold transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ortga qaytish
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
              Shaxsiy hid tanlash uchun qisqa surovnoma
            </h1>
            <p className="text-lg text-gray-700">
              Javoblaringiz asosida sizga mos hid yo'nalishi aniqlanadi.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Ismingiz */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Ismingiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Ismingizni kiriting"
                />
              </div>

              {/* 2. Tug'ilgan sana */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Tug'ilgan sana <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  required
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]} // Bugungi kundan oldingi sana
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                />
                {formData.age && (
                  <p className="mt-2 text-sm text-gray-600">
                    Yoshingiz: <span className="font-semibold">{formData.age} yosh</span>
                  </p>
                )}
              </div>

              {/* 3. Jins */}
              <div>
                <label className="block text-sm font-medium mb-3 text-[#111111]">
                  Jins <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="erkak"
                      required
                      checked={formData.gender === 'erkak'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-gold focus:ring-gold"
                    />
                    <span className="text-gray-700">Erkak</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="ayol"
                      required
                      checked={formData.gender === 'ayol'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-gold focus:ring-gold"
                    />
                    <span className="text-gray-700">Ayol</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="boshqa"
                      required
                      checked={formData.gender === 'boshqa'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-gold focus:ring-gold"
                    />
                    <span className="text-gray-700">Boshqa/aytmaslik</span>
                  </label>
                </div>
              </div>

              {/* 4. Fasl */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Qaysi faslga mos hid yoqtirasiz? <span className="text-red-500">*</span>
                </label>
                <select
                  name="season"
                  required
                  value={formData.season}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                >
                  <option value="">Tanlang</option>
                  <option value="yoz">Yoz</option>
                  <option value="qish">Qish</option>
                  <option value="bahor">Bahor</option>
                  <option value="kuz">Kuz</option>
                  <option value="universal">Universal</option>
                </select>
              </div>

              {/* 5. Xarakter */}
              <div>
                <label className="block text-sm font-medium mb-3 text-[#111111]">
                  Xarakteringizni tasvirlang (bir nechta belgilash mumkin) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Lider', 'Sokin', 'Energetik', 'Romantik', 'Minimalist', 'Jiddiy', 'Sportchi'].map((char) => (
                    <label key={char} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                      <input
                        type="checkbox"
                        value={char.toLowerCase()}
                        checked={formData.character.includes(char.toLowerCase())}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-gold focus:ring-gold rounded"
                      />
                      <span className="text-gray-700">{char}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Yoqtirgan atirlar */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Siz yoqtirgan atirlar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="favoritePerfumes"
                  required
                  value={formData.favoritePerfumes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Masalan: Sauvage, Bleu de Chanel…"
                />
              </div>

              {/* 7. Yoqtirmaydigan hidlar */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Siz yoqtirmaydigan hidlar <span className="text-gray-400 text-xs">(ixtiyoriy)</span>
                </label>
                <input
                  type="text"
                  name="dislikedScents"
                  value={formData.dislikedScents}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Masalan: o'tkir, shirin hidlar..."
                />
              </div>

              {/* 8. Intensivlik */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Intensivlik darajasi <span className="text-red-500">*</span>
                </label>
                <select
                  name="intensity"
                  required
                  value={formData.intensity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                >
                  <option value="">Tanlang</option>
                  <option value="yengil">Yengil</option>
                  <option value="ortacha">O'rtacha</option>
                  <option value="kuchli">Kuchli</option>
                  <option value="premium">Premium uzoq turuvchi</option>
                </select>
              </div>

              {/* 9. Holat */}
              <div>
                <label className="block text-sm font-medium mb-3 text-[#111111]">
                  Atir sizga qaysi holat uchun kerak? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {['Kundalik', 'Ish', 'Uchrashuv', 'Kechki tadbir', 'Sovg\'a sifatida'].map((occ) => (
                    <label key={occ} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="occasion"
                        value={occ.toLowerCase()}
                        required
                        checked={formData.occasion === occ.toLowerCase()}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-gold focus:ring-gold"
                      />
                      <span className="text-gray-700">{occ}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 10. Telefon */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Telefon raqamingiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    // Faqat raqam va + belgisini qoldiramiz
                    let value = e.target.value.replace(/[^0-9+]/g, '')
                    
                    // Agar + bo'lmasa va raqam 998 bilan boshlansa, avtomatik + qo'shamiz
                    if (!value.startsWith('+') && value.startsWith('998')) {
                      value = '+' + value
                    }
                    
                    // + faqat boshida bo'lishi kerak
                    const cleanValue = value.startsWith('+') 
                      ? '+' + value.slice(1).replace(/[^0-9]/g, '')
                      : value.replace(/[^0-9]/g, '')
                    setFormData({ ...formData, phone: cleanValue })
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="+998901234567"
                  pattern="\+998[0-9]{9}"
                  maxLength="13"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-[#111111] text-white px-8 py-4 rounded-lg hover:bg-gold transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Natijani olish
                </button>
              </div>
            </form>

            {/* Footer Text */}
            <p className="text-center text-xs text-gray-500 mt-8 pt-6 border-t border-gray-200">
              HIDIM – Shaxsiy hid platformasi. Ma'lumotlaringiz maxfiy saqlanadi.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Survey


