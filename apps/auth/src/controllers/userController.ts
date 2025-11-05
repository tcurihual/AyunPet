import type { Request, Response } from "express";
import { UserService, RegisterInput, RegisterResult } from "@db/services/userService";
import { sendWelcomeEmail } from "../../../../packages/utils/email";
import { AppError } from "@repo/utils";

export const UserController = {
  async register(req: Request, res: Response) {
    console.log("[auth][register] Starting registration process");
    console.log("[auth][register] Request body:", JSON.stringify(req.body, null, 2));
    
    try {
      // Validar campos obligatorios
      const { fullName, email, rut, password } = req.body;
      
      if (!fullName || !email || !rut || !password) {
        console.error("[auth][register] Missing required fields:", {
          fullName: !!fullName,
          email: !!email,
          rut: !!rut,
          password: !!password
        });
        return res.status(400).json({ 
          error: "Faltan campos obligatorios",
          details: "Se requieren: fullName, email, rut, password"
        });
      }

      // Validar formato de email básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error("[auth][register] Invalid email format:", email);
        return res.status(400).json({ 
          error: "Formato de email inválido"
        });
      }

      // Validar que la contraseña tenga al menos 6 caracteres
      if (password.length < 6) {
        console.error("[auth][register] Password too short");
        return res.status(400).json({ 
          error: "La contraseña debe tener al menos 6 caracteres"
        });
      }

      const registerInput: RegisterInput = {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        rut: rut.trim(),
        password
      };

      console.log("[auth][register] Attempting to register user with email:", registerInput.email);
      
      const result: RegisterResult = await UserService.register(registerInput);
      
      if (!result.success) {
        console.error("[auth][register] Registration failed:", result.error);
        
        // Mapear tipos de error a respuestas HTTP apropiadas
        switch (result.error?.type) {
          case 'duplicate_email':
          case 'duplicate_rut':
          case 'duplicate_both':
            return res.status(409).json({ 
              error: result.error.message,
              details: "Por favor, verifica tus datos o intenta iniciar sesión"
            });
          case 'role_not_found':
            return res.status(500).json({ 
              error: "Error de configuración del sistema",
              details: "Contacta al administrador"
            });
          case 'database_error':
          default:
            return res.status(500).json({ 
              error: "Error interno del servidor",
              details: result.error?.message || "Error desconocido"
            });
        }
      }

      console.log("[auth][register] User registered successfully with ID:", result.userId);
      
      // Responder inmediatamente con éxito
      res.status(201).json({ 
        message: "Usuario registrado con éxito",
        details: "Se ha enviado un correo de bienvenida a tu dirección de email",
        userId: result.userId
      });

      // Enviar email de bienvenida en segundo plano (no bloquea la respuesta)
      console.log("[auth][register] Sending welcome email asynchronously...");
      sendWelcomeEmail(registerInput.email, registerInput.fullName)
        .then(() => {
          console.log("[auth][register] Welcome email sent successfully to:", registerInput.email);
        })
        .catch((emailError) => {
          console.error("[auth][register] Failed to send welcome email:", emailError.message);
          // No re-lanzamos el error porque el usuario ya fue creado exitosamente
        });

    } catch (err: any) {
      console.error("[auth][register] Unexpected registration error:", err.message);
      console.error("[auth][register] Error stack:", err.stack);
      
      res.status(500).json({ 
        error: "Error interno del servidor",
        details: "Ocurrió un error inesperado durante el registro"
      });
    }
  },
};