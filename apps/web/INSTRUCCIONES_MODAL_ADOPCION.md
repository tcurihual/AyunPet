# 📦 Instrucciones para Integrar Modal de Adopción

## 📝 Archivos a Modificar

Solo necesitas hacer **cambios mínimos** en 2 archivos:

1. `apps/web/src/pages/PostPage.tsx` 
2. `apps/web/src/pages/PetDetailPage.tsx`

---

## 1️⃣ Modificar PostPage.tsx

### Paso 1: Agregar import del modal (línea 4)

**Busca:**
```tsx
import { useAuth } from '../context/AuthContext';
```

**Agregar después:**
```tsx
import CreateAdoptionRequestModal from '../components/CreateAdoptionRequestModal';
```

---

### Paso 2: Cambiar el useAuth (línea 58)

**Busca:**
```tsx
const { user } = useAuth();
```

**Cambiar por:**
```tsx
const { user, token } = useAuth();
```

---

### Paso 3: Agregar estado para el modal (línea 62)

**Busca:**
```tsx
const [error, setError] = useState<string | null>(null);
```

**Agregar después:**
```tsx
const [showAdoptionModal, setShowAdoptionModal] = useState(false);
```

---

### Paso 4: Agregar función handleAdoptClick (después de `currentPost`)

**Busca:**
```tsx
const currentPost = posts.find(p => p.id === selectedPostId);
```

**Agregar después:**
```tsx
const handleAdoptClick = () => {
  if (!token) {
    alert('⚠️ Debes iniciar sesión para solicitar una adopción');
    return;
  }
  setShowAdoptionModal(true);
};
```

---

### Paso 5: Modificar botón "Quiero adoptarlo"

**Busca:**
```tsx
<button style={{
  padding: '0.75rem 1.5rem',
  backgroundColor: '#FF6B35',
  color: 'white',
  // ... más estilos
}}>
  💚 Quiero adoptarlo
</button>
```

**Cambiar por (solo agregar `onClick`):**
```tsx
<button 
  onClick={handleAdoptClick}
  style={{
    padding: '0.75rem 1.5rem',
    backgroundColor: '#FF6B35',
    color: 'white',
    // ... más estilos
  }}
>
  💚 Quiero adoptarlo
</button>
```

---

### Paso 6: Agregar modal al final (antes del cierre `</div>`)

**Busca el final del archivo:**
```tsx
      <Footer />
    </div>
  );
};
```

**Cambiar por:**
```tsx
      <Footer />
      
      {/* Modal de Solicitud de Adopción */}
      {currentPost && showAdoptionModal && (
        <CreateAdoptionRequestModal
          postId={currentPost.id}
          isOpen={showAdoptionModal}
          onClose={() => setShowAdoptionModal(false)}
          onSuccess={() => {
            alert('✅ Solicitud enviada exitosamente');
            setShowAdoptionModal(false);
          }}
          token={token || ''}
        />
      )}
    </div>
  );
};
```

---

## 2️⃣ Modificar PetDetailPage.tsx

### Paso 1: Agregar imports (después de `import './css/PetDetailPage.css';`)

**Agregar:**
```tsx
import CreateAdoptionRequestModal from '../components/CreateAdoptionRequestModal';
import { useAuth } from '../context/AuthContext';
```

---

### Paso 2: Agregar hooks al componente

**Busca:**
```tsx
const { publications, fetchPublications } = usePublications();
```

**Agregar después:**
```tsx
const { token } = useAuth();
const [showAdoptionModal, setShowAdoptionModal] = useState(false);
```

---

### Paso 3: Agregar función handleContactClick

**Busca:**
```tsx
const handleImageError = (imageUrl: string) => {
```

**Agregar ANTES:**
```tsx
const handleContactClick = () => {
  if (!token) {
    alert('⚠️ Debes iniciar sesión para solicitar una adopción');
    return;
  }
  setShowAdoptionModal(true);
};
```

---

### Paso 4: Modificar botón "Contactar"

**Busca:**
```tsx
<button className="contact-button">Contactar</button>
```

**Cambiar por:**
```tsx
<button className="contact-button" onClick={handleContactClick}>
  Solicitar Adopción
</button>
```

---

### Paso 5: Agregar modal al final

**Busca el final:**
```tsx
      </div>
      <Footer />
    </div>
  );
};
```

**Cambiar por:**
```tsx
      </div>
      <Footer />
      
      {/* Modal de Solicitud de Adopción */}
      {publication && showAdoptionModal && (
        <CreateAdoptionRequestModal
          postId={publication.post.id}
          isOpen={showAdoptionModal}
          onClose={() => setShowAdoptionModal(false)}
          onSuccess={() => {
            alert('✅ Solicitud enviada exitosamente');
            setShowAdoptionModal(false);
          }}
          token={token || ''}
        />
      )}
    </div>
  );
};
```

---

## 🎯 Resumen de Cambios

### PostPage.tsx:
- ✅ 1 import nuevo
- ✅ 1 cambio en useAuth
- ✅ 1 estado nuevo
- ✅ 1 función nueva
- ✅ `onClick` en botón
- ✅ Componente modal al final

### PetDetailPage.tsx:
- ✅ 2 imports nuevos
- ✅ 2 hooks nuevos
- ✅ 1 función nueva
- ✅ `onClick` en botón
- ✅ Componente modal al final

---

## 💡 Archivo de Referencia

Si quieres ver el código completo con los cambios ya aplicados, revisa:
- `apps/web/src/pages/PostPageWithModal.tsx` (ejemplo completo)

---

## ✅ Verificación

Después de hacer los cambios:

1. Ejecuta `npm run dev`
2. Ve a la página de publicaciones
3. Haz clic en "Quiero adoptarlo"
4. Debería aparecer el modal
5. Completa el formulario y envía
6. Verás el mensaje de éxito

---

## 🐛 Problemas Comunes

### Error: "CreateAdoptionRequestModal is not defined"
**Solución:** Verifica que agregaste el import correctamente

### Error: "token is undefined"
**Solución:** Verifica que cambiaste `const { user }` por `const { user, token }`

### Modal no aparece
**Solución:** Verifica que agregaste el estado `showAdoptionModal` y el componente al final

---

**Última actualización:** 18/11/2025
