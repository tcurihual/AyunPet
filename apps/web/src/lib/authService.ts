// Servicio de autenticación para AyunPet
// Conecta con la API desplegada en Azure y base de datos Supabase

const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

// Tipos para las respuestas de la API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

interface VerifyEmailRequest {
  email: string;
  token: string;
}

/**
 * Servicio para solicitar recuperación de contraseña
 * Endpoint: POST /v1/auth/forgot-password
 */
export const forgotPasswordService = async (email: string): Promise<ApiResponse> => {
  try {
    console.log('Enviando solicitud de recuperación de contraseña para:', email);
    
    const requestBody: ForgotPasswordRequest = {
      email: email.trim().toLowerCase()
    };

    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error en forgot-password:', response.status, responseData);
      return {
        success: false,
        error: responseData.message || responseData.error || `Error ${response.status}: ${response.statusText}`
      };
    }

    console.log('Solicitud de recuperación enviada exitosamente:', responseData);
    return {
      success: true,
      data: responseData,
      message: responseData.message || 'Email de recuperación enviado exitosamente'
    };

  } catch (error: any) {
    console.error('Error de conexión en forgot-password:', error);
    return {
      success: false,
      error: error.message || 'Error de conexión. Verifica tu internet e intenta nuevamente.'
    };
  }
};

/**
 * Servicio para restablecer contraseña con token
 * Endpoint: POST /v1/auth/reset-password
 */
export const resetPasswordService = async (token: string, newPassword: string, confirmPassword: string): Promise<ApiResponse> => {
  try {
    console.log('Restableciendo contraseña con token:', token.substring(0, 10) + '...');
    
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: 'Las contraseñas no coinciden'
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      };
    }

    const requestBody: ResetPasswordRequest = {
      token,
      newPassword,
      confirmPassword
    };

    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error en reset-password:', response.status, responseData);
      return {
        success: false,
        error: responseData.message || responseData.error || `Error ${response.status}: Token inválido o expirado`
      };
    }

    console.log('Contraseña restablecida exitosamente');
    return {
      success: true,
      data: responseData,
      message: 'Contraseña restablecida exitosamente'
    };

  } catch (error: any) {
    console.error('Error de conexión en reset-password:', error);
    return {
      success: false,
      error: error.message || 'Error de conexión. Verifica tu internet e intenta nuevamente.'
    };
  }
};

/**
 * Servicio para verificar email
 * Endpoint: POST /v1/auth/verify-email
 */
export const verifyEmailService = async (email: string, token: string): Promise<ApiResponse> => {
  try {
    console.log('Verificando email:', email);
    
    const requestBody: VerifyEmailRequest = {
      email: email.trim().toLowerCase(),
      token
    };

    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error en verify-email:', response.status, responseData);
      return {
        success: false,
        error: responseData.message || responseData.error || `Error ${response.status}: Token de verificación inválido`
      };
    }

    console.log('Email verificado exitosamente');
    return {
      success: true,
      data: responseData,
      message: 'Email verificado exitosamente'
    };

  } catch (error: any) {
    console.error('Error de conexión en verify-email:', error);
    return {
      success: false,
      error: error.message || 'Error de conexión. Verifica tu internet e intenta nuevamente.'
    };
  }
};

/**
 * Utilidad para validar formato de email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Utilidad para validar contraseña
 */
export const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una mayúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export default {
  forgotPasswordService,
  resetPasswordService,
  verifyEmailService,
  isValidEmail,
  isValidPassword
};