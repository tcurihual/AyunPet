import nodemailer from "nodemailer";
import "dotenv/config"; 

// Template base con diseño profesional
const getEmailTemplate = (content: string) => `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ayün Pet</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <!-- Container principal -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header con logo -->
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  🐾 Ayün Pet
                </h1>
                <p style="margin: 8px 0 0 0; color: #e2e8f0; font-size: 16px; opacity: 0.9;">
                  Conectando corazones con patitas
                </p>
              </td>
            </tr>
            
            <!-- Contenido -->
            <tr>
              <td style="padding: 40px 30px;">
                ${content}
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                  Con amor, el equipo de <strong>Ayün Pet</strong> 💜
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                  © 2025 Ayün Pet. Todos los derechos reservados.
                </p>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

// Botón reutilizable con estilo
const getButton = (url: string, text: string, color: string = '#667eea') => `
  <div style="text-align: center; margin: 30px 0;">
    <a href="${url}" target="_blank" style="
      display: inline-block;
      background: linear-gradient(135deg, ${color} 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    ">
      ${text}
    </a>
  </div>
`;

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailContent = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: #fef3c7; color: #92400e; padding: 12px 20px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
        🔐 Recuperación de contraseña
      </div>
    </div>
    
    <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
      ¿Olvidaste tu contraseña?
    </h2>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      ¡No te preocupes! Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>Ayün Pet</strong>.
    </p>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Haz clic en el botón de abajo para crear una nueva contraseña segura:
    </p>
    
    ${getButton(resetLink, '🔄 Restablecer mi contraseña', '#dc2626')}
    
    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 25px 0;">
      <p style="color: #1e293b; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">
        🛡️ Por tu seguridad:
      </p>
      <ul style="color: #64748b; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.5;">
        <li>Este enlace expira en 1 hora</li>
        <li>Solo funciona una vez</li>
        <li>Si no solicitaste este cambio, ignora este email</li>
      </ul>
    </div>
    
    <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0; text-align: center;">
      Si tienes problemas con el botón, copia y pega este enlace en tu navegador:<br>
      <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
    </p>
  `;

  const mailOptions = {
    from: `"Ayün Pet 🐾" <${process.env.EMAIL_USER}>`, 
    to, 
    subject: "🔐 Restablece tu contraseña - Ayün Pet",
    html: getEmailTemplate(emailContent),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Correo de recuperación enviado:", info.messageId);
}

export async function sendVerificationEmail(to: string, verificationLink: string) {
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailContent = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: #dcfce7; color: #166534; padding: 12px 20px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
        ✉️ Verificación de cuenta
      </div>
    </div>
    
    <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
      ¡Bienvenido a nuestra familia! 🎉
    </h2>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      ¡Gracias por registrarte en <strong>Ayün Pet</strong>! Estamos emocionados de tenerte en nuestra comunidad de amantes de las mascotas.
    </p>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Para comenzar a ayudar a las mascotas a encontrar su hogar ideal, solo necesitas verificar tu dirección de correo:
    </p>
    
    ${getButton(verificationLink, '✅ Verificar mi cuenta', '#059669')}
    
    <div style="background-color: #fef7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #a855f7; margin: 25px 0;">
      <p style="color: #1e293b; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">
        🐾 Una vez verificada tu cuenta podrás:
      </p>
      <ul style="color: #64748b; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.5;">
        <li>Publicar mascotas en adopción</li>
        <li>Conectar con adoptantes responsables</li>
        <li>Acceder a todas las funcionalidades</li>
      </ul>
    </div>
    
    <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0; text-align: center;">
      Si no te registraste en Ayün Pet, puedes ignorar este correo de forma segura.
    </p>
  `;

  const mailOptions = {
    from: `"Ayün Pet 🐾" <${process.env.EMAIL_USER}>`,
    to,
    subject: "✅ Verifica tu cuenta - Ayün Pet",
    html: getEmailTemplate(emailContent),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Correo de verificación enviado:", info.messageId);
}

export async function sendWelcomeEmail(to: string, nombre: string) {
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const emailContent = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background-color: #fef3c7; color: #92400e; padding: 12px 20px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
        🎉 ¡Cuenta verificada!
      </div>
    </div>
    
    <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
      ¡Hola ${nombre}! 👋
    </h2>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      ¡Tu cuenta ha sido verificada exitosamente! Ahora eres oficialmente parte de la familia <strong>Ayün Pet</strong> 🐾
    </p>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Nos emociona tenerte aquí y esperamos que juntos podamos ayudar a muchas mascotas a encontrar el hogar perfecto que merecen.
    </p>
    
    <div style="background-color: #f0f9ff; padding: 25px; border-radius: 12px; border: 2px solid #0ea5e9; margin: 25px 0; text-align: center;">
      <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">
        🏠 Tu misión, si decides aceptarla...
      </h3>
      <p style="color: #0369a1; font-size: 15px; margin: 0 0 15px 0; line-height: 1.5;">
        Cada mascota merece una segunda oportunidad. Con tu ayuda, podemos conectar corazones y crear familias felices.
      </p>
      <p style="color: #0369a1; font-size: 14px; margin: 0; font-style: italic;">
        "La grandeza de una nación puede juzgarse por la forma en que trata a sus animales" - Gandhi
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="color: #475569; font-size: 16px; margin: 0 0 20px 0;">
        ¿Listo para comenzar esta hermosa aventura?
      </p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}" target="_blank" style="
        display: inline-block;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        text-decoration: none;
        padding: 16px 32px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      ">
        🚀 Comenzar ahora
      </a>
    </div>
  `;
  
  const mailOptions = {
    from: `"Ayün Pet 🐾" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎉 ¡Bienvenido/a ${nombre}! - Ayün Pet`,
    html: getEmailTemplate(emailContent),
  };
  
  const info = await transporter.sendMail(mailOptions);
  console.log("Correo de bienvenida enviado:", info.messageId);
}