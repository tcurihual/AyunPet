// Servicio de Posts - conecta con API AyunPet (contrato actualizado)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1').replace(/\/$/, '');

export interface CreatePostInput {
  title: string;
  description: string;
  petid: number; // requerido por API
  imageUrl?: string; // ignorado por API si no se soporta
}

export interface ApiResult<T=any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export async function createPost(token: string, input: CreatePostInput): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Endpoint correcto según especificación: /v1/adoptions/posts
    const res = await fetch(`${API_BASE_URL}/adoptions/posts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: input.title,
        description: input.description,
        petid: Number(input.petid),
      }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}
