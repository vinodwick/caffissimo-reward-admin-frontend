const BASE = 'http://localhost:8000/api/v1';

let authToken = localStorage.getItem('admin_token');
let currentUser = null;

function headers() {
  const h = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (authToken) h['Authorization'] = `Bearer ${authToken}`;
  return h;
}

async function request(method, path, body) {
  const opts = { method, headers: headers() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

const api = {
  setToken(token) { authToken = token; localStorage.setItem('admin_token', token); },
  clearToken() { authToken = null; localStorage.removeItem('admin_token'); },
  isLoggedIn() { return !!authToken; },

  // User handling
  setUser(user) { currentUser = user; localStorage.setItem('admin_user', JSON.stringify(user)); },
  getUser() { if (!currentUser) { const stored = localStorage.getItem('admin_user'); currentUser = stored ? JSON.parse(stored) : null; } return currentUser; },

  // Auth
  login: (email, password) => request('POST', '/admin/login', { email, password }),

  // Dashboard
  getDashboard: () => request('GET', '/admin/dashboard'),

  // Customers
  getCustomers: (params = '') => request('GET', `/admin/customers?${params}`),
  getCustomer: (id) => request('GET', `/admin/customers/${id}`),
  createCustomer: (data) => request('POST', '/admin/customers', data),

  // Visits
  recordVisit: (data) => request('POST', '/admin/visits/record', data),

  // Branches
  getBranches: () => request('GET', '/admin/branches'),
  createBranch: (data) => request('POST', '/admin/branches', data),
  updateBranch: (id, data) => request('PUT', `/admin/branches/${id}`, data),

  // Rewards
  getRewards: (params = '') => request('GET', `/admin/rewards?${params}`),
  redeemReward: (id, data) => request('POST', `/admin/rewards/${id}/redeem`, data),
  voidReward: (id) => request('POST', `/admin/rewards/${id}/void`),

  // Promotions
  getPromotions: (params = '') => request('GET', `/admin/promotions?${params}`),
  createPromotion: (data) => request('POST', '/admin/promotions', data),
  updatePromotion: (id, data) => request('PUT', `/admin/promotions/${id}`, data),

  // Users
  getUsers: () => request('GET', '/admin/users'),
  createUser: (data) => request('POST', '/admin/users', data),

  // Visit Rewards Config
  getVisitRewards: () => request('GET', '/admin/visit-rewards'),
  createVisitReward: async (formData) => {
    // For file uploads we can't send JSON. Let's use fetch directly with FormData.
    const opts = { method: 'POST', headers: {} };
    if (authToken) opts.headers['Authorization'] = `Bearer ${authToken}`;
    opts.body = formData;
    const res = await fetch(`${BASE}/admin/visit-rewards`, opts);
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  },

  // Reports
  getReports: (range = '30d') => request('GET', `/admin/reports?range=${range}`),

  // Settings
  getSettings: () => request('GET', '/admin/settings'),
  updateSettings: (data) => request('PUT', '/admin/settings', data),
  getApiRoutes: () => request('GET', '/admin/settings/api-routes'),
  updateBranding: async (formData) => {
    const opts = { method: 'POST', headers: {} };
    if (authToken) opts.headers['Authorization'] = `Bearer ${authToken}`;
    opts.body = formData;
    const res = await fetch(`${BASE}/admin/settings/branding`, opts);
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  },

  // Tiers
  getTiers: () => request('GET', '/admin/tiers'),
  updateTier: (id, data) => request('PUT', `/admin/tiers/${id}`, data),
  logout: () => { api.clearToken(); api.setUser(null); window.location.href = '/login'; },
};

export default api;
