import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import  Dashboard  from '../components/admin/aNav';

const AdminPage: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
     
      <main className="about-page-container">
        <h1 className="title-center">Admin</h1>
         <Dashboard />
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;