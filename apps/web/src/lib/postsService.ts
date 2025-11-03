// Servicio de Posts - contrato final actualizado (Publications)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1').replace(/\/$/, '');

export interface CreatePostInput {
  title: string;
  description: string;
  status?: string;
  owner_id?: number; // Solo ADMIN puede especificar otro usuario
  name: string;
  age_years: number;
  age_months: number;
  gender: string;
  size: string;
  species: string;
  sterilized: boolean;
  files?: File[]; // Imágenes para subir
}

export interface ApiResult<T=any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export async function createPost(token: string, input: CreatePostInput): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Crear FormData para multipart/form-data (requerido para archivos)
    const formData = new FormData();
    
    // Campos del post
    formData.append('title', input.title);
    formData.append('description', input.description);
    if (input.status) formData.append('status', input.status);
    if (input.owner_id) formData.append('owner_id', input.owner_id.toString());
    
    // Campos de la mascota
    formData.append('name', input.name);
    formData.append('age_years', input.age_years.toString());
    formData.append('age_months', input.age_months.toString());
    formData.append('gender', input.gender);
    formData.append('size', input.size);
    formData.append('species', input.species);
    formData.append('sterilized', input.sterilized.toString());
    
    // Archivos de imagen
    if (input.files && input.files.length > 0) {
      input.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const res = await fetch(`${API_BASE_URL}/adoptions/publications`, {
      method: 'POST',
      headers, // No incluir Content-Type para que el browser lo configure automáticamente con boundary
      body: formData,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    return { ok: true, data: payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Error de red' };
  }
}