import bcrypt from "bcrypt";

/**
 * Genera un hash seguro de una contraseña en texto plano.
 * @param password Contraseña en texto plano.
 * @returns Hash generado.
 */
export async function genHash(password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, 10); // 10 = saltRounds
    return hash;
  } catch (error) {
    console.error("Problema en la generación del hash", error);
    throw error;
  }
}

/**
 * Verifica si una contraseña coincide con un hash almacenado.
 * @param hash Hash guardado en la base de datos.
 * @param password Contraseña en texto plano a verificar.
 * @returns true si la contraseña es correcta, false en caso contrario.
 */
export async function verifyHash(hash: string, password: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  } catch (error) {
    console.error("Problema al verificar el hash", error);
    return false;
  }
}