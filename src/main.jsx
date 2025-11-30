import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// Google OAuth Client ID - .env faylidan olinadi
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '842416852674-j61hmt21t7vlc33h5rlm0h9ln28qpf1s.apps.googleusercontent.com'

// Client ID ni aniqlash
const clientIdToUse = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.trim() !== '' 
  ? GOOGLE_CLIENT_ID 
  : '842416852674-j61hmt21t7vlc33h5rlm0h9ln28qpf1s.apps.googleusercontent.com'

// App ni render qilish
const AppComponent = (
  <GoogleOAuthProvider clientId={clientIdToUse}>
    <App />
  </GoogleOAuthProvider>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {AppComponent}
  </StrictMode>,
)
