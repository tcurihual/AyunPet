import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { PublicationsProvider } from './context/PublicationsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PublicationsProvider>
        <App />
      </PublicationsProvider>
    </BrowserRouter>
  </React.StrictMode>
);