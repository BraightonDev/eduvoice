import React, { useState } from 'react';
import './pagina1.css';
import { iniciarReconocimientoVoz, detenerReconocimientoVoz } from './logica1/pagina1';

const Pagina1 = () => {
  const [escuchando, setEscuchando] = useState(false);

  const manejarMicrofono = () => {
    if (escuchando) {
      detenerReconocimientoVoz();
    } else {
      iniciarReconocimientoVoz();
    }
    setEscuchando(!escuchando);
  };

  return (
    <div className="contenedor">
      <h1 className="titulo">EDUVOICE</h1>

      <div className="opciones">
        <div className="cuadro" onClick={() => window.location.href = "/pagina2"}>
          <img src="https://jdlperformingarts.com/wp-content/uploads/2025/03/icon-01.png" alt="Pronunciación" className="icono" />
          <p>Mejorar tu pronunciación</p>
        </div>

        <div className="cuadro" onClick={() => window.location.href = "/pagina3"}>
          <img src="https://webaruba.com/sites/default/files/icon-images/forms-documents-drk-blue.svg" alt="Escritura" className="icono" />
          <p>Mejorar tu escritura</p>
        </div>
      </div>

      <div className="microfono" onClick={manejarMicrofono}>
        <img src="https://cdn-icons-png.freepik.com/512/4903/4903738.png" alt="Microfono" />
      </div>
    </div>
  );
};

export default Pagina1;