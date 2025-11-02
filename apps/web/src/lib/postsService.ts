// Servicio de Posts - conecta con API AyunPet
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1').replace(/\/$/, '');

export interface CreatePostInput {
  title: string;
  description: string;
  petid: number;
  imageUrl?: string;
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

    // NOTA: El gateway público actual solo expone GET /v1/adoptions/publications
    // NO tiene POST habilitado, por lo que este endpoint devolverá 404
    // hasta que el equipo publique la ruta de creación
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
    
    // Manejo especial para 404 (ruta no publicada aún)
    if (res.status === 404) {
      return { 
        ok: false, 
        error: 'La creación de publicaciones aún no está habilitada en este ambiente. Contacta al equipo de desarrollo.' 
      };
    }
    
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}