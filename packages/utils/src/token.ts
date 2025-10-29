import crypto from 'crypto';

export function generateResetToken(length = 48) {
  return crypto.randomBytes(length).toString('hex');
}

export function addMinutes(date: Date, minutes: number) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}
