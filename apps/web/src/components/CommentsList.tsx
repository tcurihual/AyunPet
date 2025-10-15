import React, { useState } from 'react';

export type Comment = {
  id: number;
  author: string;
  content: string;
  date: string;
};

const CommentsList: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'María López',
      content: '¡Qué tierno! Espero que encuentre una familia pronto ❤️',
      date: '2025-10-12',
    },
    {
      id: 2,
      author: 'Juan Pérez',
      content: 'Me interesa adoptar, ¿dónde puedo contactarlos?',
      date: '2025-10-13',
    },
  ]);

  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newItem: Comment = {
      id: Date.now(),
      author: 'Usuario actual',
      content: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    setComments([newItem, ...comments]);
    setNewComment('');
  };

  return (
    <section className="comments-section">
      <h2>Comentarios</h2>

      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          rows={3}
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-textarea"
        />
        <button type="submit" className="btn btn-primary btn-comment">
          Comentar
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="no-comments-message">
          Aún no hay comentarios. Sé el primero en opinar.
        </p>
      ) : (
        <ul className="comments-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <p className="comment-content">{c.content}</p>
              <small className="comment-meta">
                — <strong>{c.author}</strong>, {c.date}
              </small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CommentsList;