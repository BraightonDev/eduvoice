import React, { useState } from "react";
import letras from "../utils/contenido/niños/letras.json";
import { iniciarPronunciacion, detenerPronunciacion } from "./logicaPronunciacion";
import "./letrasPronunciacion.css";

function LetrasAudio() {
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
      const detectada = dicho.slice(-1); // más seguro que charAt

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
      <h1>Pronunciación de letras</h1>
      <h2 className="text-2xl mb-4">Letra: {letraActual.letra}</h2>

      <button className="boton boton-escuchar" onClick={reproducirAudio}>
        Escuchar sonido
      </button>

      <button className="boton boton-pronunciar" onClick={verificarPronunciacion}>
        Pronunciar letra
      </button>

      {resultado === "correcta" && (
        <p style={{ color: "green", fontWeight: "bold" }}>✅ ¡Pronunciación correcta!</p>
      )}
      {resultado === "incorrecta" && (
        <p style={{ color: "red", fontWeight: "bold" }}>❌ Intenta de nuevo</p>
      )}
      {resultado === "error" && (
        <p style={{ color: "orange", fontWeight: "bold" }}>⚠️ Error al reconocer la voz</p>
      )}

      <button
        className="boton boton-siguiente"
        onClick={siguiente}
        disabled={index >= letras.length - 1}
      >
        Siguiente letra
      </button>
    </div>
  );
}

export default LetrasAudio;
