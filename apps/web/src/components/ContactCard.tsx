import React from 'react';

const ContactCard: React.FC = () => {
  return (
    <div className="sidebar-card">
      <h4>Contacto</h4>
      <ul>
        <li><strong>Tel:</strong> +56 9 5555 5555</li>
        <li><strong>Email:</strong> Sigma@gmail.com</li>
        <li><strong>Web:</strong> SigmaAcademy.com</li>
      </ul>
      <button className="btn btn-contact">Contactar</button>
    </div>
  );
};

export default ContactCard;