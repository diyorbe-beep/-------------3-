import { Component } from 'react'
import GoogleLoginButton from './GoogleLoginButton'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Xatolikni log qilish mumkin
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4">
          <p className="text-red-600 text-sm">
            Google orqali ro'yxatdan o'tishda xatolik yuz berdi. Iltimos, telefon raqam bilan ro'yxatdan o'ting.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

function GoogleLoginButtonWrapper({ onSuccess, onError }) {
  return (
    <ErrorBoundary>
      <GoogleLoginButton onSuccess={onSuccess} onError={onError} />
    </ErrorBoundary>
  )
}

export default GoogleLoginButtonWrapper
