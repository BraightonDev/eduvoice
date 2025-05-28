import React, { useState } from "react";
import letrasPorNivel from "../utils/contenido/niños/letras.json";
import { iniciarPronunciacion, detenerPronunciacion } from "./logicaPronunciacion";
import './letrasPronunciacion.css';

function LetrasAudio() {
  const [nivel, setNivel] = useState("básico");
  const [index, setIndex] = useState(0);
  const [resultadoPronunciacion, setResultadoPronunciacion] = useState(null);

  const letrasNivelActual = letrasPorNivel.niveles[nivel];
  const letraActual = letrasNivelActual[index];

  const reproducirAudio = () => {
    const audio = new Audio(letraActual.audio);
    audio.play();
  };

  const siguiente = () => {
    if (index < letrasNivelActual.length - 1) {
      setIndex(index + 1);
      setResultadoPronunciacion(null);
    }
  };

  const cambiarNivel = (nuevoNivel) => {
    setNivel(nuevoNivel);
    setIndex(0);
    setResultadoPronunciacion(null);
  };

  const verificarPronunciacion = () => {
    iniciarPronunciacion((transcript) => {
      const normalizar = (texto) =>
        texto
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z]/gi, "")
          .toLowerCase();

      console.log("Texto capturado:", transcript);

      if (transcript === "ERROR") {
        setResultadoPronunciacion("error");
        return;
      }

      const dicho = normalizar(transcript);
      const letraEsperada = normalizar(letraActual.letra);

      // 🎯 Último carácter que se dijo
      const letraDetectada = dicho.charAt(dicho.length - 1);

      console.log("Letra detectada:", letraDetectada, "| Esperada:", letraEsperada);

      if (letraDetectada === letraEsperada) {
        setResultadoPronunciacion("correcta");
      } else {
        setResultadoPronunciacion("incorrecta");
      }

      detenerPronunciacion();
    });
  };

  return (
    <div className="letras-container">
      <h1>Nivel: {nivel}</h1>

      <div className="mb-4">
        {["básico", "intermedio", "avanzado"].map((n) => (
          <button
            key={n}
            onClick={() => cambiarNivel(n)}
            className={`nivel-button ${nivel === n ? "active" : ""}`}
          >
            {n}
          </button>
        ))}
      </div>

      <h2 className="text-2xl mb-4">Letra: {letraActual.letra}</h2>

      <button className="boton boton-escuchar" onClick={reproducirAudio}>
        Escuchar sonido
      </button>

      <button className="boton boton-pronunciar" onClick={verificarPronunciacion}>
        Pronunciar letra
      </button>

      {resultadoPronunciacion === "correcta" && (
        <p style={{ color: "green", fontWeight: "bold" }}>✅ ¡Pronunciación correcta!</p>
      )}
      {resultadoPronunciacion === "incorrecta" && (
        <p style={{ color: "red", fontWeight: "bold" }}>❌ Intenta de nuevo</p>
      )}
      {resultadoPronunciacion === "error" && (
        <p style={{ color: "orange", fontWeight: "bold" }}>⚠️ Error al reconocer la voz</p>
      )}

      <button
        className="boton boton-siguiente"
        onClick={siguiente}
        disabled={index >= letrasNivelActual.length - 1}
      >
        Siguiente letra
      </button>
    </div>
  );
}

export default LetrasAudio;