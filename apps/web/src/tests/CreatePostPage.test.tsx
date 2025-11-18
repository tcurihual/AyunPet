import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreatePostPage from '../pages/CreatePostPage';

// Mock contexts
vi.mock('../context/LoadingContext', () => ({
  useLoading: () => ({ isLoading: false, setLoading: vi.fn() })
}));
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, email: 'test@ayunpet.com' }, token: 'fake-token' })
}));

// Mock service
vi.mock('../lib/postsService', () => ({
  createPost: vi.fn(),
}));

import { createPost } from '../lib/postsService';

const renderPage = () => render(
  <BrowserRouter>
    <CreatePostPage />
  </BrowserRouter>
);

describe('CreatePostPage - Integración con API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => cleanup());

  it('envía payload válido al servicio createPost con token', async () => {
    (createPost as any).mockResolvedValue({ ok: true, data: { id: 123 } });

    renderPage();

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Un buen título' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Una descripción suficientemente larga' } });
    fireEvent.change(screen.getByLabelText('URL de la imagen (opcional)'), { target: { value: 'https://example.com/img.jpg' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear Publicación/i }));

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith('fake-token', {
        title: 'Un buen título',
        description: 'Una descripción suficientemente larga',
        imageUrl: 'https://example.com/img.jpg'
      });
    });
  });

  it('muestra error cuando API responde con error', async () => {
    (createPost as any).mockResolvedValue({ ok: false, error: 'No autorizado' });

    // Mock alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderPage();

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'ABC' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción válida' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear Publicación/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('No autorizado');
    });

    alertSpy.mockRestore();
  });
});
