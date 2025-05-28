import { useState } from 'react'
import './App.css'
import LetrasAudio from "./components/LetrasAudio";

function App() {
  return (
    <div>
      <h1 className="text-3xl text-center mt-6">Prueba de Audios</h1>
      <LetrasAudio />
    </div>
  );
}

export default App;
