// Servicio de Instituciones - conectar perfil de institución a la API
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1').replace(/\/$/, '');

export interface InstitutionProfile {
  id: string;
  name: string;
  email: string;
  rut: string;
  description?: string;
  address?: string;
  role: string;
  emailVerified: boolean;
  createdAt?: string;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  status: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  pet: {
    id: string;
    name: string;
    species: string;
    age_years: number;
    age_months: number;
    gender: string;
    size: string;
    sterilized: boolean;
  };
  createdAt: string;
}

export interface ApiResult<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Obtiene el perfil de una institución por su ID
 * Endpoint: GET /v1/entities/users/{id}
 */
export async function fetchInstitutionProfile(institutionId: string, token?: string): Promise<ApiResult<InstitutionProfile>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/entities/users/${institutionId}`, {
      method: 'GET',
      headers,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload.data || payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

/**
 * Obtiene las publicaciones (mascotas) de una institución
 * Endpoint: GET /v1/adoptions/publications?creatorId={institutionId}
 */
export async function fetchInstitutionPublications(institutionId: string, token?: string): Promise<ApiResult<Publication[]>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/adoptions/publications?creatorId=${institutionId}`, {
      method: 'GET',
      headers,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    
    // La API retorna un array o envuelto en 'data'
    const publications = Array.isArray(payload) ? payload : payload.data || [];
    return { ok: true, data: publications };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

/**
 * Obtiene las solicitudes de adopción recibidas por una institución
 * Endpoint: GET /v1/adoptions/adoption-requests?institutionId={institutionId}
 */
export async function fetchInstitutionAdoptionRequests(institutionId: string, token?: string): Promise<ApiResult<any[]>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/adoptions/adoption-requests?institutionId=${institutionId}`, {
      method: 'GET',
      headers,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    
    const requests = Array.isArray(payload) ? payload : payload.data || [];
    return { ok: true, data: requests };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}
