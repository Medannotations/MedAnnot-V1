/**
 * API Client - MedAnnot
 * Remplace Supabase par notre API maison
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token storage
const getToken = () => localStorage.getItem('medannot_token');
const setToken = (token: string) => localStorage.setItem('medannot_token', token);
const removeToken = () => localStorage.removeItem('medannot_token');

// Fetch avec auth
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
    throw new ApiError(response.status, error.error || error.message || 'Erreur inconnue');
  }

  return response.json();
}

// ============ AUTH ============
export const auth = {
  async register(email: string, password: string, fullName: string) {
    const data = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    setToken(data.token);
    return data;
  },

  async login(email: string, password: string) {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  logout() {
    removeToken();
  },

  getToken,
  isAuthenticated: () => !!getToken(),
};

// ============ PROFILE ============
export const profile = {
  async get() {
    return fetchWithAuth('/profile');
  },

  async update(updates: { fullName?: string }) {
    return fetchWithAuth('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};

// ============ PATIENTS ============
export const patients = {
  async list() {
    return fetchWithAuth('/patients');
  },

  async create(patient: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    email?: string;
    phone?: string;
    notes?: string;
  }) {
    return fetchWithAuth('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  },

  async update(id: string, updates: Partial<typeof patients.create>) {
    return fetchWithAuth(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/patients/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ ANNOTATIONS ============
export const annotations = {
  async list() {
    return fetchWithAuth('/annotations');
  },

  async create(annotation: {
    patientId?: string;
    content: string;
    type?: string;
  }) {
    return fetchWithAuth('/annotations', {
      method: 'POST',
      body: JSON.stringify(annotation),
    });
  },

  async update(id: string, updates: Partial<typeof annotations.create>) {
    return fetchWithAuth(`/annotations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/annotations/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ SUBSCRIPTION ============
export const subscription = {
  async get() {
    return fetchWithAuth('/get-subscription', {
      method: 'POST',
    });
  },

  async createPortal() {
    const data = await fetchWithAuth('/stripe-portal', {
      method: 'POST',
    });
    return data.url;
  },
};

// ============ HEALTH ============
export const health = {
  async check() {
    const response = await fetch(`${API_URL}/health`);
    return response.json();
  },
};

export { ApiError, getToken, setToken, removeToken };
