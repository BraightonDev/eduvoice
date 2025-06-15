import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarReconocimientoVoz, detenerReconocimientoVoz } from './logica/logica2';
import './PaginaCategoriaNiños.css';

const PaginaCategoriaNiños = () => {
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

    const irLetras = () => navigate('/letras-audio');

  const volverAInicio = () => navigate('/');

  return (
    <div className="contenedor">
      <button className="boton-volver" onClick={volverAInicio}>Volver al inicio</button>
      <h1 className="titulo">Mejora tu pronunciación</h1>
      <h2 className="subtitulo">Categorías</h2>

      <div className="categorias">
        <div className="columna izquierda">
          <div className="categoria" onClick={irLetras}>
            <img src="/public/iconos/Letras.png" alt="Letras" />
            <p>Letras</p>
          </div>
          <div className="categoria" onClick={() => console.log("Color")}>
            <img src="/public/iconos/Color.png" alt="Color" />
            <p>Color</p>
          </div>
        </div>
        <div className="microfono" onClick={manejarMicrofono}>
        <img src="https://cdn-icons-png.freepik.com/512/4903/4903738.png" alt="Micrófono" />
      </div>
        <div className="columna derecha">
          <div className="categoria" onClick={() => console.log("Número")}>
            <img src="/public/iconos/Numero.png" alt="Número" />
            <p>Número</p>
          </div>
          <div className="categoria" onClick={() => console.log("Palabra")}>
            <img src="/public/iconos/Palabra.png" alt="Palabra" />
            <p>Palabra</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaCategoriaNiños;