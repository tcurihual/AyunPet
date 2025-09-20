// src/db/services/userService.ts
import { supabase } from "@db/services/db_connection";

export interface RegisterInput {
  fullName: string;
  email: string;
  rut: string;
  password: string;
}

export const UserService = {
  async register(input: RegisterInput): Promise<boolean> {
    const { fullName, email, rut, password } = input;

    // 1. Verificar duplicados
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .or(`rut.eq.${rut},email.eq.${email}`)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingUser) return false;

    // 2. Obtener rol por defecto
    const { data: roleData, error: roleError } = await supabase
      .from("role")
      .select("id")
      .eq("roletype", "user")
      .maybeSingle();

    if (roleError || !roleData) throw roleError || new Error("No se encontró rol");

    // 3. Insertar usuario
    const newUser = {
      role: roleData.id,
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

    return true;
  },
};
