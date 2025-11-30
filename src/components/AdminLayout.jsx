import { useState } from 'react'

function AdminLayout({ children, currentPage, onNavigate, onBack }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders', label: 'Buyurtmalar', icon: '📦' },
    { id: 'surveys', label: 'So\'rovlar', icon: '📝' },
    { id: 'customers', label: 'Mijozlar', icon: '👥' },
    { id: 'profiles', label: 'Hid profillari', icon: '🌸' },
    { id: 'discounts', label: 'Chegirmalar', icon: '🎁' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'settings', label: 'Sozlamalar', icon: '⚙️' },
  ]

  const handleNavigate = (pageId) => {
    onNavigate(pageId)
    setSidebarOpen(false) // Mobilda navigatsiyadan keyin sidebar yopiladi
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#111111] text-white flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 lg:p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">HIDIM</h1>
            <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        {onBack && (
          <div className="p-3 lg:p-4 border-b border-gray-700">
            <button
              onClick={onBack}
              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Asosiy sahifaga</span>
            </button>
          </div>
        )}
        <nav className="mt-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full text-left px-4 lg:px-6 py-3 flex items-center gap-3 transition-colors ${
                currentPage === item.id
                  ? 'bg-gold text-[#111111] font-semibold'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg lg:text-xl">{item.icon}</span>
              <span className="text-sm lg:text-base">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Topbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-[#111111] transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-[#111111] transition-colors"
                >
                  <span>←</span>
                  <span className="text-sm">Asosiy sahifa</span>
                </button>
              )}
              <h2 className="text-lg lg:text-xl font-semibold text-[#111111]">HIDIM Admin</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gold rounded-full flex items-center justify-center text-[#111111] font-semibold text-sm lg:text-base">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

