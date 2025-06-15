// paginaLogo.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Asegúrate de tener react-router-dom instalado
import "./paginaLogo.css";

const PaginaLogo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/pagina0"); // Redirige a tu página principal
    }, 3000); // Espera 3 segundos

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logo-container">
      <img
        src="/imagenes/Logo/Logo.png" // Cambia esta ruta por la correcta
        alt="Logo"
        className="logo-img"
      />
    </div>
  );
};

export default PaginaLogo;