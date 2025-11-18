# API de Solicitudes de Adopción - Guía de Pruebas

## 📚 Descripción

Este documento describe cómo probar la integración con la API de solicitudes de adopción en el proyecto AyunPet.

## 📝 Archivos Creados

### 1. Servicio de API (`apps/web/src/lib/adoptionRequestsService.ts`)

Contiene todas las funciones para interactuar con la API:

- **createAdoptionRequest**: Crear una nueva solicitud de adopción
- **getAdoptionRequests**: Obtener lista de solicitudes (con paginación)
- **getMyAdoptionRequests**: Obtener solicitudes del usuario actual
- **getAdoptionRequestById**: Obtener detalles de una solicitud específica
- **confirmAcceptAdoptionRequest**: Aceptar una solicitud de adopción
- **validateAdoptionCode**: Validar un código de adopción

### 2. Componente Modal (`apps/web/src/components/CreateAdoptionRequestModal.tsx`)

Modal para crear solicitudes de adopción con:
- Formulario con validación
- Manejo de errores
- Feedback visual de éxito/error
- Límite de 1000 caracteres en el mensaje

### 3. Página de Pruebas (`apps/web/src/pages/TestAdoptionRequestAPI.tsx`)

Página completa para probar todos los endpoints de la API con interfaz visual.

## 🚀 Cómo Probar

### Paso 1: Agregar la ruta en tu router

En tu archivo de rutas (normalmente `App.tsx` o `routes.tsx`), agrega:

```tsx
import TestAdoptionRequestAPI from './pages/TestAdoptionRequestAPI';

// En tus rutas:
<Route path="/test-adoption-api" element={<TestAdoptionRequestAPI />} />
```

### Paso 2: Acceder a la página de pruebas

1. Inicia sesión en la aplicación
2. Navega a: `http://localhost:5173/test-adoption-api` (o tu puerto local)
3. Verás una interfaz con 6 tests diferentes

### Paso 3: Ejecutar las pruebas

#### Test 1: Crear Solicitud de Adopción 📝

- **Endpoint**: `POST /v1/adoptions/adoption-requests`
- **Parámetros**:
  - `post_id`: ID del post de mascota
  - `message`: Mensaje del solicitante
- **Requiere**: Token de autenticación

**Ejemplo de uso**:
```typescript
const result = await createAdoptionRequest(token, {
  post_id: 1,
  message: "Me encanta esta mascota y tengo experiencia cuidándolas"
});
```

#### Test 2: Obtener Solicitudes (Paginadas) 📋

- **Endpoint**: `GET /v1/adoptions/adoption-requests?page={page}&pageSize={pageSize}`
- **Parámetros**:
  - `page`: Número de página (min: 1)
  - `pageSize`: Tamaño de página (min: 1, max: 100)
- **Requiere**: Token de autenticación
- **Comportamiento**: Devuelve solicitudes según el rol del usuario
  - **Publicante (rol 21)**: Ve solicitudes de sus publicaciones
  - **Adoptante (rol 22)**: Ve sus propias solicitudes enviadas

**Ejemplo de uso**:
```typescript
const result = await getAdoptionRequests(token, 1, 10);
```

#### Test 3: Obtener Mis Solicitudes 👤

- **Endpoint**: `GET /v1/adoptions/adoption-requests/mine`
- **Requiere**: Token de autenticación
- **Comportamiento**: Devuelve las solicitudes del usuario autenticado

**Ejemplo de uso**:
```typescript
const result = await getMyAdoptionRequests(token);
```

#### Test 4: Obtener Solicitud por ID 🔍

- **Endpoint**: `GET /v1/adoptions/adoption-requests/{id}`
- **Parámetros**:
  - `id`: ID de la solicitud
- **Requiere**: Token de autenticación

**Ejemplo de uso**:
```typescript
const result = await getAdoptionRequestById(token, 1);
```

#### Test 5: Confirmar Aceptación ✅

- **Endpoint**: `POST /v1/adoptions/adoption-requests/{id}/confirm-accept`
- **Parámetros**:
  - `id`: ID de la solicitud
  - `notes`: (Opcional) Notas adicionales
  - `confirmation_code`: (Opcional) Código de confirmación
- **Requiere**: Token de autenticación + ser el publicante

