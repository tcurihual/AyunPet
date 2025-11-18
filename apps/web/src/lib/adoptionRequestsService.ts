// apps/web/src/lib/adoptionRequestsService.ts
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1').replace(/\/$/, '');

export interface CreateAdoptionRequestInput {
  post_id: number;
  message: string;
}

export interface AdoptionRequest {
  id: number;
  user_id: number;
  post_id: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
  postImages: string[];
  postTitle?: string;
  postDescription?: string;
  petitionerName?: string;
  statusColor?: string;
}

export interface AdoptionRequestsResponse {
  type: 'success' | 'error';
  message: string;
  data: AdoptionRequest[] | { status: string };
}

export interface ApiResult<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

// POST /v1/adoptions/adoption-requests - Crear solicitud
export async function createAdoptionRequest(token: string, input: CreateAdoptionRequestInput): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/adoptions/adoption-requests`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

// GET /v1/adoptions/adoption-requests - Listar solicitudes (rol-dependiente)
export async function getAdoptionRequests(token: string, page = 1, pageSize = 10): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    const res = await fetch(`${API_BASE_URL}/adoptions/adoption-requests?${params}`, {
      method: 'GET',
      headers,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

// GET /v1/adoptions/adoption-requests/mine - Mis solicitudes
export async function getMyAdoptionRequests(token: string): Promise<ApiResult<AdoptionRequestsResponse>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/adoptions/adoption-requests/mine`, {
      method: 'GET',
      headers,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

// GET /v1/adoptions/adoption-requests/{id} - Detalle de solicitud
export async function getAdoptionRequestById(token: string, id: number): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/adoptions/adoption-requests/${id}`, {
      method: 'GET',
      headers,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

// POST /v1/adoptions/adoption-requests/{id}/confirm-accept - Aceptar solicitud
export interface ConfirmAcceptInput {
  confirmation_code?: string;
  notes?: string;
}

export async function confirmAcceptAdoptionRequest(token: string, id: number, input: ConfirmAcceptInput): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/adoptions/adoption-requests/${id}/confirm-accept`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

// POST /v1/adoptions/adoption-requests/validate-code - Validar código
export interface ValidateCodeInput {
  code: string;
}

export async function validateAdoptionCode(token: string, input: ValidateCodeInput): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/adoptions/adoption-requests/validate-code`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}
