import React from "react";

const EmailOrgPending: React.FC = () => {
  const nombreInstitucion = "Refugio Sigma";

  return (
    <div className="email-page-container">
      <div className="email-card">
        <div className="email-header email-header-success">
          <span className="email-icon">🐾</span>
          <h1>Cuenta creada con éxito</h1>
        </div>

        <div className="email-content">
          <h2 className="email-greeting success">
            Hola, {nombreInstitucion} 👋
          </h2>

          <p>
            Tu cuenta en <strong>AyunPet</strong> ha sido creada correctamente.
            Actualmente se encuentra en proceso de revisión por parte de nuestro
            equipo para garantizar la autenticidad de las organizaciones
            registradas.
          </p>

          <div className="email-highlight-box">
            <p>
              <strong>⏳ Estado:</strong> En revisión
            </p>
          </div>

          <p>
            Una vez que tu cuenta sea verificada, recibirás una notificación
            para poder acceder a todas las funcionalidades del sistema.
          </p>

          <div className="email-divider"></div>

          <p>
            Si tienes dudas, puedes contactarnos en{" "}
            <a href="mailto:ayunpetuct@gmail.com" className="email-link success">
              ayunpetuct@gmail.com
            </a>
          </p>

          <div className="email-cta-container">
            <a href="http://localhost:8000/" className="email-cta-btn success">
              Visitar AyunPet
            </a>
          </div>
        </div>

        <div className="email-footer">
          © 2025 AyunPet — Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default EmailOrgPending;