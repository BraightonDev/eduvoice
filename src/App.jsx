import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Pagina1 from './paginas/pagina1/pagina1';
import PaginaCategoriaNiños from './paginas/pagina2/PaginaCategoriaNiños';
import LetrasAudio from './components/letrasPronunciacion.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pagina1 />} />
        {/* Placeholder para futuras páginas */}
        <Route path="/paginaCategoriaNiños" element={<PaginaCategoriaNiños />} />
        <Route path="/pagina3" element={<div>Página 3</div>} />
        <Route path="/letras-audio" element={<LetrasAudio />} />
      </Routes>
    </Router>
  );
}

export default App;
