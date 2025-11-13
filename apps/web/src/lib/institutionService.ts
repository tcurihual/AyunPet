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
  // Campos adicionales que podrían venir del API
  phone?: string;
  website?: string;
  profilePicture?: string;
  avatar?: string;
  updatedAt?: string;
  [key: string]: any; // Para capturar cualquier otro campo que devuelva la API
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  status: string;
  adopted?: boolean;
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
    [key: string]: any;
  };
  createdAt: string;
  updatedAt?: string;
  [key: string]: any;
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
 * 
 * @param institutionId ID de la institución
 * @param token Token de autenticación (opcional)
 * @returns Perfil de la institución o error
 */
export async function fetchInstitutionProfile(
  institutionId: string,
  token?: string
): Promise<ApiResult<InstitutionProfile>> {
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

    if (!res.ok) {
      return {
        ok: false,
        error: payload?.message || payload?.error || `Error ${res.status}`,
      };
    }

    // La API puede devolver data envuelta o directo
    const profileData = payload.data || payload;
    console.log('[fetchInstitutionProfile] Datos recibidos de API:', profileData);

    return { ok: true, data: profileData as InstitutionProfile };
  } catch (e: any) {
    console.error('[fetchInstitutionProfile] Error:', e);
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

/**
 * Obtiene las publicaciones (mascotas) de una institución
 * Endpoint: GET /v1/adoptions/publications?creatorId={institutionId}
 * 
 * @param institutionId ID de la institución
 * @param token Token de autenticación (opcional)
 * @returns Lista de publicaciones o error
 */
export async function fetchInstitutionPublications(
  institutionId: string,
  token?: string
): Promise<ApiResult<Publication[]>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(
      `${API_BASE_URL}/adoptions/publications?creatorId=${institutionId}`,
      {
        method: 'GET',
        headers,
      }
    );

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        error: payload?.message || payload?.error || `Error ${res.status}`,
      };
    }

    // La API retorna un array o envuelto en 'data'
    const publications = Array.isArray(payload)
      ? payload
      : payload.data || [];
    console.log('[fetchInstitutionPublications] Publicaciones recibidas:', publications.length);

    return { ok: true, data: publications as Publication[] };
  } catch (e: any) {
    console.error('[fetchInstitutionPublications] Error:', e);
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

/**
 * Obtiene las solicitudes de adopción recibidas por una institución
 * Endpoint: GET /v1/adoptions/adoption-requests?institutionId={institutionId}
 * 
 * @param institutionId ID de la institución
 * @param token Token de autenticación (opcional)
 * @returns Lista de solicitudes de adopción o error
 */
export async function fetchInstitutionAdoptionRequests(
  institutionId: string,
  token?: string
): Promise<ApiResult<any[]>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(
      `${API_BASE_URL}/adoptions/adoption-requests?institutionId=${institutionId}`,
      {
        method: 'GET',
        headers,
      }
    );

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        error: payload?.message || payload?.error || `Error ${res.status}`,
      };
    }

    const requests = Array.isArray(payload) ? payload : payload.data || [];
    console.log('[fetchInstitutionAdoptionRequests] Solicitudes recibidas:', requests.length);

    return { ok: true, data: requests };
  } catch (e: any) {
    console.error('[fetchInstitutionAdoptionRequests] Error:', e);
    return { ok: false, error: e?.message || 'Error de red' };
  }
}
