import { useEffect } from 'react'

function GoogleLoginButton({ onSuccess, onError }) {
  useEffect(() => {
    // Google OAuth script yuklash
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          callback: (response) => {
            if (response.credential) {
              try {
                // JWT token ni decode qilish (oddiy base64 decode)
                const base64Url = response.credential.split('.')[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                )
                const userInfo = JSON.parse(jsonPayload)
                
                if (onSuccess) {
                  onSuccess({
                    name: userInfo.name,
                    email: userInfo.email,
                    picture: userInfo.picture,
                    sub: userInfo.sub
                  })
                }
              } catch (error) {
                if (onError) {
                  onError(error)
                }
              }
            }
          }
        })

        // Button render qilish
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            locale: 'uz'
          }
        )
      }
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [onSuccess, onError])

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    return (
      <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-sm text-yellow-800">
          Google OAuth Client ID sozlanmagan. Iltimos, .env faylida VITE_GOOGLE_CLIENT_ID ni qo'shing.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div id="google-signin-button" className="w-full flex justify-center"></div>
    </div>
  )
}

export default GoogleLoginButton
