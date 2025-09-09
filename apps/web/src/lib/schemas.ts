import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string()
    .min(3, { message: "El nombre completo debe tener al menos 3 caracteres." })
    .max(50, { message: "El nombre es demasiado largo." }),
  
  userType: z.string()
    .min(1, { message: "Elige una opción." })
    .refine(val => val === 'usuario' || val === 'empresa', {
      message: "Selección no válida.",
    }),
  
  email: z.string()
    .email({ message: "Por favor, ingresa un correo electrónico válido." }),
  
  rut: z.string()
    .min(9, { message: "El RUT debe tener al menos 9 caracteres (ej: 12.345.678-9)." })
    .regex(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: "Formato de RUT no válido." }),
  
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
    
  confirmPassword: z.string()
    .min(8, { message: "La confirmación debe tener al menos 8 caracteres." }),
    
  agreedToTerms: z.boolean()
    .refine(val => val === true, {
      message: "Debes aceptar los términos y condiciones para continuar.",
    }),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, ingresa un correo válido." }),
  password: z.string().min(1, { message: "La contraseña no puede estar vacía." }),
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;