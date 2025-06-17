// src/paginas/Pagina1.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "/src/paginas/pagina1/pagina1.css";
import {
  iniciarReconocimientoVoz,
  detenerReconocimientoVoz,
} from "./logica1/pagina1";

const Pagina1 = () => {
  const { tipo } = useParams(); // 'pronunciacion' o 'escritura'
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

  // Redirige a una ruta basada en el tipo y la categoría
  const irACategoria = (categoria) => {
    navigate(`/pagina2/${tipo}/${categoria}`); // Ej: /pagina2/pronunciacion/niños
  };

  const volverAtras = () => navigate("/pagina0");

  const titulo = tipo === "escritura" ? "Mejorar escritura" : "Mejorar pronunciación";

  return (
    <div className="contenedor-pagina1">
      <button className="boton-volver-pagina1" onClick={volverAtras}>
        Volver atrás
      </button>

      <h1 className="titulo-pagina1">Selecciona una categoría para {titulo}</h1>

      <div className="opciones-pagina1">
        <div className="cuadro-pagina1" onClick={() => irACategoria("niños")}>
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

        <div className="cuadro-pagina1" onClick={() => irACategoria("adultos")}>
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
