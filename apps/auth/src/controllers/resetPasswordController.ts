import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "@db/services/db_connection";

export const ResetPasswordController = {

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ 
          error: "Token y nueva contraseña son requeridos" 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          error: "La contraseña debe tener al menos 6 caracteres" 
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

      if (payload.type !== "password_reset") {
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
        .select("id, email")
        .eq("id", userId)
        .single();

      if (userError || !user) {
        console.error("Error buscando usuario:", userError);
        return res.status(404).json({ 
          error: "Usuario no encontrado" 
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      const { error: updateError } = await supabase
        .from("users")
        .update({ 
          password: hashedPassword,
          updatedat: new Date().toISOString()
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error actualizando contraseña:", updateError);
        return res.status(500).json({ 
          error: "Error interno al actualizar contraseña" 
        });
      }

      console.log(`Contraseña actualizada para usuario ${user.email}`);
      
      return res.status(200).json({
        message: "Contraseña actualizada correctamente"
      });

    } catch (err: any) {
      console.error("Error en resetPassword:", err);
      return res.status(500).json({ 
        error: "Error interno del servidor" 
      });
    }
  }
};