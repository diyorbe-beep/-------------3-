import { useState, useEffect } from 'react'
import './App.css'
import Survey from './Survey.jsx'
import probnik from './assets/image'

function LandingPage({ onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    email: '',
    password: ''
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setMobileMenuOpen(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Buyurtmangiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.')
    setFormData({ name: '', email: '', phone: '', product: '', comment: '' })
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    // Gmail formatini tekshirish
    const emailRegex = /^[^\s@]+@gmail\.com$/i
    if (!emailRegex.test(signUpData.email)) {
      alert('Iltimos, to\'g\'ri Gmail manzilini kiriting (masalan: example@gmail.com)')
      return
    }
    console.log('Sign up:', signUpData)
    alert('Ro\'yxatdan o\'tdingiz! Email manzilingizga tasdiqlash xabari yuborildi.')
    setSignUpData({ name: '', email: '', password: '' })
    setShowSignUp(false)
  }

  const handleGoogleSignIn = () => {
    // Google OAuth demo - haqiqiy loyihada Google OAuth API dan foydalanish kerak
    alert('Google orqali ro\'yxatdan o\'tish. Haqiqiy loyihada Google OAuth API ulanadi.')
    // Bu yerda Google OAuth popup ochiladi
    // window.open('https://accounts.google.com/...', 'google-auth', 'width=500,height=600')
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
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-[#111111]">HIDIM</h1>
              <p className="text-xs text-gray-600">Shaxsiy parfum brendi</p>
            </div>
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
              className="hidden md:block bg-[#111111] text-white px-4 py-2 rounded-md text-sm hover:bg-gold transition-colors"
            >
              Surovnoma boshlash
            </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-[#111111] p-2"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                  className="bg-[#111111] text-white px-4 py-2 rounded-md text-sm hover:bg-gold transition-colors mt-2"
                >
                  Surovnoma boshlash
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
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] leading-tight">
                HIDIM — Sizga mos shaxsiy hid
              </h1>
              <p className="text-xl md:text-2xl text-gray-700">
                Hid sizniki. Xarakter sizniki. Atir bizdan.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  30 soniyalik surovnoma
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  10 ml probnik — 45 000 so'm
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  Yoqsa — 50/100 ml shaxsiy atir
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => onNavigate('survey')}
                  className="bg-[#111111] text-white px-8 py-3 rounded-md hover:bg-gold transition-colors font-medium"
                >
                  Surovnoma boshlash
                </button>
                <button
                  onClick={() => scrollToSection('sample')}
                  className="border-2 border-[#111111] text-[#111111] px-8 py-3 rounded-md hover:bg-[#111111] hover:text-white transition-colors font-medium"
                >
                  Probnik buyurtma qilish
                </button>
              </div>
            </div>
            <div className="bg-cream p-8 rounded-lg shadow-lg">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#111111]">HIDIM 10 ml PROBNIK</h3>
                <p className="text-gray-700">Sizga mos hidni avval sinab ko'ring.</p>
                <p className="text-3xl font-bold text-gold">45 000 so'm</p>
                <button
                  onClick={() => scrollToSection('sample')}
                  className="bg-[#111111] text-white px-6 py-2 rounded-md hover:bg-gold transition-colors"
                >
                  Batafsil
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#111111]">
            HIDIM qanday ishlaydi?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-cream p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-gold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3 text-[#111111]">Qisqa surovnoma</h3>
              <p className="text-gray-700">
                Yoshi, xarakteringiz va yoqtirgan atirlaringiz haqida bir nechta savollarga javob berasiz.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-gold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3 text-[#111111]">Shaxsiy hid profili</h3>
              <p className="text-gray-700">
                Javoblaringiz asosida sizga mos hid yo'nalishi tanlanadi.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-gold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3 text-[#111111]">Probnik va flakon</h3>
              <p className="text-gray-700">
                Avval 10 ml probnikni sinab ko'rasiz, yoqsa 50 yoki 100 ml flakon buyurtma qilasiz.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('survey')}
              className="bg-[#111111] text-white px-8 py-3 rounded-md hover:bg-gold transition-colors font-medium"
            >
              Surovnoma boshlash
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
              <h3 className="text-2xl font-bold text-[#111111]">10 ml PROBNIK — 45 000 so'm</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span>Kiyimda bir necha kun saqlanadigan hid</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span>20+ hid yo'nalishidan tanlov</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span>Hid yoqmasa — 2-probnik faqat 35 000 so'm</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span>Video fikr yuborsangiz — 10% chegirma</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="aspect-square bg-cream rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-24 h-32 bg-gold/20 rounded mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600"></p>
                </div>
              </div>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-[#111111] text-white px-6 py-3 rounded-md hover:bg-gold transition-colors font-medium"
              >
                Probnik buyurtma qilish
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fragrance Directions Section */}
      <section id="directions" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#111111]">
            HIDIM hid yo'nalishlari
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-cream p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold mb-3 text-[#111111]">Fresh</h3>
              <p className="text-gray-700">
                Sauvage, Bleu de Chanel ruhidagi toza, yangicha, energiyali hidlar.
              </p>
            </div>
            <div className="bg-cream p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">🍯</div>
              <h3 className="text-xl font-semibold mb-3 text-[#111111]">Sweet & Oriental</h3>
              <p className="text-gray-700">
                Vanilla, amber, oud notalari bilan issiq, chiroyli hidi yo'nalishlari.
              </p>
            </div>
            <div className="bg-cream p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-xl font-semibold mb-3 text-[#111111]">Ocean & Marine</h3>
              <p className="text-gray-700">
                Megamare va dengiz shamoli uslubida nam, sho'r, sof hidlar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-cream">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#111111]">
            Narxlar
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <span className="inline-block bg-gold/20 text-gold text-xs px-3 py-1 rounded-full mb-4">
                  Yangi mijozlar uchun
                </span>
                <h3 className="text-xl font-semibold mb-2 text-[#111111]">10 ml Probnik</h3>
                <p className="text-3xl font-bold text-gold mb-2">45 000 so'm</p>
                <p className="text-sm text-gray-600">2-probnik — 35 000 so'm</p>
              </div>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-[#111111] text-white px-6 py-3 rounded-md hover:bg-gold transition-colors font-medium"
              >
                Buyurtma berish
              </button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gold">
              <div className="text-center mb-6">
                <span className="inline-block bg-gold text-white text-xs px-3 py-1 rounded-full mb-4">
                  Eng ommabop
                </span>
                <h3 className="text-xl font-semibold mb-2 text-[#111111]">50 ml Eau de Parfum</h3>
                <p className="text-3xl font-bold text-gold mb-2">299 000 so'm</p>
                <p className="text-sm text-gray-600">Sizga mos shaxsiy hid asosida tayyorlanadi.</p>
              </div>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-[#111111] text-white px-6 py-3 rounded-md hover:bg-gold transition-colors font-medium"
              >
                Buyurtma berish
              </button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <span className="inline-block bg-brown/20 text-brown text-xs px-3 py-1 rounded-full mb-4">
                  Premium
                </span>
                <h3 className="text-xl font-semibold mb-2 text-[#111111]">100 ml Eau de Parfum</h3>
                <p className="text-3xl font-bold text-gold mb-2">499 000 so'm</p>
                <p className="text-sm text-gray-600">Oilaviy yoki uzoq muddat foydalanish uchun.</p>
              </div>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-[#111111] text-white px-6 py-3 rounded-md hover:bg-gold transition-colors font-medium"
              >
                Buyurtma berish
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#111111]">
            Mijozlar qanday fikrda?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-cream p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4 italic">
                "Probnikdan keyin 50 ml oldim. Kiyimdan ikki kun hid ketmadi."
              </p>
              <p className="font-semibold text-[#111111]">— Sarvar</p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4 italic">
                "Surovnoma orqali tanlangan hid menga juda mos tushdi. Yengil, lekin sezilarli."
              </p>
              <p className="font-semibold text-[#111111]">— Dilnoza</p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4 italic">
                "Yoqmasa almashtirish imkoniyati borligi uchun bemalol sinab ko'rdim."
              </p>
              <p className="font-semibold text-[#111111]">— Jamshid</p>
            </div>
          </div>
        </div>
      </section>bg-cream

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
                a: "Birinchi probnik yoqmasa, ikkinchi probnikni 35 000 so'm evaziga boshqa yo'nalishda sinab ko'rishingiz mumkin."
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
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-cream/50 transition-colors"
                >
                  <span className="font-semibold text-[#111111]">{item.q}</span>
                  <span className="text-gold text-xl">
                    {openFaq === index ? '−' : '+'}
                  </span>
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
              <h3 className="text-xl font-semibold mb-4 text-[#111111]">Gmail orqali ro'yxatdan o'ting</h3>
              {!showSignUp ? (
                <button
                  onClick={() => setShowSignUp(true)}
                  className="w-full bg-white border-2 border-[#111111] text-[#111111] px-6 py-3 rounded-md hover:bg-[#111111] hover:text-white transition-colors font-medium mb-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Gmail orqali ro'yxatdan o'tish
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
                      Gmail manzilingiz
                    </label>
                    <input
                      type="email"
                      required
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="example@gmail.com"
                    />
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
                      className="flex-1 bg-[#111111] text-white px-4 py-2 rounded-md hover:bg-gold transition-colors font-medium"
                    >
                      Ro'yxatdan o'tish
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSignUp(false)
                        setSignUpData({ name: '', email: '', password: '' })
                      }}
                      className="flex-1 bg-gray-200 text-[#111111] px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
                    >
                      Bekor qilish
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="+998 XX XXX XX XX"
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
              <h3 className="text-xl font-semibold mb-6 text-[#111111]">Kontakt ma'lumotlari</h3>
              <div className="space-y-4">
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

  if (currentPage === 'survey') {
    return <Survey onNavigate={() => setCurrentPage('home')} />
  }

  return <LandingPage onNavigate={setCurrentPage} />
}

export default App
