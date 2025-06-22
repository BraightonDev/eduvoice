// src/paginas/PaginaInicio.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./paginaInicio.css"; // Usa el mismo archivo de estilos

const PaginaInicio = () => {
  const navigate = useNavigate();

  const iniciarApp = () => {
    setTimeout(() => {
      window.audio = new Audio("/audios/indicaciones/indicacion 0.mp3");
      window.audio.play().catch((err) => {
        console.warn("No se pudo reproducir el audio:", err);
      });

      // Redirige después de 1.5s (puedes ajustarlo si el audio es más largo)
      setTimeout(() => {
        navigate("/pagina0");
      }, 1500);
    }); // 1 segundo de demora antes de reproducir
  };

  return (
    <div className="pantalla-bienvenida">
      <h1 className="titulo-pagina0">Bienvenido a EDUVOICE</h1>
      <button className="boton-inicio" onClick={iniciarApp}>
        Empezar
      </button>
    </div>
  );
};

export default PaginaInicio;
