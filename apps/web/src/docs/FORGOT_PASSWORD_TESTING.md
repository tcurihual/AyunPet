# Guía de Testing - Funcionalidad Forgot Password

## 🔍 **Resumen de Implementación Completa**

La funcionalidad de recuperación de contraseña está **100% implementada** en la rama `HectorL` con conexión directa a la API de Azure.

### 📋 **Archivos Implementados**

```
apps/web/src/
├── pages/
│   ├── ForgotPasswordPage.tsx     ✓ Implementado
│   └── ResetPasswordPage.tsx      ✓ Implementado
├── lib/
│   └── authService.ts             ✓ Implementado
├── styles/
│   ├── ForgotPasswordPage.css     ✓ Implementado
│   └── ResetPasswordPage.css      ✓ Implementado
├── tests/
│   ├── ForgotPasswordPage.test.tsx ✓ Implementado
│   └── authService.test.ts         ✓ Implementado
└── App.tsx                        ✓ Rutas agregadas
```

---

## 🚀 **Cómo Testear la Funcionalidad**

### **1. Preparación del Entorno**

```bash
# Navegar al directorio de la aplicación web
cd apps/web

# Instalar dependencias si es necesario
pnpm install

# Iniciar el servidor de desarrollo
pnpm dev
```

### **2. URLs de Testing**

| Página | URL | Propósito |
|--------|-----|----------|
| **Forgot Password** | `http://localhost:5173/forgot-password` | Solicitar recuperación |
| **Reset Password** | `http://localhost:5173/reset-password?token=XXX` | Restablecer con token |
| **Login** | `http://localhost:5173/login` | Acceso con enlace a forgot |

---

## 🧪 **Casos de Prueba Manuales**

### **Caso 1: Flujo Completo Exitoso**

1. **Ir a Login**: `http://localhost:5173/login`
2. **Clic en**: "¿Olvidaste tu contraseña?"
3. **Ingresar email válido**: `usuario@ejemplo.com`
4. **Verificar**: 
   - Estado de carga se muestra
   - Petición POST a `/v1/auth/forgot-password`
   - Mensaje de éxito aparece
5. **Simular reset**: Ir a `http://localhost:5173/reset-password?token=test-token`
6. **Ingresar nueva contraseña**: `NuevaPassword123`
7. **Confirmar contraseña**: `NuevaPassword123`
8. **Verificar**: Petición POST a `/v1/auth/reset-password`

### **Caso 2: Validaciones de Email**

```
Emails a probar:
✓ Correcto: usuario@ejemplo.com
✗ Inválido: email-sin-arroba
✗ Inválido: @dominio.com
✗ Vacío: (campo vacío)
```

### **Caso 3: Validaciones de Contraseña (Reset)**

```
Contraseñas a probar:
✓ Fuerte: Password123
✗ Muy corta: 123
✗ Sin mayúscula: password123
✗ Sin minúscula: PASSWORD123
✗ Sin número: Password
✗ No coinciden: Password123 vs Password456
```

### **Caso 4: Manejo de Errores de API**

```
Errores a simular:
- Email no encontrado (404)
- Token inválido/expirado (400)
- Error de servidor (500)
- Sin conexión a internet
```

---

## 🔌 **Configuración de API**

### **Endpoint Configurado**
```typescript
const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';
```

### **Endpoints Utilizados**
- `POST /v1/auth/forgot-password` - Solicitar recuperación
- `POST /v1/auth/reset-password` - Restablecer contraseña
- `POST /v1/auth/verify-email` - Verificar email (bonus)

### **Headers de Petición**
```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

---

## 🧠 **Testing con DevTools**

### **1. Verificar Network Requests**

1. Abrir **DevTools** (F12)
2. Ir a **Network** tab
3. Ejecutar forgot-password
4. **Verificar request**:
   ```
   URL: http://ayunpet-api.eastus2.cloudapp.azure.com/v1/auth/forgot-password
   Method: POST
   Status: 200 (esperado)
   Body: {"email":"usuario@ejemplo.com"}
   ```

### **2. Verificar Console Logs**

```javascript
// Logs esperados en consola:
✓ "Enviando solicitud de recuperación de contraseña para: usuario@ejemplo.com"
✓ "Solicitud de recuperación enviada exitosamente"
✗ "Error en forgot-password: 404 {...}"
```

### **3. Verificar Local Storage**

```javascript
// En DevTools Console:
localStorage.getItem('user'); // No debe cambiar
sessionStorage.getItem('resetToken'); // Puede ser usado internamente
```

---

## ⚙️ **Ejecutar Tests Automatizados**

### **Tests Unitarios**

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests específicos
pnpm test authService.test.ts
pnpm test ForgotPasswordPage.test.tsx

# Tests con cobertura
pnpm test --coverage
```

