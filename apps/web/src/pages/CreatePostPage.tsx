import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../lib/postsService';
import './css/CreatePostPage.css';

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
  files: z.any()
    .refine((files) => files?.length > 0, 'Debes subir al menos una imagen de la mascota')
    .refine((files) => files?.length <= 3, 'Máximo 3 imágenes permitidas'), // ✅ Cambiar a 3
});


type CreatePostData = z.infer<typeof createPostSchema>;

const CreatePostPage: React.FC = () => {
  const { isLoading, setLoading } = useLoading();
  const { user, token } = useAuth();
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      alert('❌ Solo puedes subir máximo 3 imágenes');
      e.target.value = '';
      setSelectedFiles([]);
      return;
    }
    setSelectedFiles(files);
    setValue('files', files.length > 0 ? files : undefined);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setValue('files', newFiles.length > 0 ? newFiles : undefined);
  };

const onSubmit = async (data: CreatePostData) => {
  setLoading(true);
  try {
    // ✅ Usar directamente selectedFiles en lugar de data.files
    if (selectedFiles.length === 0) {
      throw new Error('Debes subir al menos una imagen de la mascota');
    }

    if (selectedFiles.length > 3) {
      throw new Error('Máximo 3 imágenes permitidas');
    }

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
      files: selectedFiles, // ✅ Usar selectedFiles directamente
    };

    const tokenFromStorage = token || localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
    
    console.log('📤 Enviando payload:', {
      ...payload,
      files: payload.files.map(f => ({ name: f.name, size: f.size, type: f.type }))
    }); // ✅ Debug
    
    const result = await createPost(tokenFromStorage, payload);
    
    if (!result.ok) {
      if (!tokenFromStorage) throw new Error('No estás autenticado. Debes incluir un token de autorización');
      throw new Error(result.error || 'Error al crear la publicación');
    }

    reset();
    setSelectedFiles([]);
    alert('✅ Publicación creada correctamente');
  } catch (err: any) {
    console.error('❌ Error completo:', err);
    alert('❌ ' + (err.message || 'Error al crear la publicación'));
  } finally {
    setLoading(false);
  }
};


  if (!user) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className="not-authenticated-message">
            <h2>🔒 Acceso Restringido</h2>
            <p>Debes iniciar sesión para crear una publicación</p>
            <a href="/login" className="btn btn-primary">Ir a iniciar sesión</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <main className="main-content">
        <div className="create-post-container">
          <h1 className="create-post-title">Crear Nueva Publicación</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="create-post-form" noValidate>
            {/* Información del Post */}
            <div className="form-section">
              <h3 className="form-section-title">
                <span className="form-section-icon">📝</span>
                Información de la Publicación
              </h3>
              
              <div className="form-group">
                <label htmlFor="title">Título de la publicación *</label>
                <input 
                  id="title" 
                  type="text" 
                  {...register('title')} 
                  disabled={isLoading} 
                  placeholder="Ej: Perrito busca hogar" 
                />
                {errors.title && <p className="error-message">{errors.title.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción *</label>
                <textarea 
                  id="description" 
                  {...register('description')} 
                  disabled={isLoading} 
                  placeholder="Cuéntanos más sobre esta mascota..." 
                />
                {errors.description && <p className="error-message">{errors.description.message}</p>}
              </div>
            </div>

            {/* Información de la Mascota */}
            <div className="form-section">
              <h3 className="form-section-title">
                <span className="form-section-icon">🐾</span>
                Información de la Mascota
              </h3>
              
              <div className="form-group">
                <label htmlFor="name">Nombre de la mascota *</label>
                <input 
                  id="name" 
                  type="text" 
                  {...register('name')} 
                  disabled={isLoading} 
                  placeholder="Ej: Luna" 
                />
                {errors.name && <p className="error-message">{errors.name.message}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age_years">Años *</label>
                  <input 
                    id="age_years" 
                    type="number" 
                    min={0} 
                    max={30} 
                    {...register('age_years')} 
                    disabled={isLoading} 
                    placeholder="0" 
                  />
                  {errors.age_years && <p className="error-message">{errors.age_years.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="age_months">Meses *</label>
                  <input 
                    id="age_months" 
                    type="number" 
                    min={0} 
                    max={11} 
                    {...register('age_months')} 
                    disabled={isLoading} 
                    placeholder="0" 
                  />
                  {errors.age_months && <p className="error-message">{errors.age_months.message}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Género *</label>
                  <select id="gender" {...register('gender')} disabled={isLoading}>
                    <option value="">Selecciona un género</option>
                    <option value="male">Macho</option>
                    <option value="female">Hembra</option>
                  </select>
                  {errors.gender && <p className="error-message">{errors.gender.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="species">Especie *</label>
                  <select id="species" {...register('species')} disabled={isLoading}>
                    <option value="">Selecciona una especie</option>
                    <option value="dog">Perro</option>
                    <option value="cat">Gato</option>
                    <option value="other">Otro</option>
                  </select>
                  {errors.species && <p className="error-message">{errors.species.message}</p>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="size">Tamaño *</label>
                <select id="size" {...register('size')} disabled={isLoading}>
                  <option value="">Selecciona un tamaño</option>
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                </select>
                {errors.size && <p className="error-message">{errors.size.message}</p>}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" {...register('sterilized')} disabled={isLoading} />
                  <span>La mascota está esterilizada</span>
                </label>
              </div>
            </div>

            {/* Imágenes */}
            <div className="form-section">
              <h3 className="form-section-title">
                <span className="form-section-icon">📷</span>
                Imágenes
              </h3>
              
              <div className="form-group">
                <label htmlFor="files">Imágenes de la mascota *</label>
                <input 
                  id="files" 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange}
                  disabled={isLoading}
                  required
                />
                <small>Debes subir entre 1 y 3 imágenes. Formatos: JPG, PNG, etc.</small>
                {errors.files && <p className="error-message">{errors.files.message}</p>}
              </div>

              {/* Preview de imágenes seleccionadas */}
              {selectedFiles.length > 0 && (
                <div className="file-preview-container" style={{ marginTop: '16px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '8px' }}>
                    {selectedFiles.length} imagen{selectedFiles.length > 1 ? 'es' : ''} seleccionada{selectedFiles.length > 1 ? 's' : ''}:
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {selectedFiles.map((file, index) => (
                      <div key={index} style={{ position: 'relative', border: '1px solid #ddd', borderRadius: '8px', padding: '8px' }}>
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Preview ${index + 1}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          ×
                        </button>
                        <p style={{ fontSize: '11px', marginTop: '4px', textAlign: 'center' }}>
                          {file.name.slice(0, 15)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-submit" disabled={isLoading}>
              {isLoading ? '⏳ Creando...' : '✨ Crear Publicación'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePostPage;
