const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1').replace(/\/$/, '');

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

    const res = await fetch(`${API_BASE_URL}/adoptions/messages`, {
      method: 'GET',
      headers,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    
    let messages = payload.data || payload;
    if (Array.isArray(messages)) {
      messages = messages.filter((msg: any) => msg.postid === postId || msg.post_id === postId);
      messages = messages.map((msg: any) => ({
        id: msg.id,
        post_id: msg.postid || msg.post_id,
        user_id: msg.creatorid || msg.user_id,
        author: msg.creator_name || 'Usuario',
        content: msg.description,
        created_at: msg.createdat || msg.created_at || new Date().toISOString(),
      }));
    }
    
    return { ok: true, data: messages };
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

    const res = await fetch(`${API_BASE_URL}/adoptions/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        postid: input.post_id,
        description: input.content.trim(),
        status: 'active' 
      }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    
    const message = payload.data || payload;
    const comment: Comment = {
      id: message.id,
      post_id: message.postid || message.post_id,
      user_id: message.creatorid || message.user_id,
      author: message.creator_name || 'Tú',
      content: message.description,
      created_at: message.createdat || message.created_at || new Date().toISOString(),
    };
    
    return { ok: true, data: comment };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red al crear comentario' };
  }
}

/**
 * Actualiza un comentario existente
 * TEMPORAL: Usando endpoint PUT /adoptions/messages/{id}
 * FUTURO: PUT /adoptions/comments/:commentId
 */
export async function updateComment(token: string, commentId: number, content: string): Promise<ApiResult<Comment>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // TEMPORAL: Usando /messages/{id}
    const res = await fetch(`${API_BASE_URL}/adoptions/messages/${commentId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ description: content.trim() }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    
    // Mapear respuesta
    const message = payload.data || payload;
    const comment: Comment = {
      id: message.id,
      post_id: message.postid || message.post_id,
      user_id: message.creatorid || message.user_id,
      author: message.creator_name || 'Tú',
      content: message.description,
      created_at: message.createdat || message.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return { ok: true, data: comment };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red al actualizar comentario' };
  }
}
export async function deleteComment(token: string, commentId: number): Promise<ApiResult<void>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/adoptions/messages/${commentId}`, {
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
  updateComment,
  deleteComment
};