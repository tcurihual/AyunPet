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
  name: z.string().min(2, 'El nombre de la mascota debe tener al menos 2 caracteres'),
  age_years: z.coerce.number({ invalid_type_error: 'Ingresa una edad válida' }).min(0).max(30),
  age_months: z.coerce.number({ invalid_type_error: 'Ingresa meses válidos' }).min(0).max(11),
  gender: z.enum(['male', 'female'], { errorMap: () => ({ message: 'Selecciona un género' }) }),
  size: z.enum(['small', 'medium', 'large'], { errorMap: () => ({ message: 'Selecciona un tamaño' }) }),
  species: z.enum(['dog', 'cat', 'other'], { errorMap: () => ({ message: 'Selecciona una especie' }) }),
  sterilized: z.boolean(),
  files: z.any().optional(), // FileList del input
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
      // Convertir FileList a Array<File>
      const files = data.files && data.files.length > 0 
        ? Array.from(data.files as FileList) 
        : undefined;

      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        name: data.name.trim(),
        age_years: Number(data.age_years),
        age_months: Number(data.age_months),
        gender: data.gender,
        size: data.size,
        species: data.species,
        sterilized: Boolean(data.sterilized),
        files,
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
          {/* Campos del Post */}
          <div className="form-group">
            <label htmlFor="title">Título de la publicación</label>
            <input id="title" type="text" {...register('title')} disabled={isLoading} />
            {errors.title && <p className="error-message">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea id="description" {...register('description')} disabled={isLoading} />
            {errors.description && <p className="error-message">{errors.description.message}</p>}
          </div>

          {/* Campos de la Mascota */}
          <h3>Información de la Mascota</h3>
          
          <div className="form-group">
            <label htmlFor="name">Nombre de la mascota</label>
            <input id="name" type="text" {...register('name')} disabled={isLoading} />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age_years">Años</label>
              <input id="age_years" type="number" min={0} max={30} {...register('age_years')} disabled={isLoading} />
              {errors.age_years && <p className="error-message">{errors.age_years.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="age_months">Meses</label>
              <input id="age_months" type="number" min={0} max={11} {...register('age_months')} disabled={isLoading} />
              {errors.age_months && <p className="error-message">{errors.age_months.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Género</label>
            <select id="gender" {...register('gender')} disabled={isLoading}>
              <option value="">Selecciona un género</option>
              <option value="male">Macho</option>
              <option value="female">Hembra</option>
            </select>
            {errors.gender && <p className="error-message">{errors.gender.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="size">Tamaño</label>
            <select id="size" {...register('size')} disabled={isLoading}>
              <option value="">Selecciona un tamaño</option>
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
            </select>
            {errors.size && <p className="error-message">{errors.size.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="species">Especie</label>
            <select id="species" {...register('species')} disabled={isLoading}>
              <option value="">Selecciona una especie</option>
              <option value="dog">Perro</option>
              <option value="cat">Gato</option>
              <option value="other">Otro</option>
            </select>
            {errors.species && <p className="error-message">{errors.species.message}</p>}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" {...register('sterilized')} disabled={isLoading} />
              <span>La mascota está esterilizada</span>
            </label>
          </div>

          {/* Campo de Imágenes */}
          <div className="form-group">
            <label htmlFor="files">Imágenes de la mascota (opcional)</label>
            <input 
              id="files" 
              type="file" 
              accept="image/*" 
              multiple 
              {...register('files')} 
              disabled={isLoading} 
            />
            <small>Puedes subir múltiples imágenes</small>
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