import React from 'react';
import logo from '../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-container">
        <img src={logo} alt="Logo Ayün Pet" className="footer-logo" />
      </div>
    </footer>
  );
};

export default Footer;