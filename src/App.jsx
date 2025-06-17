import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginaLogo from './paginas/paginaLogo/paginaLogo';
import Pagina0 from './paginas/pagina0/pagina0';
import Pagina1 from './paginas/pagina1/pagina1';
import Pagina2 from './paginas/pagina2/pagina2';
import LetrasAudio from './components/letrasPronunciacion.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaLogo />} />
        {/* Placeholder para futuras páginas */}
        <Route path="/pagina0" element={<Pagina0 />} />
        <Route path="/pagina1/:tipo" element={<Pagina1 />} />
        <Route path="/pagina2/:tipo/:categoria" element={<Pagina2 />} />
        <Route path="/pagina3" element={<div>Página 3</div>} />
        <Route path="/contenido/:tipo/niños/:tema" element={<LetrasAudio />} />

      </Routes>
    </Router>
  );
}

export default App;
