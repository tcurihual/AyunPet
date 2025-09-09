import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { PublicationsProvider } from './context/PublicationsContext'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <AuthProvider>
          <PublicationsProvider>
            <App />
          </PublicationsProvider>
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  </React.StrictMode>,
);