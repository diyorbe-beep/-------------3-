import { Component } from 'react'
import GoogleLoginButton from './GoogleLoginButton'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Xatolikni log qilish
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-sm text-red-800 mb-2">
            Google orqali ro'yxatdan o'tishda xatolik yuz berdi.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Qayta urinib ko'ring
          </button>
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
