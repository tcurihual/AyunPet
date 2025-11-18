// Base URL de la API - se ajusta dinámicamente según ambiente
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com').replace(/\/$/, '');

// Interfaces basadas en el contrato de la API
export interface Comment {
  id: number;
  publication_id: number; // Coincide con la API
  user_id: number;
  content: string;
  created_at: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateCommentInput {
  content: string;
}

export interface ApiResult<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Obtiene todos los comentarios de una publicación
 * GET /v1/adoptions/messages/post/{post_id}
 */
export async function getCommentsByPost(publicationId: number, token?: string): Promise<ApiResult<Comment[]>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    console.log(`[CommentService] Fetching comments for publication ${publicationId}`);
    
    // RUTA CORRECTA
    const res = await fetch(`${API_BASE_URL}/v1/adoptions/messages/post/${publicationId}`, {
      method: 'GET',
      headers,
    });

    const payload = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      console.error('[CommentService] Error fetching comments:', payload);
      return { 
        ok: false, 
        error: payload?.message || payload?.error || `Error ${res.status}: ${res.statusText}` 
      };
    }
    
    console.log('[CommentService] Comments fetched successfully:', payload);
    return { ok: true, data: payload.data || payload };
  } catch (e: any) {
    console.error('[CommentService] Network error:', e);
    return { ok: false, error: e?.message || 'Error de red al obtener comentarios' };
  }
}

/**
 * Crea un nuevo comentario en una publicación
 * POST /v1/adoptions/messages
 */
export async function createComment(
  publicationId: number, 
  token: string, 
  userId: number, // <-- AÑADIDO: Para enviar 'creatorId'
  input: CreateCommentInput
): Promise<ApiResult<Comment>> {
  try {
    if (!input.content || input.content.trim().length === 0) {
      return { ok: false, error: 'El contenido del comentario no puede estar vacío' };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    console.log(`[CommentService] Creating comment for publication ${publicationId}`);
    
    const res = await fetch(`${API_BASE_URL}/v1/adoptions/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        // CORRECCIÓN: Usar los nombres de campo esperados por el servidor
        creatorId: userId, // ID del usuario logeado
        postId: publicationId, // ID de la publicación
        description: input.content.trim() // Contenido del comentario
      }),
    });

    const payload = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      console.error('[CommentService] Error creating comment:', payload);
      return { 
        ok: false, 
        error: payload?.message || payload?.error || `Error ${res.status}: ${res.statusText}` 
      };
    }
    
    console.log('[CommentService] Comment created successfully:', payload);
    return { ok: true, data: payload.data || payload };
  } catch (e: any) {
    console.error('[CommentService] Network error:', e);
    return { ok: false, error: e?.message || 'Error de red al crear comentario' };
  }
}

/**
 * Actualiza un comentario existente
 * PUT /v1/adoptions/messages/:commentId
 */
export async function updateComment(
  commentId: number,
  token: string,
  content: string
): Promise<ApiResult<Comment>> {
  try {
    if (!content || content.trim().length === 0) {
      return { ok: false, error: 'El contenido del comentario no puede estar vacío' };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    console.log(`[CommentService] Updating comment ${commentId}`);
    
    // RUTA CORRECTA
    const res = await fetch(`${API_BASE_URL}/v1/adoptions/messages/${commentId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ content: content.trim() }),
    });

    const payload = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      console.error('[CommentService] Error updating comment:', payload);
      return { 
        ok: false, 
        error: payload?.message || payload?.error || `Error ${res.status}: ${res.statusText}` 
      };
    }
    
    console.log('[CommentService] Comment updated successfully:', payload);
    return { ok: true, data: payload.data || payload };
  } catch (e: any) {
    console.error('[CommentService] Network error:', e);
    return { ok: false, error: e?.message || 'Error de red al actualizar comentario' };
  }
}

/**
 * Elimina un comentario
 * DELETE /v1/adoptions/messages/:commentId
 */
export async function deleteComment(token: string, commentId: number): Promise<ApiResult<void>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    console.log(`[CommentService] Deleting comment ${commentId}`);
    
    // RUTA CORRECTA
    const res = await fetch(`${API_BASE_URL}/v1/adoptions/messages/${commentId}`, {
      method: 'DELETE',
      headers,
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      console.error('[CommentService] Error deleting comment:', payload);
      return { 
        ok: false, 
        error: payload?.message || payload?.error || `Error ${res.status}: ${res.statusText}` 
      };
    }
    
    console.log('[CommentService] Comment deleted successfully');
    return { ok: true };
  } catch (e: any) {
    console.error('[CommentService] Network error:', e);
    return { ok: false, error: e?.message || 'Error de red al eliminar comentario' };
  }
}

export default {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment
};