// src/App.tsx
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> 
    </Routes>
  );
}

export default App;