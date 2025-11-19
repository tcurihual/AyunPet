import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/CreatePostPage.css';

const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Datos del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('dog');
  const [gender, setGender] = useState('male');
  const [ageYears, setAgeYears] = useState(0);
  const [ageMonths, setAgeMonths] = useState(0);
  const [size, setSize] = useState('medium');
  const [sterilized, setSterilized] = useState(false);
  
  // Manejo de imágenes (igual que CreatePostPage)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  useEffect(() => {
    const loadPublication = async () => {
      if (!id) {
        alert('❌ ID de publicación no válido');
        navigate('/muro-institucion');
        return;
      }

      const token = localStorage.getItem('authToken');
      
      try {
        console.log('🔍 Cargando publicación ID:', id);
        const response = await fetch(`${API_BASE_URL}/adoptions/publications/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar publicación');
        }

        const result = await response.json();
        console.log('✅ Datos cargados:', result);
        const { post, pet } = result.data;

        // Verificar que el usuario sea el creador (comparar como números)
        const postCreatorId = typeof post.creator_id === 'string' ? parseInt(post.creator_id) : post.creator_id;
        const currentUserId = typeof user?.id === 'string' ? parseInt(user.id) : user?.id;

        console.log('🔐 Verificando permisos:', { postCreatorId, currentUserId });

        if (postCreatorId !== currentUserId) {
          alert('❌ No tienes permiso para editar esta publicación');
          navigate('/muro-institucion');
          return;
        }

        // Cargar datos en el formulario
        setTitle(post.title);
        setDescription(post.description);
        setPetName(pet.name || '');
        setSpecies(pet.species);
        setGender(pet.gender);
        setAgeYears(pet.age_years);
        setAgeMonths(pet.age_months);
        setSize(pet.size);
        setSterilized(pet.sterilized);
        setCurrentImages(pet.images || []);
        
        console.log('✅ Formulario cargado correctamente');
        setIsLoading(false);
      } catch (err: any) {
        console.error('❌ Error al cargar:', err);
        alert(`Error al cargar la publicación: ${err.message}`);
        navigate('/muro-institucion');
      }
    };

    loadPublication();
  }, [id, user, navigate]);

  // Manejo de archivos (igual que CreatePostPage)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validar cantidad
    if (files.length > 3) {
      alert('❌ Solo puedes subir máximo 3 imágenes');
      e.target.value = '';
      setSelectedFiles([]);
      return;
    }
    
    // Validar formato (bloquear WEBP)
    const invalidFiles = files.filter(f => !['image/jpeg', 'image/png', 'image/jpg'].includes(f.type));
    if (invalidFiles.length > 0) {
      alert('❌ Solo se permiten imágenes JPG o PNG. Archivos no válidos:\n' + 
            invalidFiles.map(f => `- ${f.name} (${f.type})`).join('\n'));
      e.target.value = '';
      setSelectedFiles([]);
      return;
    }
    
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    // Limpiar el input file si no quedan archivos
    if (newFiles.length === 0) {
      const fileInput = document.getElementById('newImages') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const token = localStorage.getItem('authToken');
    const formData = new FormData();

    // Agregar campos al FormData
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    if (petName) formData.append('name', petName.trim());
    formData.append('species', species);
    formData.append('gender', gender);
    formData.append('age_years', ageYears.toString());
    formData.append('age_months', ageMonths.toString());
    formData.append('size', size);
    formData.append('sterilized', sterilized.toString());

    // Agregar nuevas imágenes si hay (usando selectedFiles)
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      console.log('💾 Guardando cambios...');
      console.log('📤 Enviando:', {
        title,
        description,
        name: petName,
        species,
        gender,
        age_years: ageYears,
        age_months: ageMonths,
        size,
        sterilized,
        files: selectedFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
      });

      const response = await fetch(`${API_BASE_URL}/adoptions/publications/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar');
      }

      console.log('✅ Publicación actualizada');
      alert('✅ Publicación actualizada exitosamente');
      navigate('/muro-institucion');
    } catch (err: any) {
      console.error('❌ Error al guardar:', err);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem' }}>🐾</div>
            <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '1rem' }}>Cargando publicación...</p>
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
          <h1 className="create-post-title">✏️ Editar Publicación</h1>

          <form onSubmit={handleSubmit} className="create-post-form" noValidate>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSaving}
                  required
                  placeholder="Ej: Perrito busca hogar"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSaving}
                  required
                  placeholder="Cuéntanos más sobre esta mascota..."
                />
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
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  disabled={isSaving}
                  placeholder="Ej: Luna"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age_years">Años *</label>
                  <input
                    id="age_years"
                    type="number"
                    min="0"
                    max="30"
                    value={ageYears}
                    onChange={(e) => setAgeYears(parseInt(e.target.value) || 0)}
                    disabled={isSaving}
                    required
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age_months">Meses *</label>
                  <input
                    id="age_months"
                    type="number"
                    min="0"
                    max="11"
                    value={ageMonths}
                    onChange={(e) => setAgeMonths(parseInt(e.target.value) || 0)}
                    disabled={isSaving}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Género *</label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={isSaving}
                  >
                    <option value="">Selecciona un género</option>
                    <option value="male">Macho</option>
                    <option value="female">Hembra</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="species">Especie *</label>
                  <select
                    id="species"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    disabled={isSaving}
                  >
                    <option value="">Selecciona una especie</option>
                    <option value="dog">Perro</option>
                    <option value="cat">Gato</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="size">Tamaño *</label>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  disabled={isSaving}
                >
                  <option value="">Selecciona un tamaño</option>
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={sterilized}
                    onChange={(e) => setSterilized(e.target.checked)}
                    disabled={isSaving}
                  />
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

              {/* Imágenes actuales */}
              {currentImages.length > 0 && (
                <div className="form-group">
                  <label>Imágenes actuales ({currentImages.length})</label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {currentImages.map((img, idx) => (
                      <div key={idx} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px' }}>
                        <img
                          src={img}
                          alt={`Imagen ${idx + 1}`}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nuevas imágenes */}
              <div className="form-group">
                <label htmlFor="newImages">Agregar nuevas imágenes (opcional)</label>
                <input
                  id="newImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={isSaving}
                />
                <small>Puedes agregar hasta 3 nuevas imágenes. Formatos: JPG, PNG</small>
              </div>

              {/* Preview de nuevas imágenes seleccionadas */}
              {selectedFiles.length > 0 && (
                <div className="file-preview-container" style={{ marginTop: '16px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '8px' }}>
                    {selectedFiles.length} nueva{selectedFiles.length > 1 ? 's' : ''} imagen{selectedFiles.length > 1 ? 'es' : ''} seleccionada{selectedFiles.length > 1 ? 's' : ''}:
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

            {/* Botones */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={() => navigate('/muro-institucion')}
                className="btn"
                style={{ flex: 1, backgroundColor: '#6c757d' }}
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-submit"
                style={{ flex: 1 }}
              >
                {isSaving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditPostPage;
