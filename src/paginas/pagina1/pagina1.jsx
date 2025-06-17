// src/paginas/Pagina1.jsx
import React, { useState } from "react";
import "/src/paginas/pagina1/pagina1.css";
import { useNavigate } from "react-router-dom";
import {
  iniciarReconocimientoVoz,
  detenerReconocimientoVoz,
} from "./logica1/pagina1";

const Pagina1 = () => {
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

  const irANiños = () => navigate("/pagina2");
  const irAAdultos = () => navigate("/pagina2");

  return (
    <div className="contenedor-pagina1">
      <h1 className="titulo-pagina1">Selecciona una categoría</h1>

      <div className="opciones-pagina1">
        <div className="cuadro-pagina1" onClick={irANiños}>
          <img
            src="/src/paginas/pagina1/iconos1/niños.png"
            alt="Niños"
            className="icono-pagina1"
          />
          <p className="texto-pagina1">Niños</p>
        </div>

        <div className="microfono-pagina1" onClick={manejarMicrofono}>
          <img
            src="https://cdn-icons-png.freepik.com/512/4903/4903738.png"
            alt="Microfono"
          />
        </div>

        <div className="cuadro-pagina1" onClick={irAAdultos}>
          <img
            src="/src/paginas/pagina1/iconos1/adultos.png"
            alt="Adultos"
            className="icono-pagina1"
          />
          <p className="texto-pagina1">Adultos</p>
        </div>
      </div>
    </div>
  );
};

export default Pagina1;
