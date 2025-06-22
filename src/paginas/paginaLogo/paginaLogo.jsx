import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./paginaLogo.css";

const PaginaLogo = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true); // Inicia el desvanecimiento
    }, 2000); // Comienza a desvanecer después de 2 segundos

    const redirectTimer = setTimeout(() => {
      navigate("/inicio"); // Redirige después de 3 segundos
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className={`logo-container ${fadeOut ? "fade-out" : ""}`}>
      <img
        src="/imagenes/Logo/Logo.png"
        alt="Logo"
        className="logo-img"
      />
    </div>
  );
};

export default PaginaLogo;
