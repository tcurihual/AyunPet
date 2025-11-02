// Servicio de Posts - conecta con API AyunPet
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1').replace(/\/$/, '');

export interface CreatePostInput {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface ApiResult<T=any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export async function createPost(token: string, input: CreatePostInput): Promise<ApiResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/adoptions/publications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(input),
      // Importante: no enviar credenciales para evitar CORS con '*'
      // credentials: 'omit' // (omit es el valor por defecto)
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    }

    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}
