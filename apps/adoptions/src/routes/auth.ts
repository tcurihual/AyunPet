import { Router } from 'express';
import { supabaseServer } from '../../../packages/db/supabaseServer';
import { sendPasswordResetEmail } from '../../../packages/utils/email';
import { generateResetToken, addMinutes } from '../../../packages/utils/src/token';
import bcrypt from 'bcryptjs';

const router = Router();

const APP_BASE_URL = (process.env.APP_BASE_URL || process.env.WEB_ORIGIN || 'http://localhost:8000').replace(/\/$/, '');

// IMPORTANTE: Todas las tablas con inicial minúscula según indicación
const TBL_USER = 'user';
const TBL_RESET_TOKENS = 'reset_tokens';

// POST /v1/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    // Buscar usuario por email en tabla "user" (minúscula)
    const { data: user, error: userErr } = await supabaseServer
      .from(TBL_USER)
      .select('id, email')
      .eq('email', email)
      .single();

    if (userErr || !user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Generar token y registrar en tabla de tokens (minúscula)
    const token = generateResetToken(24);
    const expiresAt = addMinutes(new Date(), 30).toISOString();

    const { error: insertErr } = await supabaseServer
      .from(TBL_RESET_TOKENS)
      .insert({ user_id: user.id, token, expires_at: expiresAt, used: false });

    if (insertErr) {
      console.error('Error insertando reset token', insertErr);
      return res.status(500).json({ error: 'No se pudo generar el token' });
    }

    const resetLink = `${APP_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;
    await sendPasswordResetEmail(user.email, resetLink);

    return res.status(200).json({ message: 'Email de recuperación enviado' });
  } catch (e: any) {
    console.error('forgot-password error', e);
    return res.status(500).json({ error: 'Error interno' });
  }
});

// POST /v1/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const token = String(req.body?.token || '');
    const newPassword = String(req.body?.newPassword || '');
    const confirmPassword = String(req.body?.confirmPassword || '');

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Campos incompletos' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Validar token vigente en tabla "reset_tokens"
    const { data: tokenRow, error: tokenErr } = await supabaseServer
      .from(TBL_RESET_TOKENS)
      .select('id, user_id, expires_at, used')
      .eq('token', token)
      .single();

    if (tokenErr || !tokenRow) {
      return res.status(400).json({ error: 'Token inválido' });
    }
    if (tokenRow.used) {
      return res.status(400).json({ error: 'Token ya utilizado' });
    }
    if (new Date(tokenRow.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Token expirado' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar password en tabla "user" (minúscula)
    const { error: updErr } = await supabaseServer
      .from(TBL_USER)
      .update({ password: passwordHash, updatedAt: new Date().toISOString() })
      .eq('id', tokenRow.user_id);

    if (updErr) {
      console.error('Error actualizando password', updErr);
      return res.status(500).json({ error: 'No se pudo actualizar la contraseña' });
    }

    // Marcar token como usado
    await supabaseServer
      .from(TBL_RESET_TOKENS)
      .update({ used: true })
      .eq('id', tokenRow.id);

    return res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (e: any) {
    console.error('reset-password error', e);
    return res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
