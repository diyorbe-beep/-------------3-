import { useState } from 'react'

function AdminLayout({ children, currentPage, onNavigate, onBack }) {
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

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] text-white flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">HIDIM</h1>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        {onBack && (
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={onBack}
              className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Asosiy sahifaga</span>
            </button>
          </div>
        )}
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left px-6 py-3 flex items-center gap-3 transition-colors ${
                currentPage === item.id
                  ? 'bg-gold text-[#111111] font-semibold'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-gray-600 hover:text-[#111111] transition-colors flex items-center gap-2"
                >
                  <span>←</span>
                  <span className="text-sm">Asosiy sahifa</span>
                </button>
              )}
              <h2 className="text-xl font-semibold text-[#111111]">HIDIM Admin</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-[#111111] font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

