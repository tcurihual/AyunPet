import type { Request, Response } from "express";
import { UserService, RegisterInput } from "@db/services/userService";
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
      
      const success = await UserService.register(registerInput);
      
      if (!success) {
        console.error("[auth][register] Registration failed - duplicate RUT or email");
        return res.status(409).json({ 
          error: "El RUT o correo ya está registrado",
          details: "Por favor, verifica tus datos o intenta iniciar sesión"
        });
      }

      console.log("[auth][register] User registered successfully");
      
      // Responder inmediatamente con éxito
      res.status(201).json({ 
        message: "Usuario registrado con éxito",
        details: "Se ha enviado un correo de bienvenida a tu dirección de email"
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
      console.error("[auth][register] Registration error:", err.message);
      console.error("[auth][register] Error stack:", err.stack);
      
      // Si es un error de Supabase, darle un mensaje más claro
      if (err.message?.includes('duplicate key') || err.code === '23505') {
        return res.status(409).json({ 
          error: "El RUT o correo ya está registrado",
          details: "Este usuario ya existe en el sistema"
        });
      }
      
      res.status(400).json({ 
        error: "Error en el registro",
        details: err.message || "Error interno del servidor"
      });
    }
  },
};