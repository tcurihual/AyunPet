// Servicio de Noticias - conecta con API AyunPet
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1').replace(/\/$/, '');

export interface News {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'close';
  creator_id: number;
  created_at: string;
  updated_at: string;
  date: string;
  start_time: string;
  end_time: string;
  images: string[];
}

export interface CreateNewsInput {
  title: string;
  description: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  status?: 'active' | 'inactive' | 'close';
  files?: File[];
}

export interface UpdateNewsInput extends Partial<CreateNewsInput> {}

export interface ApiResult<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

// GET /v1/entities/news - Listar todas las noticias (ahora admite token)
export async function getAllNews(token?: string): Promise<ApiResult<News[]>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/entities/news`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

// POST /v1/entities/news - Crear noticia (solo admin)
export async function createNews(token: string, input: CreateNewsInput): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const formData = new FormData();
    formData.append('title', input.title);
    formData.append('description', input.description);
    if (input.date) formData.append('date', input.date);
    if (input.start_time) formData.append('start_time', input.start_time);
    if (input.end_time) formData.append('end_time', input.end_time);
    if (input.status) formData.append('status', input.status);
    if (input.files && input.files.length > 0) {
      input.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const res = await fetch(`${API_BASE_URL}/entities/news`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload.data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

// PATCH /v1/entities/news/:id - Actualizar noticia (solo admin)
export async function updateNews(token: string, id: number, input: UpdateNewsInput): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const formData = new FormData();
    if (input.title) formData.append('title', input.title);
    if (input.description) formData.append('description', input.description);
    if (input.date) formData.append('date', input.date);
    if (input.start_time) formData.append('start_time', input.start_time);
    if (input.end_time) formData.append('end_time', input.end_time);
    if (input.status) formData.append('status', input.status);
    if (input.files && input.files.length > 0) {
      input.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const res = await fetch(`${API_BASE_URL}/entities/news/${id}`, {
      method: 'PATCH',
      headers,
      body: formData,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload.data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

// DELETE /v1/entities/news/:id - Eliminar noticia (solo admin)
export async function deleteNews(token: string, id: number): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/entities/news/${id}`, {
      method: 'DELETE',
      headers,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}

// DELETE /v1/entities/news/:id/images - Eliminar imágenes específicas (solo admin)
export async function deleteNewsImages(token: string, id: number, fileNames: string[]): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/entities/news/${id}/images`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ fileNamesArray: fileNames }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}