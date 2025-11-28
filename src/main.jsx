import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Google OAuth Client ID - .env faylidan olinadi
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

// Google OAuth Provider - conditional wrapper
function AppWithGoogleOAuth() {
  const [GoogleOAuthProvider, setGoogleOAuthProvider] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Dynamic import
    import('@react-oauth/google')
      .then((module) => {
        setGoogleOAuthProvider(() => module.GoogleOAuthProvider)
        setIsLoading(false)
      })
      .catch((error) => {
        console.warn('⚠️ @react-oauth/google paketi o\'rnatilmagan. Google OAuth ishlamaydi.')
        console.warn('O\'rnatish uchun: npm install @react-oauth/google')
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <App />
  }

  if (GoogleOAuthProvider) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || 'dummy-client-id'}>
        <App />
      </GoogleOAuthProvider>
    )
  }

  return <App />
}

if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
  console.warn('⚠️ Google OAuth Client ID topilmadi! .env faylida VITE_GOOGLE_CLIENT_ID ni sozlang.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithGoogleOAuth />
  </StrictMode>,
)
