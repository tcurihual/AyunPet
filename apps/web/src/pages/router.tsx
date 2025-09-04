
import React from 'react';

import Header from '../components/Header';
import Hero from '../components/Hero';
import Faq from '../components/Faq';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <Faq />
      <Footer />
    </>
  );
};

export default HomePage;