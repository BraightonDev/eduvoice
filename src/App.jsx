import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Pagina1 from './paginas/pagina1/pagina1';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pagina1 />} />
        {/* Placeholder para futuras páginas */}
        <Route path="/pagina2" element={<div>Página 2</div>} />
        <Route path="/pagina3" element={<div>Página 3</div>} />
      </Routes>
    </Router>
  );
}

export default App;
