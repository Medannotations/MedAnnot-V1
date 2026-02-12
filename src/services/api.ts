/**
 * API Client - MedAnnot
 * Remplace Supabase par notre API maison
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
    visit_date?: string;
    visit_time?: string;
    visit_duration?: number;
    transcription?: string;
    structure_used?: string;
    audio_duration?: number;
    was_transcription_edited?: boolean;
    was_content_edited?: boolean;
    vital_signs?: any;
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

// ============ STRIPE CHECKOUT ============
export const stripeCheckout = {
  async createSession(params: { priceId: string; email: string; userId: string }) {
    return fetchWithAuth('/stripe-checkout', {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/signup`,
      }),
    });
  },

  async verifySession(sessionId: string) {
    return fetchWithAuth('/stripe/verify-session', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  },

  async cancel() {
    return fetchWithAuth('/stripe-cancel-subscription', {
      method: 'POST',
    });
  },
};

// ============ CONFIGURATIONS ============
export const configurations = {
  async get() {
    return fetchWithAuth('/configurations');
  },

  async upsert(annotationStructure: string) {
    return fetchWithAuth('/configurations', {
      method: 'POST',
      body: JSON.stringify({ annotationStructure }),
    });
  },
};

// ============ EXAMPLE ANNOTATIONS ============
export const exampleAnnotations = {
  async list() {
    return fetchWithAuth('/example-annotations');
  },

  async create(data: { title: string; content: string }) {
    return fetchWithAuth('/example-annotations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: { title?: string; content?: string }) {
    return fetchWithAuth(`/example-annotations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/example-annotations/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ PHRASE TEMPLATES ============
export const phraseTemplates = {
  async list() {
    return fetchWithAuth('/phrase-templates');
  },

  async create(data: { category: string; label: string; content: string; shortcut?: string }) {
    return fetchWithAuth('/phrase-templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: { category?: string; label?: string; content?: string; shortcut?: string }) {
    return fetchWithAuth(`/phrase-templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/phrase-templates/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ PATIENT TAGS ============
export const patientTags = {
  async list() {
    return fetchWithAuth('/patient-tags');
  },

  async create(data: { name: string; color: string }) {
    return fetchWithAuth('/patient-tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/patient-tags/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ VITAL SIGNS ============
export const vitalSigns = {
  async getToday(patientId: string, date: string) {
    return fetchWithAuth(`/vital-signs/${patientId}?date=${date}`);
  },

  async save(data: { patientId: string; date: string; vitalSigns: any }) {
    return fetchWithAuth('/vital-signs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getHistory(patientId: string) {
    return fetchWithAuth(`/vital-signs/${patientId}/history`);
  },
};

// ============ TRANSCRIPTION ============
export const transcription = {
  async transcribe(audioBlob: Blob): Promise<{ transcription: string }> {
    const token = getToken();
    const formData = new FormData();
    const ext = audioBlob.type?.includes('mp4') ? 'mp4' : 'webm';
    formData.append('audio', audioBlob, `recording.${ext}`);

    const response = await fetch(`${API_URL}/transcribe`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new ApiError(response.status, error.error || 'Erreur de transcription');
    }

    return response.json();
  },
};

// ============ AI GENERATION ============
export const aiGeneration = {
  async generate(params: any): Promise<{ annotation: string; pseudonymUsed?: string; demo?: boolean }> {
    return fetchWithAuth('/generate-annotation', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
  async analyzeStructure(annotation: string): Promise<{ structure: string; success: boolean }> {
    return fetchWithAuth('/analyze-structure', {
      method: 'POST',
      body: JSON.stringify({ annotation }),
    });
  },
};

// ============ ADMIN ============
export const admin = {
  // Login autonome admin (email + password → vérifie admin → envoie code 2FA)
  async login(email: string, password: string): Promise<{ token: string; codeSent: boolean; email: string }> {
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new ApiError(response.status, error.error || 'Erreur inconnue');
    }
    const data = await response.json();
    // Sauvegarder le JWT temporaire pour les requêtes admin suivantes
    setToken(data.token);
    return data;
  },

  // Vérifier le code 2FA
  async verifyCode(code: string): Promise<{ token: string }> {
    return fetchWithAuth('/admin/verify-code', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  // Vérifier session admin existante
  async checkSession(sessionToken: string): Promise<{ valid: boolean }> {
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const response = await fetch(`${API_URL}/admin/check-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: sessionToken }),
    });
    return response.json();
  },

  async getStats() {
    return fetchWithAuth('/admin/stats');
  },

  async getUsers() {
    return fetchWithAuth('/admin/users');
  },

  async createUser(data: {
    email: string;
    password: string;
    fullName: string;
    subscription_status: string;
  }): Promise<{ success: boolean; user: any }> {
    return fetchWithAuth('/admin/create-user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateUser(userId: string, updates: { subscription_status?: string }) {
    return fetchWithAuth(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};

export { ApiError, getToken, setToken, removeToken };
