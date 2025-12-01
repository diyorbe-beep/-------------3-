import { useState, useEffect, useRef } from 'react'
import { ordersAPI, customersAPI } from './services/api'
import { PRICES, PRODUCTS, PRODUCT_MAP, PRICE_MAP } from './constants/prices'
import './App.css'
import Survey from './Survey.jsx'
import AdminPanel from './pages/admin/AdminPanel.jsx'
import CustomerPanel from './pages/customer/CustomerPanel.jsx'
import GoogleLoginButtonWrapper from './components/GoogleLoginButtonWrapper.jsx'
import probnik from './assets/image.png'
import bottles from './assets/bottles.png'

function LandingPage({ onNavigate, customer, onNavigateToSurvey, onNavigateToCustomerPanel, onCustomerLogin }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)
  const [formData, setFormData] = useState({
    firstName: '', // Ism (majburiy)
    lastName: '', // Familiya (ixtiyoriy)
    email: '',
    phone: '',
    product: '',
    volume: '', // ml miqdori
    calculatedPrice: '', // hisoblangan narx
    comment: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const hasNavigatedRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Formaning volume input elementini highlight qilish uchun
  useEffect(() => {
    if (formData.volume) {
      const volumeInput = document.getElementById('product-volume')
      if (volumeInput) {
        // Input elementga focus qilish va highlight qilish
        setTimeout(() => {
          volumeInput.focus()
          volumeInput.select()
          // Bir oz vaqt o'tgach focus'ni olib tashlash, lekin border highlight qoldirish
          setTimeout(() => {
            volumeInput.blur()
          }, 2000)
        }, 600) // Scroll tugagandan keyin
      }
    }
  }, [formData.volume])

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
    try {
      setIsLoading(true)
      
      // Mijozni topish yoki yaratish
      let customerData = null
      try {
        const customers = await customersAPI.getAll()
        const existingCustomer = customers.find(c => c.email === userInfo.email)
        
        if (existingCustomer) {
          // Mijoz allaqachon mavjud
          customerData = {
            id: existingCustomer.id,
            firstName: existingCustomer.firstName || userInfo.given_name || '',
            lastName: existingCustomer.lastName || userInfo.family_name || '',
            email: userInfo.email || '',
            phone: existingCustomer.phone || '',
            name: existingCustomer.name || userInfo.name || 'Foydalanuvchi'
          }
        } else {
          // Yangi mijoz yaratish
          const newCustomer = await customersAPI.create({
            name: userInfo.name || 'Foydalanuvchi',
            firstName: userInfo.given_name || '',
            lastName: userInfo.family_name || '',
            email: userInfo.email || '',
            phone: '',
            gender: '',
            age: '',
            orders: 0,
            profile: ''
          })
          
          customerData = {
            id: newCustomer.id,
            firstName: newCustomer.firstName || userInfo.given_name || '',
            lastName: newCustomer.lastName || userInfo.family_name || '',
            email: newCustomer.email || userInfo.email || '',
            phone: newCustomer.phone || '',
            name: newCustomer.name || userInfo.name || 'Foydalanuvchi'
          }
        }
        
        // Mijozni saqlash va login qilish
        if (onCustomerLogin) {
          onCustomerLogin(customerData)
        }
      } catch (error) {
        console.error('Mijoz yaratish/yuklash xatosi:', error)
        alert('Ro\'yxatdan o\'tishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLoginError = (error) => {
    alert('Google orqali ro\'yxatdan o\'tishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
  }

  // Narxni hisoblash funksiyasi (ml bo'yicha)
  const calculatePrice = (volume) => {
    if (!volume || volume < 1) return ''
    
    const volumeNum = parseInt(volume)
    
    // Asosiy narxlar
    const price10ml = 45000
    const price50ml = 299000
    const price100ml = 499000
    
    let calculatedPrice = 0
    
    if (volumeNum <= 10) {
      // 1-10 ml: 4500 so'm/ml
      calculatedPrice = volumeNum * (price10ml / 10)
    } else if (volumeNum <= 50) {
      // 11-50 ml: linear interpolation between 10ml and 50ml
      const ratio = (volumeNum - 10) / (50 - 10)
      calculatedPrice = price10ml + (price50ml - price10ml) * ratio
    } else if (volumeNum <= 100) {
      // 51-100 ml: linear interpolation between 50ml and 100ml
      const ratio = (volumeNum - 50) / (100 - 50)
      calculatedPrice = price50ml + (price100ml - price50ml) * ratio
    } else {
      // 100+ ml: 4990 so'm/ml
      calculatedPrice = price100ml + (volumeNum - 100) * (price100ml / 100)
    }
    
    // Yaxlitlash va formatlash
    return Math.round(calculatedPrice).toLocaleString('uz-UZ')
  }

  // Volume o'zgarganda narxni hisoblash
  const handleVolumeChange = (e) => {
    const volume = e.target.value
    const calculatedPrice = volume ? calculatePrice(parseInt(volume)) : ''
    
    setFormData(prev => ({
      ...prev,
      volume: volume,
      calculatedPrice: calculatedPrice,
      product: '' // Agar volume kiritilsa, eski product tanlovini tozalash
    }))
  }

  const scrollToSection = (sectionId, productValue = null) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
      
      // Agar mahsulot tanlangan bo'lsa, formaga qo'shish
      if (productValue) {
        setTimeout(() => {
          // productValue '10ml', '50ml', '100ml' formatida
          const volume = productValue.replace('ml', '')
          const calculatedPrice = calculatePrice(parseInt(volume))
          
          setFormData(prev => ({
            ...prev,
            volume: volume,
            calculatedPrice: calculatedPrice,
            product: productValue // Eski formatni ham saqlash
          }))
          
          // Input fieldga focus qilish
          const volumeInput = document.getElementById('product-volume')
          if (volumeInput) {
            setTimeout(() => {
              volumeInput.focus()
              volumeInput.select()
            }, 600)
          }
        }, 500) // Scroll tugagandan keyin mahsulotni tanlash
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Ism bo'lmasa, xatolik
      if (!formData.firstName || formData.firstName.trim() === '') {
        alert('Iltimos, ismingizni kiriting.')
        return
      }
      
      // Fikr qoldirish bo'limi uchun faqat ism ishlatiladi (familiya kerak emas)
      const customerName = formData.firstName.trim()
      
      // Agar email bo'lsa, mijozni topib telefon raqamini olish
      let phoneToUse = formData.phone
      
      if (formData.email) {
        try {
          const customers = await customersAPI.getAll()
          const customer = customers.find(c => c.email === formData.email)
          if (customer) {
            if (customer.phone) {
              phoneToUse = customer.phone
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

      // Mahsulot nomini yaratish
      let productName = ''
      let productPrice = ''
      
      if (formData.volume) {
        // Agar volume kiritilgan bo'lsa, custom mahsulot
        productName = `${formData.volume} ml EDP`
        productPrice = formData.calculatedPrice || calculatePrice(parseInt(formData.volume))
      } else if (formData.product) {
        // Agar eski select tanlangan bo'lsa
        productName = PRODUCT_MAP[formData.product] || formData.product
        productPrice = PRICE_MAP[formData.product] || ''
      }
      
      const orderData = {
        customer: customerName,
        phone: phoneToUse,
        email: formData.email || '',
        product: productName,
        price: productPrice,
        comment: formData.comment || '',
        status: 'Yangi',
        date: new Date().toISOString().split('T')[0] // Sana qo'shamiz
      }
      
      const result = await ordersAPI.create(orderData)
      
      // Buyurtma yuborilgandan keyin, admin panelga xabar berish
      if (result && result.id) {
      }
      
      alert('Buyurtma qoldirdi! Tez orada siz bilan bog\'lanamiz.')
      setFormData({ firstName: '', lastName: '', email: '', phone: '', product: '', volume: '', calculatedPrice: '', comment: '' })
    } catch (error) {
      alert('Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
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
              {customer ? (
                <>
                  <button
                    onClick={() => onNavigateToCustomerPanel && onNavigateToCustomerPanel()}
                    className="hidden md:flex bg-gold text-white px-4 py-2.5 rounded-lg text-sm hover:bg-brown transition-all duration-300 font-medium shadow-md hover:shadow-lg items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Mening buyurtmalarim</span>
                  </button>
                  <button
                    onClick={() => onNavigateToSurvey && onNavigateToSurvey()}
                    className="hidden md:flex bg-[#111111] text-white px-4 py-2.5 rounded-lg text-sm hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg items-center gap-2 group"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Surovnoma boshlash</span>
                  </button>
                </>
              ) : (
                <div className="hidden md:flex">
                  <GoogleLoginButtonWrapper onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />
                </div>
              )}
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
                {customer ? (
                  <>
                    <button
                      onClick={() => onNavigateToCustomerPanel && onNavigateToCustomerPanel()}
                      className="bg-gold text-white px-4 py-2.5 rounded-lg text-sm hover:bg-brown transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2 mt-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>Mening buyurtmalarim</span>
                    </button>
                    <button
                      onClick={() => onNavigateToSurvey && onNavigateToSurvey()}
                      className="bg-[#111111] text-white px-4 py-2.5 rounded-lg text-sm hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2 group mt-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Surovnoma boshlash</span>
                    </button>
                  </>
                ) : (
                  <div className="mt-2">
                    <GoogleLoginButtonWrapper onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />
                  </div>
                )}
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
            <div className="bg-cream p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-full max-w-xs h-80 bg-gradient-to-b from-gold/10 to-cream rounded-xl mx-auto mb-6 flex items-center justify-center overflow-hidden p-4 border border-gold/20">
                <img src={bottles} alt="HIDIM Parfum Butilkalari" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-2">HIDIM 10 ml PROBNIK</h3>
              <p className="text-gray-700 mb-4">Sizga mos hidni avval sinab ko'ring.</p>
              <button
                onClick={() => scrollToSection('sample')}
                className="bg-[#111111] text-white px-6 py-2.5 rounded-lg text-sm hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2 group mx-auto"
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
            <div className="bg-cream p-6 rounded-lg shadow-sm text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gold/20">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-full">
                  {/* Fresh - Leaf Icon */}
                  <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#111111]">Fresh</h3>
              <p className="text-gray-700">
                Sauvage, Bleu de Chanel ruhidagi toza, yangicha, energiyali hidlar.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-sm text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gold/20">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-full">
                  {/* Sweet & Oriental - Perfume Bottle Icon */}
                  <svg className="w-14 h-14 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#111111]">Sweet & Oriental</h3>
              <p className="text-gray-700">
                Vanilla, amber, oud notalari bilan issiq, chiroyli hidi yo'nalishlari.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-sm text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gold/20">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full">
                  {/* Ocean & Marine - Wave Icon */}
                  <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5L7.5 9l4.5 4.5L16.5 9l4.5 4.5M3 17.5L7.5 13l4.5 4.5L16.5 13l4.5 4.5" />
                  </svg>
                </div>
              </div>
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
                onClick={() => scrollToSection('contact', '10ml')}
                className="w-full bg-[#111111] text-white px-6 py-3.5 rounded-lg hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Buyurtma berish</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
                onClick={() => scrollToSection('contact', '50ml')}
                className="w-full bg-[#111111] text-white px-6 py-3.5 rounded-lg hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Buyurtma berish</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
                onClick={() => scrollToSection('contact', '100ml')}
                className="w-full bg-[#111111] text-white px-6 py-3.5 rounded-lg hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Buyurtma berish</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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

            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formData.volume && formData.calculatedPrice && (
                <>
                  <div className="bg-gold/10 p-4 rounded-lg border border-gold/30">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Tanlangan mahsulot:</span> {formData.volume} ml EDP - {formData.calculatedPrice} so'm
                    </p>
                    <p className="text-xs text-gray-600">
                      Mahsulot hajmini o'zgartirish uchun "Narxlar" bo'limiga qayting
                    </p>
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#111111]">
                  Ism <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                  Fikr yoki taklifingiz <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Sizning fikr, taklif yoki savollaringizni yozing..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#111111] text-white px-6 py-3.5 rounded-lg hover:bg-gold transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>{formData.volume && formData.calculatedPrice ? 'Buyurtma yuborish' : 'Fikr yuborish'}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
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
  const [customer, setCustomer] = useState(null)
  const urlCheckedRef = useRef(false)

  // LocalStorage'dan mijoz ma'lumotlarini yuklash
  useEffect(() => {
    const savedCustomer = localStorage.getItem('customer')
    if (savedCustomer) {
      try {
        setCustomer(JSON.parse(savedCustomer))
      } catch (error) {
        console.error('Mijoz ma\'lumotlarini yuklash xatosi:', error)
        localStorage.removeItem('customer')
      }
    }
  }, [])

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

  const handleCustomerLogin = (customerData) => {
    setCustomer(customerData)
    localStorage.setItem('customer', JSON.stringify(customerData))
  }

  const handleCustomerLogout = () => {
    setCustomer(null)
    localStorage.removeItem('customer')
    setCurrentPage('home')
  }

  const handleNavigateToSurvey = () => {
    if (!customer) {
      // Google login kerak
      return
    }
    setCurrentPage('survey')
  }

  if (currentPage === 'customer') {
    if (!customer) {
      return <LandingPage onNavigate={setCurrentPage} customer={customer} onNavigateToSurvey={handleNavigateToSurvey} onNavigateToCustomerPanel={() => setCurrentPage('customer')} onCustomerLogin={handleCustomerLogin} />
    }
    return <CustomerPanel customer={customer} onLogout={handleCustomerLogout} />
  }

  if (currentPage === 'survey') {
    if (!customer) {
      return <LandingPage onNavigate={setCurrentPage} customer={customer} onNavigateToSurvey={handleNavigateToSurvey} onNavigateToCustomerPanel={() => setCurrentPage('customer')} onCustomerLogin={handleCustomerLogin} />
    }
    return <Survey onNavigate={() => setCurrentPage('home')} customer={customer} />
  }

  if (currentPage === 'admin') {
    return <AdminPanel onNavigate={setCurrentPage} />
  }

  return (
    <LandingPage 
      onNavigate={setCurrentPage} 
      customer={customer}
      onNavigateToSurvey={handleNavigateToSurvey}
      onNavigateToCustomerPanel={() => setCurrentPage('customer')}
      onCustomerLogin={handleCustomerLogin}
    />
  )
}

export default App
