import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { forgotPasswordService, resetPasswordService, verifyEmailService, isValidEmail, isValidPassword } from '../lib/authService';

// Mock fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AuthService', () => {
  const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn(); // Mock console.log
    console.error = vi.fn(); // Mock console.error
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('forgotPasswordService', () => {
    it('debe enviar solicitud correcta para email válido', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Email enviado' })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await forgotPasswordService('test@ejemplo.com');

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: 'test@ejemplo.com' })
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ message: 'Email enviado' });
    });

    it('debe normalizar email eliminando espacios y convirtiéndolo a minúsculas', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Email enviado' })
      };
      mockFetch.mockResolvedValue(mockResponse);

      await forgotPasswordService('  TEST@EJEMPLO.COM  ');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ email: 'test@ejemplo.com' })
        })
      );
    });

    it('debe manejar errores de la API correctamente', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ error: 'Usuario no encontrado' })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await forgotPasswordService('noexiste@ejemplo.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Usuario no encontrado');
    });

    it('debe manejar errores de conexión', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await forgotPasswordService('test@ejemplo.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('debe usar mensaje por defecto cuando la API no devuelve mensaje', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({})
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await forgotPasswordService('test@ejemplo.com');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Email de recuperación enviado exitosamente');
    });
  });

  describe('resetPasswordService', () => {
    const validToken = 'valid-reset-token-12345';
    const newPassword = 'NuevaPassword123';
    const confirmPassword = 'NuevaPassword123';

    it('debe enviar solicitud correcta para restablecimiento válido', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Contraseña actualizada' })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await resetPasswordService(validToken, newPassword, confirmPassword);

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          token: validToken,
          newPassword,
          confirmPassword
        })
      });

      expect(result.success).toBe(true);
    });

    it('debe validar que las contraseñas coincidan', async () => {
      const result = await resetPasswordService(validToken, newPassword, 'DiferentePassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Las contraseñas no coinciden');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('debe validar longitud mínima de contraseña', async () => {
      const shortPassword = '123';
      const result = await resetPasswordService(validToken, shortPassword, shortPassword);

      expect(result.success).toBe(false);
      expect(result.error).toBe('La contraseña debe tener al menos 6 caracteres');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('debe manejar token inválido o expirado', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Token expirado' })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await resetPasswordService('invalid-token', newPassword, confirmPassword);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Token expirado');
    });

    it('debe usar mensaje por defecto para errores de servidor', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: () => Promise.resolve({})
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await resetPasswordService(validToken, newPassword, confirmPassword);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error 500: Token inválido o expirado');
    });
  });

  describe('verifyEmailService', () => {
    const email = 'test@ejemplo.com';
    const token = 'verification-token-12345';

    it('debe enviar solicitud correcta para verificación válida', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Email verificado' })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await verifyEmailService(email, token);

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.toLowerCase(), 
          token 
        })
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Email verificado exitosamente');
    });

    it('debe normalizar email antes de enviar', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({})
      };
      mockFetch.mockResolvedValue(mockResponse);

      await verifyEmailService('  TEST@EJEMPLO.COM  ', token);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ 
            email: 'test@ejemplo.com', 
            token 
          })
        })
      );
    });

    it('debe manejar token de verificación inválido', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Token de verificación inválido' })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await verifyEmailService(email, 'invalid-token');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Token de verificación inválido');
    });
  });

  describe('isValidEmail', () => {
    it('debe validar emails correctos', () => {
      const validEmails = [
        'test@ejemplo.com',
        'usuario.nombre@dominio.co',
        'email+tag@test.org',
        'numero123@domain.net'
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('debe rechazar emails inválidos', () => {
      const invalidEmails = [
        'email-sin-arroba',
        '@dominio.com',
        'email@',
        'email.dominio.com',
        'email@dominio',
        '',
        'email con espacios@dominio.com'
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('isValidPassword', () => {
    it('debe validar contraseña fuerte correcta', () => {
      const strongPassword = 'Password123';
      const result = isValidPassword(strongPassword);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe detectar contraseña muy corta', () => {
      const shortPassword = '123';
      const result = isValidPassword(shortPassword);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe tener al menos 6 caracteres');
    });

    it('debe detectar falta de minúscula', () => {
      const noLowercasePassword = 'PASSWORD123';
      const result = isValidPassword(noLowercasePassword);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe contener al menos una minúscula');
    });

    it('debe detectar falta de mayúscula', () => {
      const noUppercasePassword = 'password123';
      const result = isValidPassword(noUppercasePassword);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe contener al menos una mayúscula');
    });

    it('debe detectar falta de número', () => {
      const noNumberPassword = 'Password';
      const result = isValidPassword(noNumberPassword);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe contener al menos un número');
    });

    it('debe reportar múltiples errores', () => {
      const weakPassword = 'abc';
      const result = isValidPassword(weakPassword);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(3); // Longitud, mayúscula, número
      expect(result.errors).toContain('La contraseña debe tener al menos 6 caracteres');
      expect(result.errors).toContain('La contraseña debe contener al menos una mayúscula');
      expect(result.errors).toContain('La contraseña debe contener al menos un número');
    });
  });

  describe('Integración completa - Casos de uso reales', () => {
    it('debe simular flujo completo de recuperación exitosa', async () => {
      // Step 1: Forgot password
      const forgotResponse = {
        ok: true,
        json: () => Promise.resolve({ 
          message: 'Se ha enviado un enlace de recuperación a tu email' 
        })
      };
      mockFetch.mockResolvedValueOnce(forgotResponse);

      const forgotResult = await forgotPasswordService('usuario@ayunpet.com');
      expect(forgotResult.success).toBe(true);

      // Step 2: Reset password
      const resetResponse = {
        ok: true,
        json: () => Promise.resolve({ 
          message: 'Contraseña restablecida exitosamente' 
        })
      };
      mockFetch.mockResolvedValueOnce(resetResponse);

      const resetResult = await resetPasswordService('valid-token', 'NewPassword123', 'NewPassword123');
      expect(resetResult.success).toBe(true);

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('debe manejar flujo con errores realista', async () => {
      // Intento 1: Email no encontrado
      const notFoundResponse = {
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Email no registrado' })
      };
      mockFetch.mockResolvedValueOnce(notFoundResponse);

      const firstAttempt = await forgotPasswordService('noexiste@ejemplo.com');
      expect(firstAttempt.success).toBe(false);
      expect(firstAttempt.error).toBe('Email no registrado');

      // Intento 2: Email correcto
      const successResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'Email enviado' })
      };
      mockFetch.mockResolvedValueOnce(successResponse);

      const secondAttempt = await forgotPasswordService('correcto@ejemplo.com');
      expect(secondAttempt.success).toBe(true);

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('debe validar datos antes de enviar peticiones costosas', () => {
      // Validación local debe prevenir peticiones innecesarias
      expect(isValidEmail('email-invalido')).toBe(false);
      
      const passwordResult = isValidPassword('123');
      expect(passwordResult.valid).toBe(false);
      
      // Estas validaciones deben usarse antes de hacer fetch
      // para ahorrar peticiones de red
    });
  });
});