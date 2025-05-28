import { useState } from "react";
import letrasPorNivel from "../utils/contenido/niños/letras.json";

function LetrasAudio() {
const [nivel, setNivel] = useState("básico"); // nivel actual
const [index, setIndex] = useState(0);

const letrasNivelActual = letrasPorNivel.niveles[nivel];
const letraActual = letrasNivelActual[index];

const reproducirAudio = () => {
const audio = new Audio(letraActual.audio);
audio.play();
};

const siguiente = () => {
if (index < letrasNivelActual.length - 1) {
setIndex(index + 1);
}
};

const cambiarNivel = (nuevoNivel) => {
setNivel(nuevoNivel);
setIndex(0); // reiniciar al comenzar otro nivel
};

const verificarPronunciacion = () => {
  const reconocimiento = new window.webkitSpeechRecognition(); // o SpeechRecognition
  reconocimiento.lang = "es-ES";

  reconocimiento.onresult = (evento) => {
    const resultado = evento.results[0][0].transcript.toLowerCase();
    console.log("Pronunciaste:", resultado);

    if (resultado === letraActual.letra.toLowerCase()) {
      alert("✅ Pronunciación correcta");
    } else {
      alert("❌ Intenta de nuevo");
    }
  };

  reconocimiento.onerror = (e) => {
    console.error("Error:", e);
    alert("Error al reconocer la voz");
  };

  reconocimiento.start();
};

return (
<div className="p-4 text-center">
<h1 className="text-3xl font-bold mb-4">Nivel: {nivel}</h1>
  <div className="mb-4">
    {["básico", "intermedio", "avanzado"].map((n) => (
      <button
        key={n}
        onClick={() => cambiarNivel(n)}
        className={`px-3 py-1 mx-1 rounded ${
          nivel === n ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        {n}
      </button>
    ))}
  </div>

  <h2 className="text-2xl mb-4">Letra: {letraActual.letra}</h2>

  <button
    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
    onClick={reproducirAudio}
  >
    Escuchar sonido
  </button>
  
  <button
    className="bg-purple-500 text-white px-4 py-2 rounded mt-2"
    onClick={verificarPronunciacion}
  >
    Pronunciar letra
  </button>

  <button
    className="bg-green-500 text-white px-4 py-2 rounded"
    onClick={siguiente}
    disabled={index >= letrasNivelActual.length - 1}
  >
    Siguiente letra
  </button>
</div>
);
}

export default LetrasAudio;