import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import letras from "../utils/contenido/niños/letras.json";
import {
  iniciarPronunciacion,
  detenerPronunciacion,
} from "./logicaPronunciacion";
import "./letrasPronunciacion.css";

function LetrasAudio() {
  const navigate = useNavigate();
  const volverAtras = () => navigate('/pagina2');
  const [index, setIndex] = useState(0);
  const [resultado, setResultado] = useState(null);

  const letraActual = letras[index];

  const normalizar = (texto) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zñ]/gi, "")
      .toLowerCase();

  const siguiente = () => {
    if (index < letras.length - 1) {
      setIndex(index + 1);
      setResultado(null);
    }
  };

  const verificarPronunciacion = () => {
    iniciarPronunciacion((transcript) => {
      console.log("Texto capturado:", transcript);

      if (transcript === "ERROR") {
        setResultado("error");
        return;
      }

      const dicho = normalizar(transcript);
      const esperada = normalizar(letraActual.letra);
      const detectada = dicho.slice(-1);

      console.log("Letra detectada:", detectada, "| Esperada:", esperada);

      setResultado(detectada === esperada ? "correcta" : "incorrecta");
      detenerPronunciacion();
    });
  };

  const reproducirAudio = () => {
    const audio = new Audio(letraActual.audio);
    audio.play().catch((e) => console.warn("Error al reproducir:", e.message));
  };

  return (
    <div className="letras-container" key={index}>
      <button className="boton-volver-pagina2" onClick={volverAtras}>Volver atrás</button>
      <h1 className="letras-titulo">Pronunciación de letras</h1>
      <div className="letras-cuadro">
        <img src={letraActual.imagen} alt={letraActual.letra} />
      </div>
      <h2 className="letras-subtitulo">Letra: {letraActual.letra}</h2>

      <div className="letras-botones-container">
        <button
          className="letras-boton letras-boton-escuchar"
          onClick={reproducirAudio}
        >
          Escuchar sonido
        </button>

        <button
          className="letras-boton letras-boton-pronunciar"
          onClick={verificarPronunciacion}
        >
          Pronunciar letra
        </button>

        <button
          className="letras-boton letras-boton-siguiente"
          onClick={siguiente}
          disabled={index >= letras.length - 1}
        >
          Siguiente letra
        </button>
      </div>

      {/* Contenedor de mensaje */}
      <div className="letras-mensaje">
        {resultado === "correcta" && (
          <p className="mensaje-correcto">✅ ¡Pronunciación correcta!</p>
        )}
        {resultado === "incorrecta" && (
          <p className="mensaje-incorrecto">❌ Intenta de nuevo</p>
        )}
        {resultado === "error" && (
          <p className="mensaje-error">⚠️ Error al reconocer la voz</p>
        )}
      </div>
    </div>
  );
}

export default LetrasAudio;
