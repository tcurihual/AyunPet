import nodemailer from "nodemailer";
import "dotenv/config"; // carga variables desde .env

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
    text: `Hola,\n\nHemos recibido una solicitud para restablecer tu contraseña en Ayün Pet.\n
Si no solicitaste esto, puedes ignorar este correo.\n\nAccede al siguiente enlace para cambiar tu contraseña:\n${resetLink}\n\nGracias,\nEl equipo de Ayün Pet`,
    html: `
      <h2>Recuperación de contraseña - Ayün Pet</h2>
      <p>Hola,</p>
      <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>Ayün Pet</strong>.</p>
      <p>Si no solicitaste esto, ignora este correo.</p>
      <p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
      <a href="${resetLink}" target="_blank">Restablecer contraseña</a>
      <p>Gracias,<br>El equipo de Ayün Pet 🐾</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Correo de recuperación enviado:", info.messageId);
}

// Aquí hay un ejemplo de como se llama a la función