**Ejemplo de uso**:
```typescript
const result = await confirmAcceptAdoptionRequest(token, 1, {
  notes: "Perfecto, puedes venir mañana a las 3pm"
});
```

#### Test 6: Validar Código 🔑

- **Endpoint**: `POST /v1/adoptions/adoption-requests/validate-code`
- **Parámetros**:
  - `code`: Código a validar
- **Requiere**: Token de autenticación

**Ejemplo de uso**:
```typescript
const result = await validateAdoptionCode(token, {
  code: "ABC123XYZ"
});
```

## 📊 Estados de Solicitud

Las solicitudes pueden tener los siguientes estados:

- **pending**: Solicitud creada, esperando revisión
- **approved**: Solicitud aprobada por el publicante
- **rejected**: Solicitud rechazada
- **completed**: Adopción completada

## 👥 Roles de Usuario

- **Rol 21**: Publicante (puede crear posts y aprobar solicitudes)
- **Rol 22**: Adoptante (puede crear solicitudes de adopción)

## 🔧 Integración con Componentes

### Usar el Modal en un Componente de Publicación
```tsx
import CreateAdoptionRequestModal from '../components/CreateAdoptionRequestModal';
import { useAuth } from '../context/AuthContext';

function PetCard({ publication }) {
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="pet-card">
      {/* ... contenido de la tarjeta ... */}
      
      <button onClick={() => setShowModal(true)}>
        Solicitar Adopción
      </button>

      <CreateAdoptionRequestModal
        postId={publication.post.id}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          alert('✅ Solicitud enviada');
          setShowModal(false);
        }}
        token={token || ''}
      />
    </div>
  );
}
```

## ⚠️ Consideraciones

### Variables de Entorno

Asegúrate de tener configurada la URL de la API:

```env
VITE_API_BASE_URL=http://ayunpet-api.eastus2.cloudapp.azure.com/v1
```

### Autenticación

Todas las peticiones requieren:
- Header `Authorization: Bearer {token}`
- Header `Content-Type: application/json`
- Header `Accept: application/json`

### Manejo de Errores

Todas las funciones devuelven un objeto `ApiResult`:

```typescript
interface ApiResult<T = any> {
  ok: boolean;        // true si fue exitoso
  data?: T;           // datos de respuesta si ok = true
  error?: string;     // mensaje de error si ok = false
}
```

**Ejemplo de uso**:
```typescript
const result = await createAdoptionRequest(token, input);

if (result.ok) {
  console.log('Solicitud creada:', result.data);
} else {
  console.error('Error:', result.error);
}
```

## 📝 Flujo Completo de Adopción

1. **Adoptante** ve una publicación de mascota
2. **Adoptante** hace clic en "Solicitar Adopción"
3. **Adoptante** completa el formulario y envía la solicitud
4. **Publicante** recibe notificación y revisa las solicitudes
5. **Publicante** acepta o rechaza la solicitud
6. Si se acepta, se genera un código de confirmación
7. **Adoptante** puede validar el código al recoger la mascota

## 🐛 Problemas Comunes

### Error 401 (No autorizado)
- Verifica que el token sea válido
- Asegúrate de estar autenticado
- El token puede haber expirado

### Error 403 (Prohibido)
- No tienes permisos para esa acción
- Verifica que tu rol sea el correcto

### Error 404 (No encontrado)
- El ID de la solicitud o post no existe
- Verifica que los IDs sean correctos

### Error 500 (Error del servidor)
- Problema en el backend
- Contacta al equipo de backend

## 📦 Tareas Completadas

- ✅ Servicio de API creado (`adoptionRequestsService.ts`)
- ✅ Modal de creación de solicitud (`CreateAdoptionRequestModal.tsx`)
- ✅ Página de pruebas completa (`TestAdoptionRequestAPI.tsx`)
- ✅ Documentación de uso
- ✅ Manejo de errores
- ✅ TypeScript con tipos completos

## 🔗 Enlaces Útiles

- [Documentación de la API](http://ayunpet-api.eastus2.cloudapp.azure.com/v1/docs)
- [Repositorio del Backend](https://github.com/tcurihual/AyunPet)

---

**Nota**: Este sistema está listo para ser probado. Asegúrate de tener acceso a la API y estar autenticado antes de hacer las pruebas.
