import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// Google OAuth Client ID - .env faylidan olinadi
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '842416852674-j61hmt21t7vlc33h5rlm0h9ln28qpf1s.apps.googleusercontent.com'

// Debug: Client ID ni console ga chiqarish
console.log('🔍 Google OAuth Client ID:', GOOGLE_CLIENT_ID ? 'Mavjud ✅' : 'Topilmadi ❌')
console.log('📋 import.meta.env.VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)
console.log('📋 Barcha env o\'zgaruvchilar:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')))
if (GOOGLE_CLIENT_ID) {
  console.log('📋 Client ID qiymati:', GOOGLE_CLIENT_ID.substring(0, 30) + '...')
}

// Client ID ni aniqlash
const clientIdToUse = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.trim() !== '' 
  ? GOOGLE_CLIENT_ID 
  : '842416852674-j61hmt21t7vlc33h5rlm0h9ln28qpf1s.apps.googleusercontent.com'

console.log('✅ GoogleOAuthProvider ishlatilmoqda, Client ID:', clientIdToUse.substring(0, 30) + '...')

// App ni render qilish
const AppComponent = (
  <GoogleOAuthProvider clientId={clientIdToUse}>
    <App />
  </GoogleOAuthProvider>
)

if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
  console.warn('⚠️ Google OAuth Client ID topilmadi! .env faylida VITE_GOOGLE_CLIENT_ID ni sozlang.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {AppComponent}
  </StrictMode>,
)
