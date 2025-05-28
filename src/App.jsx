<<<<<<< HEAD

import './App.css'
import LetrasAudio from "./components/LetrasAudio";
=======
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Pagina1 from './paginas/pagina1/pagina1';
>>>>>>> fa9877fcf7bc5dfdf0b2a820d57051ae3862deb4

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

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> fa9877fcf7bc5dfdf0b2a820d57051ae3862deb4
