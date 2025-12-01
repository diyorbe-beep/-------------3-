import { useState, useEffect, useRef } from 'react'
import { ordersAPI, customersAPI } from './services/api'
import { PRICES, PRODUCTS, PRODUCT_MAP, PRICE_MAP } from './constants/prices'
import './App.css'
import Survey from './Survey.jsx'
import AdminPanel from './pages/admin/AdminPanel.jsx'
import GoogleLoginButtonWrapper from './components/GoogleLoginButtonWrapper.jsx'
import probnik from './assets/image.png'

function LandingPage({ onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    comment: ''
  })
  const [showSignUp, setShowSignUp] = useState(false)
  const [signUpData, setSignUpData] = useState({
    name: '',
    phone: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [googleUserInfo, setGoogleUserInfo] = useState(null)
  const [phoneForGoogle, setPhoneForGoogle] = useState('')
  const hasNavigatedRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // LandingPage komponentida URL parametrlarini tekshirish kerak emas,
  // chunki bu App komponentida boshqariladi

  // Logotipga 5 marta bosish orqali admin panelga kirish
  const handleLogoClick = () => {
    const newCount = logoClickCount + 1
    setLogoClickCount(newCount)
    
    if (newCount >= 5) {
      setLogoClickCount(0)
      onNavigate('admin')
    } else {
      // 3 soniyadan keyin reset qilish
      setTimeout(() => {
        setLogoClickCount(0)
      }, 3000)
    }
  }

  // Google OAuth login funksiyasi - GoogleLoginButton komponenti orqali ishlaydi
  const handleGoogleLoginSuccess = async (userInfo) => {
    // Telefon raqam so'rash modalini ko'rsatish
    setGoogleUserInfo(userInfo)
    setShowPhoneModal(true)
  }

  // Google orqali ro'yxatdan o'tganda telefon raqamni saqlash
  const handleSaveGooglePhone = async () => {
    if (!phoneForGoogle || !phoneForGoogle.startsWith('+998') || phoneForGoogle.length !== 13) {
      alert('Iltimos, to\'g\'ri telefon raqamini kiriting (masalan: +998901234567)')
      return
    }

    try {
      setIsLoading(true)
      // Mijozni yaratish yoki yangilash
      const customer = await customersAPI.create({
        name: googleUserInfo.name || 'Foydalanuvchi',
        email: googleUserInfo.email || '',
        phone: phoneForGoogle,
        gender: '',
        age: '',
        orders: 0,
        profile: ''
      })
      
      // Google orqali ro'yxatdan o'tganda avtomatik buyurtma yaratish
      try {
        const orderData = {
          customer: googleUserInfo.name || 'Foydalanuvchi',
          phone: phoneForGoogle,
          email: googleUserInfo.email || '',
          product: PRODUCTS.PROBNIK_10ML, // Default probnik
          price: PRICES.PROBNIK_10ML,
          comment: 'Google orqali ro\'yxatdan o\'tish',
          status: 'Yangi',
          date: new Date().toISOString().split('T')[0]
        }
        
        const orderResult = await ordersAPI.create(orderData)
      } catch (orderError) {
        // Buyurtma yaratilmagan bo'lsa ham davom etamiz
      }
      
      alert('Buyurtma qoldirildi! Tez orada siz bilan bog\'lanamiz.')
      setShowPhoneModal(false)
      setPhoneForGoogle('')
      setGoogleUserInfo(null)
      setShowSignUp(false)
    } catch (error) {
      // Agar mijoz allaqachon mavjud bo'lsa, telefon raqamni yangilash
      if (error.message && error.message.includes('already exists')) {
        // Mijozni topib, telefon raqamni yangilash
        try {
          const customers = await customersAPI.getAll()
          const existingCustomer = customers.find(c => c.email === googleUserInfo.email)
          if (existingCustomer) {
            await customersAPI.update(existingCustomer.id, { phone: phoneForGoogle })
          }
          
          // Google orqali ro'yxatdan o'tganda avtomatik buyurtma yaratish
          try {
            const orderData = {
              customer: googleUserInfo.name || 'Foydalanuvchi',
              phone: phoneForGoogle,
              email: googleUserInfo.email || '',
              product: PRODUCTS.PROBNIK_10ML, // Default probnik
              price: PRICES.PROBNIK_10ML,
              comment: 'Google orqali ro\'yxatdan o\'tish',
              status: 'Yangi',
              date: new Date().toISOString().split('T')[0]
            }
            
            const orderResult = await ordersAPI.create(orderData)
          } catch (orderError) {
            // Buyurtma yaratilmagan bo'lsa ham davom etamiz
          }
        } catch (updateError) {
        }
        alert('Buyurtma qoldirildi! Tez orada siz bilan bog\'lanamiz.')
      } else {
        alert('Ro\'yxatdan o\'tishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
      }
      setShowPhoneModal(false)
      setPhoneForGoogle('')
      setGoogleUserInfo(null)
      setShowSignUp(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLoginError = (error) => {
    alert('Google orqali ro\'yxatdan o\'tishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Agar email bo'lsa, mijozni topib telefon raqamini olish
      let phoneToUse = formData.phone
      let customerName = formData.name
      
      if (formData.email) {
        try {
          const customers = await customersAPI.getAll()
          const customer = customers.find(c => c.email === formData.email)
          if (customer) {
            if (customer.phone) {
              phoneToUse = customer.phone
            }
            if (customer.name) {
              customerName = customer.name
            }
          }
        } catch (error) {
        }
      }

      // Telefon raqam bo'lmasa, xatolik
      if (!phoneToUse || phoneToUse.trim() === '') {
        alert('Iltimos, telefon raqamingizni kiriting.')
        return
      }

      const orderData = {
        customer: customerName,
        phone: phoneToUse,
        email: formData.email || '',
        product: PRODUCT_MAP[formData.product] || formData.product,
        price: PRICE_MAP[formData.product] || '',
        comment: formData.comment || '',
        status: 'Yangi',
        date: new Date().toISOString().split('T')[0] // Sana qo'shamiz
      }
      
      const result = await ordersAPI.create(orderData)
      
      // Buyurtma yuborilgandan keyin, admin panelga xabar berish
      if (result && result.id) {
      }
      
      alert('Buyurtma qoldirdi! Tez orada siz bilan bog\'lanamiz.')
      setFormData({ name: '', email: '', phone: '', product: '', comment: '' })
    } catch (error) {
      alert('Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    
    // Telefon raqam formatini tekshirish
    const phoneRegex = /^\+998[0-9]{9}$/
    if (!phoneRegex.test(signUpData.phone)) {
      alert('Iltimos, to\'g\'ri telefon raqamini kiriting (masalan: +998901234567)')
      return
    }
    
    // Mijozni yaratish
    try {
      setIsLoading(true)
      await customersAPI.create({
        name: signUpData.name,
        email: '',
        phone: signUpData.phone,
        gender: '',
        age: '',
        orders: 0,
        profile: ''
      })
      
      alert('Ro\'yxatdan muvaffaqiyatli o\'tdingiz! Xush kelibsiz!')
      setSignUpData({ name: '', phone: '', password: '' })
      setShowSignUp(false)
    } catch (error) {
      alert('Ro\'yxatdan o\'tishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-md' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleLogoClick}
              className="flex flex-col hover:opacity-80 transition-opacity cursor-pointer"
              title={logoClickCount > 0 ? `${5 - logoClickCount} marta qoldi` : ''}
            >
              <h1 className="text-2xl font-bold text-[#111111]">HIDIM</h1>
              <p className="text-xs text-gray-600">Shaxsiy parfum brendi</p>
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('hero')} className="text-sm hover:text-gold transition-colors">
                Asosiy
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm hover:text-gold transition-colors">
                Qanday ishlaydi?
              </button>
              <button onClick={() => scrollToSection('sample')} className="text-sm hover:text-gold transition-colors">
                Probnik
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm hover:text-gold transition-colors">
                Narxlar
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-sm hover:text-gold transition-colors">
                Savollar
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-sm hover:text-gold transition-colors">
                Bog'lanish
              </button>
            </nav>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('survey')}
                className="hidden md:block bg-[#111111] text-white px-4 py-2.5 rounded-lg text-sm hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2 group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Surovnoma boshlash</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-[#111111] p-2 rounded-lg hover:bg-cream transition-colors"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col gap-4 pt-4">
                <button onClick={() => scrollToSection('hero')} className="text-left text-sm hover:text-gold transition-colors">
                  Asosiy
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-left text-sm hover:text-gold transition-colors">
                  Qanday ishlaydi?
                </button>
                <button onClick={() => scrollToSection('sample')} className="text-left text-sm hover:text-gold transition-colors">
                  Probnik
                </button>
                <button onClick={() => scrollToSection('pricing')} className="text-left text-sm hover:text-gold transition-colors">
                  Narxlar
                </button>
                <button onClick={() => scrollToSection('faq')} className="text-left text-sm hover:text-gold transition-colors">
                  Savollar
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-left text-sm hover:text-gold transition-colors">
                  Bog'lanish
                </button>
                <button
                  onClick={() => onNavigate('survey')}
                  className="bg-[#111111] text-white px-4 py-2.5 rounded-lg text-sm hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2 group mt-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Surovnoma boshlash</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-16 px-4 bg-gradient-to-b from-white to-cream">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-[#111111]">
                HIDIM — Sizga mos shaxsiy hid
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6">
                Hid sizniki. Xarakter sizniki. Atir bizdan.
              </p>
              <ul className="text-gray-700 space-y-2 mb-8 text-left inline-block md:block">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>30 soniyalik surovnoma</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>10 ml probnik — {PRICES.PROBNIK_10ML} so'm</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Yoqsa — 50/100 ml shaxsiy atir</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              
              </div>
            </div>
            <div className="bg-cream p-8 rounded-lg shadow-lg text-center">
              <div className="w-48 h-64 bg-gold/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <img src={probnik} alt="HIDIM 10 ml PROBNIK" className="max-w-full max-h-full object-contain" />
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-2">HIDIM 10 ml PROBNIK</h3>
              <p className="text-gray-700 mb-4">Sizga mos hidni avval sinab ko'ring.</p>
              <button
                onClick={() => scrollToSection('sample')}
                className="bg-[#111111] text-white px-6 py-2.5 rounded-lg text-sm hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2 group"
              >
                <span>Batafsil</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#111111]">
            HIDIM qanday ishlaydi?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-cream p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-semibold mb-3 text-[#111111]">1. Qisqa surovnoma</h3>
              <p className="text-gray-700">
                Yoshi, xarakteringiz va yoqtirgan atirlaringiz haqida bir nechta savollarga javob berasiz.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-semibold mb-3 text-[#111111]">2. Shaxsiy hid profili</h3>
              <p className="text-gray-700">
                Javoblaringiz asosida sizga mos hid yo'nalishi tanlanadi.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-semibold mb-3 text-[#111111]">3. Probnik va flakon</h3>
              <p className="text-gray-700">
                Avval 10 ml probnikni sinab ko'rasiz, yoqsa 50 yoki 100 ml flakon buyurtma qilasiz.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('survey')}
              className="bg-[#111111] text-white px-8 py-3.5 rounded-lg hover:bg-gold transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Surovnoma boshlash</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Sample Block Section */}
      <section id="sample" className="py-20 px-4 bg-cream">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#111111]">
            10 ml PROBNIK – ishonchli start
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Yangi hidni darrov qimmat flakonda emas, avval kichik probnikda sinab ko'ring.
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#111111]">10 ml PROBNIK — {PRICES.PROBNIK_10ML} so'm</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Kiyimda bir necha kun saqlanadigan hid</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>20+ hid yo'nalishidan tanlov</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Hid yoqmasa — 2-probnik faqat {PRICES.PROBNIK_2ND} so'm</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Video fikr yuborsangiz — 10% chegirma</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="aspect-square bg-cream rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    <img src={probnik} alt="Probnik" className="w-full h-full object-contain" />
                  </p>
                </div>
              </div>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-[#111111] text-white px-6 py-3.5 rounded-lg hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Probnik buyurtma qilish</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fragrance Directions Section */}
      <section id="directions" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#111111]">
            HIDIM hid yo'nalishlari
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-cream p-6 rounded-lg shadow-sm text-center">
              <span className="text-4xl mb-4 block">🌿</span>
              <h3 className="text-xl font-semibold mb-2 text-[#111111]">Fresh</h3>
              <p className="text-gray-700">
                Sauvage, Bleu de Chanel ruhidagi toza, yangicha, energiyali hidlar.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-sm text-center">
              <span className="text-4xl mb-4 block">🍯</span>
              <h3 className="text-xl font-semibold mb-2 text-[#111111]">Sweet & Oriental</h3>
              <p className="text-gray-700">
                Vanilla, amber, oud notalari bilan issiq, chiroyli hidi yo'nalishlari.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-sm text-center">
              <span className="text-4xl mb-4 block">🌊</span>
              <h3 className="text-xl font-semibold mb-2 text-[#111111]">Ocean & Marine</h3>
              <p className="text-gray-700">
                Megamare va dengiz shamoli uslubida nam, sho'r, sof hidlar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-cream">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#111111]">
            Narxlar
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Probnik Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center relative">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full">
                Yangi mijozlar uchun
              </span>
              <h3 className="text-xl font-semibold mb-2 text-[#111111]">10 ml Probnik</h3>
              <p className="text-4xl font-bold text-gold mb-2">{PRICES.PROBNIK_10ML} so'm</p>
              <p className="text-sm text-gray-600 mb-6">2-probnik — {PRICES.PROBNIK_2ND} so'm</p>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-[#111111] text-white px-6 py-3.5 rounded-lg hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Buyurtma berish</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 50 ml EDP Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center relative">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111111] text-white text-xs font-semibold px-3 py-1 rounded-full">
                Eng ommabop
              </span>
              <h3 className="text-xl font-semibold mb-2 text-[#111111]">50 ml Eau de Parfum</h3>
              <p className="text-4xl font-bold text-gold mb-2">{PRICES.EDP_50ML} so'm</p>
              <p className="text-sm text-gray-600 mb-6">Sizga mos shaxsiy hid asosida tayyorlanadi.</p>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-[#111111] text-white px-6 py-3.5 rounded-lg hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Buyurtma berish</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 100 ml EDP Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center relative">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brown text-white text-xs font-semibold px-3 py-1 rounded-full">
                Premium
              </span>
              <h3 className="text-xl font-semibold mb-2 text-[#111111]">100 ml Eau de Parfum</h3>
              <p className="text-4xl font-bold text-gold mb-2">{PRICES.EDP_100ML} so'm</p>
              <p className="text-sm text-gray-600 mb-6">Oilaviy yoki uzoq muddat foydalanish uchun.</p>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-[#111111] text-white px-6 py-3.5 rounded-lg hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Buyurtma berish</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#111111]">
            Mijozlar qanday fikrda?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-cream p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "Probnikdan keyin 50 ml oldim. Kiyimdan ikki kun hid ketmadi."
              </p>
              <p className="font-semibold text-[#111111]">Sarvar</p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "Surovnoma orqali tanlangan hid menga juda mos tushdi. Yengil, lekin sezilarli."
              </p>
              <p className="font-semibold text-[#111111]">Dilnoza</p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "Yoqmasa almashtirish imkoniyati borligi uchun bemalol sinab ko'rdim."
              </p>
              <p className="font-semibold text-[#111111]">Jamshid</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-cream">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#111111]">
            Ko'p beriladigan savollar
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Hid qancha vaqt saqlanadi?",
                a: "Terida o'rtacha 4–8 soat, kiyimda esa bir necha kun sezilib turishi mumkin. Bu tanlangan hid va matoga ham bog'liq."
              },
              {
                q: "Probnik yoqmasa nima bo'ladi?",
                a: `Birinchi probnik yoqmasa, ikkinchi probnikni ${PRICES.PROBNIK_2ND} so'm evaziga boshqa yo'nalishda sinab ko'rishingiz mumkin.`
              },
              {
                q: "Yetkazib berish bormi?",
                a: "Hozircha O'zbekiston bo'yicha kuryer yoki pochta xizmati orqali yetkazib beramiz. Yetkazib berish narxi manzilga qarab alohida hisoblanadi."
              },
              {
                q: "HIDIM brendi qaysi segmentga kiradi?",
                a: "Hamyonbop, lekin sifatga e'tibor qaratilgan shaxsiy parfum brendi. Surovnoma asosida individual hid tanlaymiz."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-cream/50 transition-all duration-200 rounded-lg"
                >
                  <span className="font-semibold text-[#111111]">{item.q}</span>
                  <svg 
                    className={`w-5 h-5 text-gold transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-700">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Order Form Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#111111]">
            Buyurtma qoldiring
          </h2>
          
          {/* Gmail orqali ro'yxatdan o'tish bo'limi */}
          <div className="mb-12 text-center">
            <div className="bg-cream p-6 rounded-lg max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-[#111111]">Ro'yxatdan o'ting</h3>
              
              {/* Google OAuth Button */}
              {/* GoogleLoginButtonWrapper ErrorBoundary bilan o'ralgan */}
              {/* Agar GoogleOAuthProvider ichida bo'lmasa, fallback ko'rsatiladi */}
              <GoogleLoginButtonWrapper onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-cream text-gray-500">yoki</span>
                </div>
              </div>

              {!showSignUp ? (
                <button
                  onClick={() => setShowSignUp(true)}
                  className="w-full bg-white border-2 border-gray-300 text-[#111111] px-6 py-3 rounded-lg hover:bg-cream hover:border-gold transition-all duration-300 font-medium flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Telefon raqam bilan ro'yxatdan o'tish</span>
                </button>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#111111]">
                      Ismingiz
                    </label>
                    <input
                      type="text"
                      required
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Ismingizni kiriting"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#111111]">
                      Telefon raqamingiz
                    </label>
                    <input
                      type="tel"
                      required
                      value={signUpData.phone}
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
                        setSignUpData({ ...signUpData, phone: cleanValue })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="+998901234567"
                      pattern="\+998[0-9]{9}"
                      maxLength="13"
                    />
                    <p className="text-xs text-gray-500 mt-1">Masalan: +998901234567</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#111111]">
                      Parol
                    </label>
                    <input
                      type="password"
                      required
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Parol yarating"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-[#111111] text-white px-4 py-2.5 rounded-lg hover:bg-gold transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Kutilmoqda...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Ro'yxatdan o'tish</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSignUp(false)
                        setSignUpData({ name: '', phone: '', password: '' })
                      }}
                      className="flex-1 bg-gray-200 text-[#111111] px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Bekor qilish</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Ismingiz
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Ismingizni kiriting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Email manzilingiz (ixtiyoriy)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Telefon raqamingiz
                </label>
                <input
                  type="tel"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="+998901234567"
                  pattern="\+998[0-9]{9}"
                  maxLength="13"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Qaysi mahsulotni xohlaysiz?
                </label>
                <select
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Tanlang</option>
                  <option value="10ml">10 ml probnik</option>
                  <option value="50ml">50 ml EDP</option>
                  <option value="100ml">100 ml EDP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Izoh (ixtiyoriy)
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Siz yoqtirgan atirlar, hid haqidagi istaklaringiz"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#111111] text-white px-6 py-3 rounded-md hover:bg-gold transition-colors font-medium"
              >
                Buyurtma yuborish
              </button>
            </form>
            <div className="bg-cream p-8 rounded-lg">
              <h3 className="text-xl font-bold text-[#111111] mb-4">Biz bilan bog'lanish</h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Telegram</p>
                  <a href="https://t.me/hidim_parfum" className="text-gold hover:underline">
                    @hidim_parfum
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Instagram</p>
                  <a href="https://instagram.com/hidim.official" className="text-gold hover:underline">
                    @hidim.official
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <a href="mailto:info@hidim.uz" className="text-gold hover:underline">
                    info@hidim.uz
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google orqali ro'yxatdan o'tganda telefon raqam so'rash modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#111111] mb-4">Telefon raqamingizni kiriting</h2>
            <p className="text-gray-700 mb-4">
              Xush kelibsiz, <strong>{googleUserInfo?.name || googleUserInfo?.email}</strong>! 
              Buyurtmalarni qabul qilish uchun telefon raqamingizni kiriting.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-[#111111]">
                Telefon raqamingiz <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phoneForGoogle}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9+]/g, '')
                  if (!value.startsWith('+') && value.startsWith('998')) {
                    value = '+' + value
                  }
                  const cleanValue = value.startsWith('+') 
                    ? '+' + value.slice(1).replace(/[^0-9]/g, '')
                    : value.replace(/[^0-9]/g, '')
                  setPhoneForGoogle(cleanValue)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="+998901234567"
                maxLength="13"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">Masalan: +998901234567</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveGooglePhone}
                disabled={isLoading || !phoneForGoogle || !phoneForGoogle.startsWith('+998') || phoneForGoogle.length !== 13}
                className="flex-1 bg-[#111111] text-white px-4 py-2 rounded-md hover:bg-gold transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
              <button
                onClick={() => {
                  setShowPhoneModal(false)
                  setPhoneForGoogle('')
                  setGoogleUserInfo(null)
                }}
                className="flex-1 bg-gray-200 text-[#111111] px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#111111] text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              2025 © HIDIM — Shaxsiy parfum brendi
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                Maxfiylik siyosati
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                Foydalanish shartlari
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const urlCheckedRef = useRef(false)

  // URL orqali admin panelga kirish - faqat bir marta ishlaydi
  useEffect(() => {
    // Agar allaqachon tekshirilgan bo'lsa, ishlamaydi
    if (urlCheckedRef.current) return
    
    urlCheckedRef.current = true
    
    const urlParams = new URLSearchParams(window.location.search)
    const isAdminParam = urlParams.get('admin') === 'true' || urlParams.get('admin') === '1'
    const isAdminHash = window.location.hash === '#admin'
    
    if (isAdminParam || isAdminHash) {
      setCurrentPage('admin')
    }
  }, [])

  if (currentPage === 'survey') {
    return <Survey onNavigate={() => setCurrentPage('home')} />
  }

  if (currentPage === 'admin') {
    return <AdminPanel onNavigate={setCurrentPage} />
  }

  return <LandingPage onNavigate={setCurrentPage} />
}

export default App
