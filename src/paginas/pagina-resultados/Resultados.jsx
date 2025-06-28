import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Resultados.css";

const Resultados = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultados = [], tipo, categoria, tema } = location.state || {};

  const volverInicio = () => {
    navigate(`/pagina2/${tipo}/${categoria}`);
  };

  return (
    <div className="contenedor-pagina1">
      <button className="boton-volver-pagina1" onClick={volverInicio}>
        Volver a intentarlo
      </button>

      <h1 className="titulo-pagina1">Resultados de {tema}</h1>

      <div className="tabla-resultados">
        <div className="tabla-cabecera">
          <span>Palabra</span>
          <span>Resultado</span>
          <span>Pronunció</span>
        </div>

        {resultados.map((res, i) => (
          <div key={i} className="fila-resultado">
            <span>{res.item.valor}</span>
            <span
              className={
                res.noPronunciado
                  ? "no-pronunciado"
                  : res.correcto
                  ? "correcto"
                  : "incorrecto"
              }
            >
              {res.noPronunciado
                ? "No pronunciada"
                : res.correcto
                ? "Correcto"
                : "Incorrecta"}
            </span>
            <span>{res.pronunciado || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resultados;
