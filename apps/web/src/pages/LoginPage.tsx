import React from 'react';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import Footer from '../components/Footer';

const LoginPage: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
      <main className="main-content">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;