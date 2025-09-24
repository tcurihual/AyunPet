import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../db_connection";
import { sendPasswordResetEmail } from "../../../../packages/utils/email";
import "dotenv/config";

export const EmailVerificationController = {
  async requestEmailVerification(req: Request, res: Response) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          error: "Email es requerido" 
        });
      }

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, email, validated")
        .eq("email", email)
        .single();

      if (userError || !user) {
        return res.status(404).json({ 
          error: "Usuario no encontrado" 
        });
      }

      if (user.validated) {
        return res.status(400).json({ 
          error: "El correo ya está verificado" 
        });
      }

      const payload = { 
        uid: user.id, 
        type: "email_verification" 
      };
      
      const token = jwt.sign(payload, process.env.JWT_SECRET ?? "JWT_SECRET", {
        expiresIn: "24h",
      });

      const FRONTEND_ORIGIN = `${process.env.SERVER_URL ?? "http://localhost"}:${process.env.WEB_PORT ?? 8000}`;
      const verificationLink = `${FRONTEND_ORIGIN}/verify-email?token=${token}`;

      try {
        await sendPasswordResetEmail(user.email, verificationLink);
        console.log(`Email de verificación enviado a ${user.email}`);
      } catch (mailErr) {
        console.error("Error enviando correo de verificación:", mailErr);
        return res.status(500).json({ 
          error: "Error enviando correo de verificación" 
        });
      }

      return res.status(200).json({
        message: "Se ha enviado un enlace de verificación a tu correo electrónico.",
      });

    } catch (err) {
      console.error("Error en requestEmailVerification:", err);
      return res.status(500).json({ 
        error: "Error interno" 
      });
    }
  },

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ 
          error: "Token de verificación es requerido" 
        });
      }

      let payload: any;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET ?? "JWT_SECRET");
      } catch (jwtError) {
        return res.status(400).json({ 
          error: "Token inválido o expirado" 
        });
      }

      if (payload.type !== "email_verification") {
        return res.status(400).json({ 
          error: "Token inválido para esta operación" 
        });
      }

      const userId = payload.uid;
      if (!userId) {
        return res.status(400).json({ 
          error: "Token inválido" 
        });
      }

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, email, validated")
        .eq("id", userId)
        .single();

      if (userError || !user) {
        console.error("Error buscando usuario:", userError);
        return res.status(404).json({ 
          error: "Usuario no encontrado" 
        });
      }

      if (user.validated) {
        return res.status(400).json({ 
          error: "El correo ya está verificado" 
        });
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ 
          validated: true,
          updatedat: new Date().toISOString()
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error actualizando verificación:", updateError);
        return res.status(500).json({ 
          error: "Error interno al verificar correo" 
        });
      }

      console.log(`Correo verificado para usuario ${user.email}`);
      
      return res.status(200).json({
        message: "Correo verificado correctamente. Ya puedes iniciar sesión."
      });

    } catch (err: any) {
      console.error("Error en verifyEmail:", err);
      return res.status(500).json({ 
        error: "Error interno del servidor" 
      });
    }
  }
};