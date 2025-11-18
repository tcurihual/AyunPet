import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: number;
  creator_id: number;
  post_id: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    name: string;
    profilePhoto: string | null;
  };
}

interface CommentsListProps {
  postId: number;
  AvatarComponent: React.FC<{ name: string; size?: number }>;
}

const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

const CommentItem: React.FC<{ 
  comment: Comment; 
  AvatarComponent: React.FC<{ name: string; size?: number }> 
}> = ({ comment, AvatarComponent }) => (
  <div
    style={{
      display: 'flex',
      gap: '1rem',
      padding: '1.25rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px'
    }}
  >
    <AvatarComponent name={comment.creator.name} size={40} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#2c3e50' }}>
          {comment.creator.name}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#495057' }}>
        {comment.description}
      </p>
    </div>
  </div>
);

const CommentsList: React.FC<CommentsListProps> = ({ postId, AvatarComponent }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/adoptions/messages/post/${postId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          setComments(result.data);
        } else if (Array.isArray(result)) {
          setComments(result);
        }
      }
    } catch (error) {
      // No hacer nada, solo evitar que caiga la interfaz
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    setError(null);
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';

    try {
      const body = {
        postId: postId,
        creatorId: user.id,
        description: newComment
      };

      const response = await fetch(
        `${API_BASE_URL}/adoptions/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (response.ok) {
        setNewComment('');
        await loadComments();
      } else {
        const responseData = await response.json();
        setError(responseData?.message || 'Error al enviar comentario');
      }
    } catch (error) {
      setError('Error de conexión al enviar comentario');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
        Cargando comentarios...
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {user && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <AvatarComponent name={user.name || user.email} size={44} />
            <div style={{ flex: 1 }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                disabled={submitting}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none',
                  backgroundColor: submitting ? '#f5f5f5' : 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              {error && (
                <div style={{ 
                  color: '#d32f2f', 
                  fontSize: '0.85rem', 
                  marginTop: '0.5rem',
                  padding: '0.5rem'
                }}>
                  ⚠️ {error}
                </div>
              )}
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                style={{
                  marginTop: '0.75rem',
                  padding: '0.65rem 1.5rem',
                  backgroundColor: !newComment.trim() || submitting ? '#ccc' : '#FF6B35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: !newComment.trim() || submitting ? 'not-allowed' : 'pointer',
                  boxShadow: !newComment.trim() || submitting ? 'none' : '0 2px 8px rgba(255, 107, 53, 0.3)'
                }}
              >
                {submitting ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </div>
        </form>
      )}

      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', marginBottom: '1.5rem' }}>
        {comments.length > 0 ? `Comentarios (${comments.length})` : 'Comentarios'}
      </h3>

      {comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💬</div>
          <p style={{ color: '#7f8c8d', margin: 0, fontSize: '1rem' }}>Sé el primero en comentar</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {comments.map((comment) => (
            <CommentItem 
              key={comment.id}
              comment={comment}
              AvatarComponent={AvatarComponent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsList;
