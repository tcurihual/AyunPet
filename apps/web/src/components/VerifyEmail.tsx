import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const [status, setStatus] = useState<string>("Verificando...");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token"); 

    if (!token) {
      setStatus("❌ Token no encontrado en la URL.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          "http://ayunpet-api.eastus2.cloudapp.azure.com/v1/auth/verify-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al verificar el correo.");
        }

        const result = await response.json();
        console.log(" Respuesta del servidor:", result);
        setStatus("Correo Verificado.");
      } catch (error) {
        console.error("Error:", error);
        setStatus("Problemas al intentar verificar el correo.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{status}</h2>
    </div>
  );
};

export default VerifyEmail;
