import { useState } from "react";
import letras from "../utils/contenido/niños/letras.json";

function LetrasAudio() {
  const [index, setIndex] = useState(0);
  const letraActual = letras.alfabeto[index];

  const reproducirAudio = () => {
    const audio = new Audio(letraActual.audio);
    audio.play();
  };

  const siguiente = () => {
    if (index < letras.alfabeto.length - 1) {
      setIndex(index + 1);
    }
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl mb-4">Letra: {letraActual.letra}</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={reproducirAudio}
      >
        Escuchar sonido
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={siguiente}
        disabled={index >= letras.alfabeto.length - 1}
      >
        Siguiente letra
      </button>
    </div>
  );
}

export default LetrasAudio;
