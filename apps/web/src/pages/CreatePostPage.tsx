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
  pet_id: z.coerce.number({ invalid_type_error: 'Ingresa un ID de mascota válido' }).min(1, 'pet_id debe ser mayor a 0'),
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
        pet_id: Number(data.pet_id),
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
            <label htmlFor="pet_id">ID de mascota (pet_id)</label>
            <input id="pet_id" type="number" min={1} step={1} {...register('pet_id')} disabled={isLoading} />
            {errors.pet_id && <p className="error-message">{errors.pet_id.message}</p>}
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
