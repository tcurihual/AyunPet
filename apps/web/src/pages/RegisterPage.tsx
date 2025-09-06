import React from 'react';

import Header from '../components/Header';
import RegisterForm from '../components/RegisterForm';
import Footer from '../components/Footer';

const RegisterPage: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
      <main className="main-content">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;