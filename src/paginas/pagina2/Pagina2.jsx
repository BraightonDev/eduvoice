import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarReconocimientoVoz, detenerReconocimientoVoz } from './logica2/logica2';
import './Pagina2.css';

const Pagina2 = () => {
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

  const volverAtras = () => navigate('/pagina1');

  return (
    <div className="contenedor-pagina2">
      <button className="boton-volver-pagina1" onClick={volverAtras}>Volver atras</button>
      <h1 className="titulo-pagina2">Mejora tu pronunciación</h1>
      <div className="categorias-pagina2">
        <div className="columna izquierda-pagina2">
          <div className="categoria-pagina2" onClick={irLetras}>
            <img src="/iconos/Letras.png" alt="Letras" />
            <p>Letras</p>
          </div>
          <div className="categoria-pagina2" onClick={() => console.log("Color")}>
            <img src="/iconos/Color.png" alt="Color" />
            <p>Colores</p>
          </div>
        </div>
        <div className="microfono-pagina2" onClick={manejarMicrofono}>
        <img src="https://cdn-icons-png.freepik.com/512/4903/4903738.png" alt="Micrófono" />
      </div>
        <div className="columna derecha-pagina2">
          <div className="categoria-pagina2" onClick={() => console.log("Número")}>
            <img src="/iconos/numeros.png" alt="Número" />
            <p>Números</p>
          </div>
          <div className="categoria-pagina2" onClick={() => console.log("Palabra")}>
            <img src="/iconos/Palabra.png" alt="Palabra" />
            <p>Palabras</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagina2;