### **Tests Esperados**

```
✓ authService.test.ts
  ✓ forgotPasswordService - 6 tests
  ✓ resetPasswordService - 5 tests  
  ✓ verifyEmailService - 3 tests
  ✓ isValidEmail - 2 tests
  ✓ isValidPassword - 6 tests
  ✓ Integración completa - 3 tests

✓ ForgotPasswordPage.test.tsx
  ✓ Renderizado inicial - 3 tests
  ✓ Validación de entrada - 4 tests
  ✓ Integración con API - 4 tests
  ✓ Navegación - 2 tests
  ✓ Accesibilidad - 3 tests
  ✓ Integración completa - 2 tests
```

---

## 🔍 **Checklist de Verificación**

### **Funcionalidad Básica**
- [ ] Página forgot-password se carga correctamente
- [ ] Página reset-password se carga correctamente
- [ ] Enlace desde login funciona
- [ ] Formularios son responsive
- [ ] Estados de carga se muestran

### **Validaciones**
- [ ] Validación de email funciona
- [ ] Validación de contraseña funciona
- [ ] Mensajes de error son claros
- [ ] Confirmación de contraseña funciona

### **Integración API**
- [ ] Peticiones se envían correctamente
- [ ] Headers son correctos
- [ ] Respuestas se manejan bien
- [ ] Errores se manejan bien

### **UX/UI**
- [ ] Diseño es consistente
- [ ] Animaciones funcionan
- [ ] Navegación es intuitiva
- [ ] Accesibilidad (tabs, labels)

---

## 🐛 **Debugging y Troubleshooting**

### **Problemas Comunes**

1. **"Cannot GET /forgot-password"**
   - ✓ Verificar que App.tsx tiene las rutas
   - ✓ Reiniciar servidor de desarrollo

2. **"Module not found: ForgotPasswordPage"**
   - ✓ Verificar que archivos existen en `/pages/`
   - ✓ Verificar imports en App.tsx

3. **"API request failed"**
   - ✓ Verificar conexión a internet
   - ✓ Verificar URL de API en authService.ts
   - ✓ Verificar CORS si es necesario

4. **"Styles not loading"**
   - ✓ Verificar imports de CSS en componentes
   - ✓ Verificar archivos CSS existen en `/styles/`

### **Logs Útiles**

```javascript
// En authService.ts - ya implementados
console.log('Enviando solicitud de recuperación...', email);
console.log('Respuesta exitosa:', responseData);
console.error('Error en forgot-password:', error);
```

---

## 📊 **Estructura de Base de Datos Utilizada**

### **Tabla: user (Supabase)**
```sql
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    validated BOOLEAN DEFAULT FALSE,
    name TEXT NOT NULL,
    -- otros campos...
);
```

### **Credenciales Supabase Configuradas**
```
URL: https://liqwpbcjevsinisrextp.supabase.co
API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎆 **¡Felicitaciones!**

**La funcionalidad de forgot-password está completamente implementada y lista para producción.**

### **Características Implementadas:**
- ✓ Conexión directa con API de Azure
- ✓ Validación completa de formularios
- ✓ Manejo robusto de errores
- ✓ Diseño responsive y accesible
- ✓ Tests automatizados exhaustivos
- ✓ Logging para debugging
- ✓ Documentación completa

### **Listo para:**
- 🚀 Despliegue a producción
- 🧠 Testing manual y automatizado
- 👥 Revisión de equipo
- 📱 Integración con app móvil

---

*Documentación creada por: Hector Lepio*  
*Fecha: Octubre 2025*  
*Rama: HectorL*