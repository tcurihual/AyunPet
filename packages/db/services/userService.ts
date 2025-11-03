// src/db/services/userService.ts
import { supabase } from "@db/services/db_connection";
import { genHash } from "../../utils/hash";

export interface RegisterInput {
  fullName: string;
  email: string;
  rut: string;
  password: string;
}

export interface RegisterResult {
  success: boolean;
  userId?: string;
  error?: {
    type: 'duplicate_email' | 'duplicate_rut' | 'duplicate_both' | 'role_not_found' | 'database_error';
    message: string;
  };
}

function getDefaultRoleIdFromEnv(): string | null {
  const envId = process.env.AUTH_DEFAULT_ROLE_ID;
  if (envId && String(envId).trim().length > 0) {
    return String(envId).trim();
  }
  return null;
}

export const UserService = {
  async register(input: RegisterInput): Promise<RegisterResult> {
    console.log("[userService][register] Starting registration for email:", input.email);
    
    const { fullName, email, rut, password } = input;

    try {
      // 1. Verificar duplicados con más detalle
      console.log("[userService][register] Checking for existing users...");
      const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("id, email, rut")
        .or(`rut.eq.${rut},email.eq.${email}`);

      if (checkError) {
        console.error("[userService][register] Error checking existing users:", checkError);
        throw checkError;
      }

      if (existingUsers && existingUsers.length > 0) {
        const duplicateEmail = existingUsers.find((u: any) => u.email === email);
        const duplicateRut = existingUsers.find((u: any) => u.rut === rut);
        
        let errorType: 'duplicate_email' | 'duplicate_rut' | 'duplicate_both';
        let message: string;
        
        if (duplicateEmail && duplicateRut) {
          errorType = 'duplicate_both';
          message = 'El correo y RUT ya están registrados';
        } else if (duplicateEmail) {
          errorType = 'duplicate_email';
          message = 'El correo ya está registrado';
        } else {
          errorType = 'duplicate_rut';
          message = 'El RUT ya está registrado';
        }
        
        console.log(`[userService][register] Duplicate found - ${errorType}:`, { email, rut });
        return {
          success: false,
          error: { type: errorType, message }
        };
      }

      // 2. Obtener rol por defecto de ENV, si existe
      const envRoleId = getDefaultRoleIdFromEnv();
      let roleId: string | null = envRoleId;

      if (!envRoleId) {
        // 2.b Si no hay ENV, intentar obtener rol por defecto por nombre/columna flexible
        console.log("[userService][register] AUTH_DEFAULT_ROLE_ID not set. Trying to fetch default role from DB...");
        // Intento 1: tabla role, columna name = 'user'
        try {
          const { data: roleByName, error: roleByNameErr } = await supabase
            .from("role")
            .select("id, name, roletype")
            .or("name.eq.user,roletype.eq.user")
            .maybeSingle();

          if (roleByNameErr) {
            console.warn("[userService][register] Role fetch warning (name/roletype):", roleByNameErr.message);
          }

          if (roleByName && roleByName.id) {
            roleId = String(roleByName.id);
          }
        } catch (innerErr: any) {
          console.warn("[userService][register] Role fetch attempt failed:", innerErr?.message);
        }
      }

      if (!roleId) {
        console.error("[userService][register] No default role found (ENV nor DB)");
        return {
          success: false,
          error: { 
            type: 'role_not_found', 
            message: 'No se encontró el rol por defecto. Define AUTH_DEFAULT_ROLE_ID en .env' 
          }
        };
      }

      // 3. Hash de la contraseña
      console.log("[userService][register] Hashing password...");
      const hashedPassword = await genHash(password);

      // 4. Insertar usuario
      console.log("[userService][register] Inserting new user...");
      const newUser = {
        role: roleId,
        rut,
        email,
        name: fullName,
        password: hashedPassword, // Guardamos la contraseña hasheada
        validated: false,
        address: "Sin dirección",
        description: "Nuevo usuario registrado",
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      };

      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert([newUser])
        .select("id")
        .single();
        
      if (insertError) {
        console.error("[userService][register] Error inserting user:", insertError);
        
        // Manejar error de duplicado que podría haber ocurrido en una condición de carrera
        if ((insertError as any).code === '23505') {
          return {
            success: false,
            error: { 
              type: 'duplicate_both', 
              message: 'El usuario ya existe (condición de carrera detectada)' 
            }
          };
        }
        
        throw insertError;
      }

      console.log("[userService][register] User created successfully with ID:", insertData.id);
      return {
        success: true,
        userId: String(insertData.id)
      };

    } catch (error: any) {
      console.error("[userService][register] Unexpected error:", error);
      return {
        success: false,
        error: {
          type: 'database_error',
          message: error?.message || 'Error inesperado en la base de datos'
        }
      };
    }
  },
};
