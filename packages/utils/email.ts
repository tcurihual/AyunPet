import nodemailer from "nodemailer";
import "dotenv/config"; 

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Ayün Pet 🐾" <${process.env.EMAIL_USER}>`, 
    to, 
    subject: "Recuperación de contraseña - Ayün Pet",
    html: `
      <h2>Recuperación de contraseña - Ayün Pet</h2>
      <p>Hola,</p>
      <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>Ayün Pet</strong>.</p>
      <p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
      <a href="${resetLink}" target="_blank">Restablecer contraseña</a>
      <p>Gracias,<br>El equipo de Ayün Pet 🐾</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Correo de recuperación enviado:", info.messageId);
}


export async function sendVerificationEmail(to: string, verificationLink: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Ayün Pet 🐾" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verifica tu cuenta - Ayün Pet",
    html: `
      <h2>Bienvenido a Ayün Pet</h2>
      <p>Gracias por registrarte.</p>
      <p>Por favor, haz clic en el siguiente enlace para verificar tu dirección de correo electrónico:</p>
      <a href="${verificationLink}" target="_blank">Verificar mi cuenta</a>
      <p>Si no te registraste en Ayün Pet, por favor ignora este correo.</p>
      <p>Gracias,<br>El equipo de Ayün Pet 🐾</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Correo de verificación enviado:", info.messageId);
}