import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Changed to false for token-based auth
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from localStorage first
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('auth_token');
      
      // If no token in localStorage, try to get it from NextAuth session
      if (!token) {
        try {
          // Dynamically import to avoid SSR issues
          const { getSession } = await import('next-auth/react');
          const session = await getSession();
          if (session?.user?.token) {
            token = session.user.token;
            localStorage.setItem('auth_token', token);
          }
        } catch (e) {
          // Ignore errors - might be on server side
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're on a page that requires authentication
      // Don't redirect for public pages like product details
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const authRequiredPaths = ['/profile', '/settings', '/my-reviews', '/my-submissions', '/submit'];
      const isAuthRequired = authRequiredPaths.some(path => currentPath.startsWith(path));
      
      if (isAuthRequired) {
        // Clear token and redirect to login only for authenticated pages
        localStorage.removeItem('auth_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      // For public pages, just reject the promise - let the component handle it
    }
    return Promise.reject(error);
  }
);

export default api;

// API Functions

// Auth
export const auth = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/register', data).then(response => {
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response;
    }),
  login: (data: { email: string; password: string }) =>
    api.post('/login', data).then(response => {
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response;
    }),
  logout: () => {
    localStorage.removeItem('auth_token');
    return api.post('/logout');
  },
  me: () => api.get('/me'),
  updateProfile: (data: { name?: string; current_password?: string; password?: string; password_confirmation?: string }) =>
    api.put('/user/profile', data),
};

// User Stats
export const userStats = {
  get: () => api.get('/user/stats'),
  getReviews: () => api.get('/user/reviews'),
  getRatings: () => api.get('/user/ratings'),
  getSubmissions: () => api.get('/user/submissions'),
};

// Categories
export const categories = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
  getItems: (slug: string, params?: any) => api.get(`/categories/${slug}/items`, { params }),
  getItemBySlug: (categorySlug: string, itemSlug: string) => 
    api.get(`/categories/${categorySlug}/items/${itemSlug}`),
};

// Products
export const products = {
  getAll: (params?: any) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
};

// Reviews
export const reviews = {
  getAll: (params: { reviewable_type: string; reviewable_id: number }) =>
    api.get('/reviews', { params }),
  create: (data: any) => api.post('/reviews', data),
  update: (id: number, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: number) => api.delete(`/reviews/${id}`),
  report: (id: number) => api.post(`/reviews/${id}/report`),
};

// Ratings
export const ratings = {
  getAll: (params: { ratable_type: string; ratable_id: number }) =>
    api.get('/ratings', { params }),
  getUserRating: (params: { ratable_type: string; ratable_id: number }) =>
    api.get('/ratings/user', { params }),
  create: (data: any) => api.post('/ratings', data),
  delete: (id: number) => api.delete(`/ratings/${id}`),
};

// Search
export const search = {
  global: (query: string, category?: string) =>
    api.get('/search', { params: { q: query, category } }),
  filter: (params: any) => api.get('/filter', { params }),
};

// Item Update Requests
export const itemUpdates = {
  submit: (data: { item_type: string; item_id: number; proposed_data: any }) =>
    api.post('/item-updates', data),
  getAll: () => api.get('/item-updates'),
  approve: (id: number) => api.post(`/item-updates/${id}/approve`),
  reject: (id: number, notes?: string) =>
    api.post(`/item-updates/${id}/reject`, { admin_notes: notes }),
};

// Items (generic - for all categories)
export const items = {
  delete: (category: string, id: number) => api.delete(`/items/${category}/${id}`),
};

