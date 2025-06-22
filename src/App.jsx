import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginaLogo from './paginas/paginaLogo/paginaLogo';
import PaginaInicio from './paginas/paginaInicio/paginaInicio.jsx'; 
import Pagina0 from './paginas/pagina0/pagina0';
import Pagina1 from './paginas/pagina1/pagina1';
import Pagina2 from './paginas/pagina2/pagina2';
import LetrasAudio from './components/letrasPronunciacion.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Pantalla de logo primero */}
        <Route path="/" element={<PaginaLogo />} />

        {/* ✅ Luego bienvenida */}
        <Route path="/inicio" element={<PaginaInicio />} />

        {/* ✅ Después el flujo normal */}
        <Route path="/pagina0" element={<Pagina0 />} />
        <Route path="/pagina1/:tipo" element={<Pagina1 />} />
        <Route path="/pagina2/:tipo/:categoria" element={<Pagina2 />} />
        <Route path="/pagina3" element={<div>Página 3</div>} />
        <Route path="/contenido/:tipo/:categoria/:tema" element={<LetrasAudio />} />
      </Routes>
    </Router>
  );
}

export default App;
