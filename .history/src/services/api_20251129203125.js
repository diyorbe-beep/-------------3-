// API Base URL - environment variable orqali sozlanadi
// Agar VITE_API_BASE_URL mavjud bo'lsa, uni ishlatamiz
// Aks holda, localhost yoki production URL ni ishlatamiz
// Production serverda email endpoint mavjud emas, shuning uchun localhost ishlatamiz
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// Debug: API URL ni console ga chiqarish
console.log('🔗 API Base URL:', API_BASE_URL)

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error (${response.status}):`, errorText)
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Error Details:', {
      endpoint: `${API_BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      error: error.message
    })
    throw error
  }
}

// Orders API
export const ordersAPI = {
  getAll: () => apiCall('/orders'),
  getById: (id) => apiCall(`/orders/${id}`),
  create: (data) => apiCall('/orders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/orders/${id}`, { method: 'DELETE' }),
}

// Customers API
export const customersAPI = {
  getAll: () => apiCall('/customers'),
  create: (data) => apiCall('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}

// Profiles API
export const profilesAPI = {
  getAll: () => apiCall('/profiles'),
  create: (data) => apiCall('/profiles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/profiles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/profiles/${id}`, { method: 'DELETE' }),
}

// Discounts API
export const discountsAPI = {
  getAll: () => apiCall('/discounts'),
  create: (data) => apiCall('/discounts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/discounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/discounts/${id}`, { method: 'DELETE' }),
}

// Feedback API
export const feedbackAPI = {
  getAll: () => apiCall('/feedback'),
  create: (data) => apiCall('/feedback', { method: 'POST', body: JSON.stringify(data) }),
}

// Surveys API
export const surveysAPI = {
  getAll: () => apiCall('/surveys'),
  create: (data) => apiCall('/surveys', { method: 'POST', body: JSON.stringify(data) }),
}

// Settings API
export const settingsAPI = {
  get: () => apiCall('/settings'),
  update: (data) => apiCall('/settings', { method: 'PUT', body: JSON.stringify(data) }),
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats'),
}

// Email API
export const emailAPI = {
  sendVerificationCode: (data) => apiCall('/email/send-code', { method: 'POST', body: JSON.stringify(data) }),
  verifyCode: (data) => apiCall('/email/verify-code', { method: 'POST', body: JSON.stringify(data) }),
}


