import { Request, Response, NextFunction } from "express";
import { createAccessToken, createRefreshToken } from "@repo/utils"
import { supabase } from "../db_connection";

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email y contraseña son requeridos" });
      return;
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, email, password, role, validated")
      .eq("email", email)
      .maybeSingle();

    if (userError) throw userError;

    if (!user) {
      res.status(401).json({ success: false, message: "Credenciales inválidas" });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ success: false, message: "Credenciales inválidas" });
      return;
    }

    if (!user.validated) {
      res.status(403).json({ success: false, message: "Usuario no validado" });
      return;
    }

    const userForToken = {
      UserId: user.id.toString(),
      UserName: user.name,
      email: user.email,
      role: user.role.toString()
    };

    const accessToken = createAccessToken(userForToken);
    const refreshToken = createRefreshToken(userForToken);

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });

  } catch (error: any) {
    console.error("Error al hacer login:", error.message);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};