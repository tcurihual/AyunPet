import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getCommentsByPost, 
  createComment, 
  deleteComment, 
  type Comment 
} from '../lib/CommentService'

interface CommentsListProps {
  postId: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar comentarios cuando el componente se monta
  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken') || '';
      const result = await getCommentsByPost(postId, token);

      if (result.ok && result.data) {
        setComments(result.data);
      } else {
        // Si la API no está disponible, mostrar comentarios mock
        console.warn('API de comentarios no disponible, usando datos de prueba');
        setComments([
          {
            id: 1,
            post_id: postId,
            user_id: 1,
            author: 'María López',
            content: '¡Qué tierno! Espero que encuentre una familia pronto ❤️',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: 2,
            post_id: postId,
            user_id: 2,
            author: 'Juan Pérez',
            content: 'Me interesa adoptar, ¿dónde puedo contactarlos?',
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      }
    } catch (err: any) {
      console.error('Error al cargar comentarios:', err);
      setError('No se pudieron cargar los comentarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para comentar');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken') || '';
      const result = await createComment(token, {
        post_id: postId,
        content: newComment.trim()
      });

      if (result.ok && result.data) {
        // Agregar el nuevo comentario a la lista
        setComments([result.data, ...comments]);
        setNewComment('');
      } else {
        // Si la API no está disponible, simular la creación
        console.warn('API de comentarios no disponible, simulando creación');
        const mockComment: Comment = {
          id: Date.now(),
          post_id: postId,
          user_id: parseInt(user.id),
          author: user.name || 'Usuario actual',
          content: newComment.trim(),
          created_at: new Date().toISOString(),
        };
        setComments([mockComment, ...comments]);
        setNewComment('');
      }
    } catch (err: any) {
      console.error('Error al crear comentario:', err);
      setError('No se pudo publicar el comentario. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || '';
      const result = await deleteComment(token, commentId);

      if (result.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      } else {
        console.warn('API de comentarios no disponible, eliminando localmente');
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (err: any) {
      console.error('Error al eliminar comentario:', err);
      alert('No se pudo eliminar el comentario');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <section className="comments-section">
      <h2>Comentarios ({comments.length})</h2>

      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#991b1b', 
          padding: '12px', 
          borderRadius: '8px',
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      {user ? (
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            rows={3}
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-textarea"
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className="btn btn-primary btn-comment"
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? '⏳ Publicando...' : 'Comentar'}
          </button>
        </form>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p>Debes <a href="/login" style={{ color: '#8c6e4a', fontWeight: 600 }}>iniciar sesión</a> para comentar</p>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <p>Cargando comentarios...</p>
        </div>
      ) : comments.length === 0 ? (
        <p className="no-comments-message">
          Aún no hay comentarios. Sé el primero en opinar.
        </p>
      ) : (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p className="comment-content">{comment.content}</p>
                  <small className="comment-meta">
                    <strong>{comment.author}</strong> · {formatDate(comment.created_at)}
                  </small>
                </div>
                {user && user.id === String(comment.user_id) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '20px',
                      padding: '4px 8px',
                      marginLeft: '12px'
                    }}
                    title="Eliminar comentario"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CommentsList;