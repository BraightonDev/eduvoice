// src/paginas/Pagina2.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  iniciarReconocimientoVoz,
  detenerReconocimientoVoz,
} from "./logica2/logica2";
import "./pagina2.css";

const Pagina2 = () => {
  const { tipo, categoria } = useParams(); // Ej: tipo = "pronunciacion", categoria = "niño"
  const [escuchando, setEscuchando] = useState(false);
  const navigate = useNavigate();

  const manejarMicrofono = () => {
    // 🔇 Detener audio si se está reproduciendo
    if (window.audio && !window.audio.paused) {
      try {
        window.audio.pause();
        window.audio.currentTime = 0;
        window.audio = null; // Limpiar la referencia
      } catch (e) {
        console.warn("No se pudo detener el audio:", e);
      }
    }

    // 🟢 Activar o detener el reconocimiento sin retraso
    if (escuchando) {
      detenerReconocimientoVoz();
    } else {
      iniciarReconocimientoVoz(navigate, tipo, categoria);
    }

    setEscuchando(!escuchando);
  };

  const irALectura = (tema) => {
    if (window.audio && !window.audio.paused) {
      try {
        window.audio.pause();
        window.audio.currentTime = 0;
        window.audio = null;
      } catch (e) {
        console.warn("No se pudo detener el audio previo:", e);
      }
    }

    navigate(`/contenido/${tipo}/${categoria}/${tema}`);
  };

  const volverAtras = () => navigate(`/pagina1/${tipo}`);

  return (
    <div className="contenedor-pagina2">
      <button className="boton-volver-pagina1" onClick={volverAtras}>
        Volver atrás
      </button>
      <h1 className="titulo-pagina2">
        Mejora tu {tipo === "pronunciacion" ? "pronunciación" : "escritura"}
      </h1>

      <div className="categorias-pagina2">
        <div className="columna izquierda-pagina2">
          <div
            className="categoria-pagina2"
            onClick={() => irALectura("letras")}
          >
            <img src="/iconos/Letras.png" alt="Letras" />
            <p>Letras</p>
          </div>
          <div
            className="categoria-pagina2"
            onClick={() => irALectura("frases")}
          >
            <img src="/iconos/frases.png" alt="Frases" />
            <p>Frases</p>
          </div>
        </div>

        <div className="microfono-pagina2" onClick={manejarMicrofono}>
          <img
            src="/public/iconos/microfono.png"
            alt="Micrófono"
          />
        </div>

        <div className="columna derecha-pagina2">
          <div
            className="categoria-pagina2"
            onClick={() => irALectura("numeros")}
          >
            <img src="/iconos/numeros.png" alt="Número" />
            <p>Números</p>
          </div>
          <div
            className="categoria-pagina2"
            onClick={() => irALectura("palabras")}
          >
            <img src="/iconos/Palabra.png" alt="Palabra" />
            <p>Palabras</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagina2;
