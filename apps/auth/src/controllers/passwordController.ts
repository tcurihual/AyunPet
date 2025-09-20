// apps/auth/src/controllers/passwordController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "@db/services/db_connection"; 
import { sendPasswordResetEmail } from "../../../../packages/utils/email";
import "dotenv/config";

const FRONTEND_ORIGIN = `${process.env.SERVER_URL ?? "http://localhost"}:${process.env.WEB_PORT ?? 8000}`;

export const PasswordController = {
  /**
   * POST /api/auth/request-password-reset
   * Body: { email: string }
   *
   * Genera un token JWT (expira en 1h) y envía un email con el link de reset.
   * Responde 200 siempre para evitar enumeración de usuarios.
   */
  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email es requerido" });

      // Buscar usuario por email (no usamos single para evitar lanzar error si no existe)
      const { data, error } = await supabase.from("users").select("*").eq("email", email).limit(1);
      if (error) {
        console.error("Supabase error buscando usuario:", error);
        // No devolvemos detalles al cliente por seguridad
        return res.status(200).json({ message: "Si existe una cuenta asociada, recibirás un correo para recuperar la contraseña." });
      }

      const user = Array.isArray(data) && data.length > 0 ? data[0] : null;

      if (user) {
        // Opcional: verificar si el usuario está validado (si quieres bloquear el envío a no verificados, descomenta)
        // if (!user.validated) { /* decidir si enviar o no */ }

        // Generar token JWT con tipo y expiración
        const payload = { uid: user.id, type: "password_reset" };
        const token = jwt.sign(payload, process.env.JWT_SECRET ?? "JWT_SECRET", {
          expiresIn: "1h",
        });

        // Construir link (ajusta la ruta del frontend si la tuya es diferente)
        const resetLink = `${FRONTEND_ORIGIN}/reset-password?token=${token}`;

        // Enviar email (función ya creada en packages/ utils/email.ts)
        try {
          await sendPasswordResetEmail(user.email, resetLink);
          console.log(`Password reset email enviado a ${user.email}`);
        } catch (mailErr) {
          console.error("Error enviando correo de recuperación:", mailErr);
          // No mostramos error al usuario por seguridad; opcional: guardar para reintento
        }
      }

      // Siempre responder 200 para no revelar si el email existe
      return res.status(200).json({
        message:
          "Si existe una cuenta asociada con ese correo, recibirás un enlace para restablecer la contraseña.",
      });
    } catch (err) {
      console.error("Error en requestPasswordReset:", err);
      return res.status(500).json({ error: "Error interno" });
    }
  },
};
