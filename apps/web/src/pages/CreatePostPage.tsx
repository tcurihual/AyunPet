import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../lib/postsService';

const createPostSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  petid: z.coerce.number({ invalid_type_error: 'Ingresa un ID de mascota válido' }).min(1, 'petid debe ser mayor a 0'),
  imageUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

type CreatePostData = z.infer<typeof createPostSchema>;

const CreatePostPage: React.FC = () => {
  const { isLoading, setLoading } = useLoading();
  const { user, token } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
  });

  const onSubmit = async (data: CreatePostData) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        petid: Number(data.petid),
        imageUrl: data.imageUrl?.trim() || undefined,
      };

      const tokenFromStorage = token || localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
      const result = await createPost(tokenFromStorage, payload);
      if (!result.ok) {
        if (!tokenFromStorage) throw new Error('No estás autenticado. Debes incluir un token de autorización');
        throw new Error(result.error || 'Error al crear la publicación');
      }

      reset();
      alert('Publicación creada correctamente');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error al crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-container">
        <Header />
        <main className="page-content">
          <h2>Inicia sesión para crear una publicación</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <main className="page-content">
        <h1 className="title-center">Crear Nueva Publicación</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form-card" noValidate>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input id="title" type="text" {...register('title')} disabled={isLoading} />
            {errors.title && <p className="error-message">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea id="description" {...register('description')} disabled={isLoading} />
            {errors.description && <p className="error-message">{errors.description.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="petid">ID de mascota (petid)</label>
            <input id="petid" type="number" min={1} step={1} {...register('petid')} disabled={isLoading} />
            {errors.petid && <p className="error-message">{errors.petid.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">URL de la imagen (opcional)</label>
            <input id="imageUrl" type="text" {...register('imageUrl')} disabled={isLoading} />
            {errors.imageUrl && <p className="error-message">{errors.imageUrl.message}</p>}
          </div>

          <button type="submit" className="btn btn-submit" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear Publicación'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePostPage;
