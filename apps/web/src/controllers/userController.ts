import type { Request, Response } from "express";
import { supabase } from "../db_connection";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, rut, password } = req.body as {
      fullName: string;
      email: string;
      rut: string;
      password: string;
    };

    // 1. Verificar duplicados (RUT o email)
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .or(`rut.eq.${rut},email.eq.${email}`)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingUser) {
      res.status(400).json({ success: false, message: "RUT o correo ya registrados" });
      return;
    }

    const newUser = {
      role: 1,
      rut,
      email,
      name: fullName,
      password,
      validated: false,
      address: "Sin dirección",
      description: "Nuevo usuario registrado",
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from("users").insert([newUser]);

    if (insertError) throw insertError;

    res.json({ success: true });
  } catch (error: any) {
    console.error("Error al registrar usuario:", error.message);
    res.status(500).json({ success: false });
  }
};
