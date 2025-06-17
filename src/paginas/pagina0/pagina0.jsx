import React, { useState } from "react";
import "./pagina0.css";
import { useNavigate } from "react-router-dom";
import {
  iniciarReconocimientoVoz,
  detenerReconocimientoVoz,
} from "./logica0/pagina0";

const Pagina0 = () => {
  const [escuchando, setEscuchando] = useState(false);
  const navigate = useNavigate();

  const manejarMicrofono = () => {
    if (escuchando) {
      detenerReconocimientoVoz();
    } else {
      iniciarReconocimientoVoz(navigate);
    }
    setEscuchando(!escuchando);
  };

  const irAPagina1 = () => navigate("/pagina1");
  const irAPagina3 = () => navigate("/pagina3");

  return (
    <div className="contenedor-pagina0">
      <h1 className="titulo-pagina0">EDUVOICE</h1>

      <div className="opciones-pagina0">
        <div className="cuadro-pagina0" onClick={irAPagina1}>
          <img
            src="https://jdlperformingarts.com/wp-content/uploads/2025/03/icon-01.png"
            alt="Pronunciación"
            className="icono-pagina0"
          />
          <p className="texto-pagina0">Mejorar tu pronunciación</p>
        </div>
        <div className="microfono-pagina0" onClick={manejarMicrofono}>
          <img
            src="https://cdn-icons-png.freepik.com/512/4903/4903738.png"
            alt="Microfono"
          />
        </div>
        <div className="cuadro-pagina0" onClick={irAPagina3}>
          <img
            src="https://webaruba.com/sites/default/files/icon-images/forms-documents-drk-blue.svg"
            alt="Escritura"
            className="icono-pagina0"
          />
          <p className="texto-pagina0">Mejorar tu escritura</p>
        </div>
      </div>
    </div>
  );
};

export default Pagina0;
