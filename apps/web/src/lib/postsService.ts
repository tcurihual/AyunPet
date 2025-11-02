// Servicio de Posts - conecta con API AyunPet
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1').replace(/\/$/, '');

export interface CreatePostInput {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface ApiResult<T=any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export async function createPost(token: string, input: CreatePostInput): Promise<ApiResult> {
  try {
    console.log('🔑 Token que se va a enviar:', token ? `${token.substring(0, 20)}...` : 'VACÍO');
    console.log('📦 Payload a enviar:', input);
    console.log('🌐 URL del endpoint:', `${API_BASE_URL}/adoptions/publications`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Header Authorization agregado');
    } else {
      console.warn('⚠️ Token vacío - no se agrega Authorization header');
    }
    
    console.log('📋 Headers finales:', headers);

    const res = await fetch(`${API_BASE_URL}/adoptions/publications`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });

    console.log('📡 Response status:', res.status);
    console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));
    
    const payload = await res.json().catch(() => ({}));
    console.log('📄 Response body:', payload);

    if (!res.ok) {
      return { ok: false, error: payload?.message || payload?.error || `Error ${res.status}` };
    }

    return { ok: true, data: payload };
  } catch (e: any) {
    console.error('❌ Error en createPost:', e);
    return { ok: false, error: e?.message || 'Error de red' };
  }
}
