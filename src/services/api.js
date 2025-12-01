// API Base URL - environment variable orqali sozlanadi
// Agar VITE_API_BASE_URL mavjud bo'lsa, uni ishlatamiz
// Aks holda, localhost yoki production URL ni ishlatamiz
// Production serverda email endpoint mavjud emas, shuning uchun localhost ishlatamiz
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://atir.onrender.com'

// Agar API_BASE_URL /api bilan tugasa, uni olib tashlaymiz (chunki endpoint'larda /api qo'shamiz)
if (API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.slice(0, -4)
}
// Agar /api/ bilan tugasa, uni ham olib tashlaymiz
if (API_BASE_URL.endsWith('/api/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -5)
}

// Debug: API URL ni console ga chiqarish
console.log('🔗 API Base URL:', API_BASE_URL)

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const fullUrl = `${API_BASE_URL}${endpoint}`
  console.log(`🌐 API So'rovi: ${options.method || 'GET'} ${fullUrl}`)
  
  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    
    console.log(`📥 API Javob: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ API Error (${response.status}):`, errorText)
      console.error(`❌ Full URL: ${fullUrl}`)
      console.error(`❌ Request options:`, options)
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log(`✅ API Success:`, data)
    return data
  } catch (error) {
    console.error('❌ API Error Details:', {
      endpoint: fullUrl,
      method: options.method || 'GET',
      error: error.message,
      stack: error.stack
    })
    throw error
  }
}

// Orders API
export const ordersAPI = {
  getAll: async () => {
    console.log('📡 GET /api/orders so\'rovi yuborilmoqda...')
    const result = await apiCall('/api/orders')
    console.log('📦 GET /api/orders javobi:', result)
    return result
  },
  getById: (id) => apiCall(`/api/orders/${id}`),
  create: async (data) => {
    console.log('📡 POST /api/orders so\'rovi yuborilmoqda:', data)
    const result = await apiCall('/api/orders', { method: 'POST', body: JSON.stringify(data) })
    console.log('📦 POST /api/orders javobi:', result)
    return result
  },
  update: (id, data) => apiCall(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/orders/${id}`, { method: 'DELETE' }),
}

// Customers API
export const customersAPI = {
  getAll: async () => {
    console.log('📡 GET /api/customers so\'rovi yuborilmoqda...')
    const result = await apiCall('/api/customers')
    console.log('📦 GET /api/customers javobi:', result)
    return result
  },
  getById: (id) => apiCall(`/api/customers/${id}`),
  create: (data) => apiCall('/api/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  register: (data) => apiCall('/api/customers/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiCall('/api/customers/login', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: (id) => apiCall(`/api/customers/${id}/orders`),
}

// Profiles API
export const profilesAPI = {
  getAll: () => apiCall('/api/profiles'),
  create: (data) => apiCall('/api/profiles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/api/profiles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/profiles/${id}`, { method: 'DELETE' }),
}

// Discounts API
export const discountsAPI = {
  getAll: () => apiCall('/api/discounts'),
  create: (data) => apiCall('/api/discounts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/api/discounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/discounts/${id}`, { method: 'DELETE' }),
}

// Feedback API
export const feedbackAPI = {
  getAll: () => apiCall('/api/feedback'),
  create: (data) => apiCall('/api/feedback', { method: 'POST', body: JSON.stringify(data) }),
}

// Surveys API
export const surveysAPI = {
  getAll: () => apiCall('/api/surveys'),
  create: (data) => apiCall('/api/surveys', { method: 'POST', body: JSON.stringify(data) }),
}

// Settings API
export const settingsAPI = {
  get: () => apiCall('/api/settings'),
  update: (data) => apiCall('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiCall('/api/dashboard/stats'),
}

// Email API
export const emailAPI = {
  sendVerificationCode: (data) => apiCall('/api/email/send-code', { method: 'POST', body: JSON.stringify(data) }),
  verifyCode: (data) => apiCall('/api/email/verify-code', { method: 'POST', body: JSON.stringify(data) }),
}


