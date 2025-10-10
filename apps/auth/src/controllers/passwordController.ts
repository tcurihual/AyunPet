import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "@db/services/db_connection"; 
import { sendPasswordResetEmail } from "../../../../packages/utils/email";
import "dotenv/config";

const FRONTEND_ORIGIN = `${process.env.SERVER_URL ?? "http://localhost"}:${process.env.WEB_PORT ?? 8000}`;

export const PasswordController = {
  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email es requerido" });
      const { data, error } = await supabase.from("users").select("*").eq("email", email).limit(1);
      if (error) {
        console.error("Supabase error buscando usuario:", error);
        return res.status(200).json({ message: "Si existe una cuenta asociada, recibirás un correo para recuperar la contraseña." });
      }

      const user = Array.isArray(data) && data.length > 0 ? data[0] : null;

      if (user) {
        const payload = { uid: user.id, type: "password_reset" };
        const token = jwt.sign(payload, process.env.JWT_SECRET ?? "JWT_SECRET", {
          expiresIn: "1h",
        });
        const resetLink = `${FRONTEND_ORIGIN}/reset-password?token=${token}`;

        try {
          await sendPasswordResetEmail(user.email, resetLink);
          console.log(`Password reset email enviado a ${user.email}`);
        } catch (mailErr) {
          console.error("Error enviando correo de recuperación:", mailErr);
        }
      }

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
