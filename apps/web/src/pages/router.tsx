import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import AdoptionRequestsPage from "./AdoptionRequestsPage";
import MainLayout from "../components/MainLayout";

const Home: React.FC = () => {
  return <div>Contenido de la página de Inicio</div>;
};

const WebRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/solicitudes" element={<AdoptionRequestsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default WebRouter;