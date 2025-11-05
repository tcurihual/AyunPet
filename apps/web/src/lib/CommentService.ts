const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1').replace(/\/$/, '');
//mientras hacen la api de comentarios XD
export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  author: string; 
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateCommentInput {
  post_id: number;
  content: string;
}

export interface ApiResult<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export async function getCommentsByPost(postId: number, token?: string): Promise<ApiResult<Comment[]>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/v1/adoptions/publications/${postId}/comments`, {
      method: 'GET',
      headers,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    
    return { ok: true, data: payload.data || payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red al obtener comentarios' };
  }
}

export async function createComment(token: string, input: CreateCommentInput): Promise<ApiResult<Comment>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/v2/adoptions/publications/${input.post_id}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content: input.content.trim()
      }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    
    return { ok: true, data: payload.data || payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red al crear comentario' };
  }
}

export async function deleteComment(token: string, commentId: number): Promise<ApiResult<void>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/v1/adoptions/publications/comments/${commentId}`, {
      method: 'DELETE',
      headers,
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    }
    
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red al eliminar comentario' };
  }
}

export default {
  getCommentsByPost,
  createComment,
  deleteComment
};