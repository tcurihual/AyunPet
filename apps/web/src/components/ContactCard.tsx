import React from 'react';

interface ContactCardProps {
  phone?: string;
  email?: string;
  website?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  phone = '',
  email = '',
  website = ''
}) => {
  return (
    <div className="sidebar-card">
      <h4>Contacto</h4>
      <ul>
        {phone && (
          <li>
            <strong>Tel:</strong> {phone}
          </li>
        )}
        {email && (
          <li>
            <strong>Email:</strong> {email}
          </li>
        )}
        {website && (
          <li>
            <strong>Web:</strong> {website}
          </li>
        )}
      </ul>
      <button className="btn btn-contact">Contactar</button>
    </div>
  );
};

export default ContactCard;
