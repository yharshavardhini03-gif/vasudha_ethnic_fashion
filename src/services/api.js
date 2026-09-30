/**
 * VasudhaEthnic Unified Backend API Client
 * 
 * Centralized HTTP service for interacting with the FastAPI backend:
 * - Configured via import.meta.env.VITE_API_BASE_URL
 * - Bearer JWT Token management
 * - Public & authenticated routes
 * - Graceful error handling
 */

const API_ROOT = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = `${API_ROOT.replace(/\/$/, '')}/api`;

export const api = {
  getToken: () => {
    try {
      const auth = localStorage.getItem('vasudha_auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        return parsed.token || null;
      }
    } catch {
      return null;
    }
    return null;
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let errorMsg = data?.detail;
        if (!errorMsg) {
          if (response.status === 404) errorMsg = 'Product or resource not found.';
          else if (response.status === 401) errorMsg = 'Invalid credentials. Please log in.';
          else if (response.status === 403) errorMsg = 'Access forbidden.';
          else if (response.status >= 500) errorMsg = 'Unable to connect to the store database.';
          else errorMsg = `API Request failed (${response.status})`;
        }
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.warn(`[API Client] ${options.method || 'GET'} ${endpoint} notice:`, err.message);
      throw err;
    }
  },

  // Auth Endpoints
  auth: {
    register: (userData) => api.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => api.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    sellerLogin: (credentials) => api.request('/auth/seller/login', { method: 'POST', body: JSON.stringify(credentials) }),
    me: () => api.request('/auth/me', { method: 'GET' }),
    logout: () => api.request('/auth/logout', { method: 'POST' }),
  },

  // Products Endpoints
  products: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.request(`/products${query ? `?${query}` : ''}`, { method: 'GET' });
    },
    get: (idOrSlug) => api.request(`/products/${idOrSlug}`, { method: 'GET' }),
    create: (productData) => api.request('/products', { method: 'POST', body: JSON.stringify(productData) }),
    update: (id, productData) => api.request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
    delete: (id) => api.request(`/products/${id}`, { method: 'DELETE' }),
    updateStock: (id, stock) => api.request(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock }) }),
    updateVariantStock: (id, size, color, stock) =>
      api.request(`/products/${id}/variants/stock`, { method: 'PATCH', body: JSON.stringify({ size, color, stock }) }),
    uploadImage: async (file) => {
      const token = api.getToken();
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_BASE}/products/upload-image`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail || 'Failed to upload image');
      }
      return await response.json();
    }
  },

  // Orders Endpoints
  orders: {
    create: (orderData) => api.request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    list: () => api.request('/orders', { method: 'GET' }),
    get: (id) => api.request(`/orders/${id}`, { method: 'GET' }),
    updateStatus: (id, status) => api.request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  },

  // AI Stylist RAG Endpoint
  ai: {
    chat: (message, sessionId = null, conversationHistory = []) =>
      api.request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          session_id: sessionId,
          conversation_history: conversationHistory
        })
      }),
    getSession: (sessionId) => api.request(`/ai/sessions/${sessionId}`, { method: 'GET' })
  },

  // Health Check
  health: () => {
    const root = API_ROOT.replace(/\/$/, '');
    return fetch(`${root}/health`).then((r) => r.json());
  }
};
