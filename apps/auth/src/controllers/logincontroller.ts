import { Request, Response, NextFunction } from "express";
import { createAccessToken, createRefreshToken } from "@repo/utils/src/jwt";
import { supabase } from "../db_connection";
import bcrypt from "bcrypt";

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as {
            email: string;
            password: string;
        };

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email y contraseña son requeridos" 
            });
        }

        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id, name, email, password, role, validated")
            .eq("email", email)
            .maybeSingle();

        if (userError || !user) {
            return res.status(401).json({ 
                success: false, 
                message: "Credenciales inválidas" 
            });
        }

        // --- ESTA ES LA CORRECCIÓN FINAL Y MÁS IMPORTANTE ---
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Credenciales inválidas" 
            });
        }
        // ---------------------------------------------------

        if (!user.validated) {
            return res.status(403).json({ 
                success: false, 
                message: "Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.",
                requiresVerification: true
            });
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
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor" 
        });
    }
};