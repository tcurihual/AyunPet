import { Request, Response, NextFunction } from "express";

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({
            success: true,
            message: "Sesión cerrada exitosamente"
        });

    } catch (error: any) {
        console.error("Error al hacer logout:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor" 
        });
    }
};