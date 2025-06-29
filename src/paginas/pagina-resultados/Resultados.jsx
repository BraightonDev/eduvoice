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
          <span>Intento</span>
          <span>Resultado</span>
          <span>{tipo === "escritura" ? "Escribió" : "Pronunció"}</span>
        </div>

        {resultados.map((intentosPorPalabra, index) =>
          (Array.isArray(intentosPorPalabra) ? intentosPorPalabra : [intentosPorPalabra])
            .map((intento, intentoIndex) => (
              <div key={`${index}-${intentoIndex}`} className="fila-resultado">
                <span>{intento.item?.valor}</span>
                <span>{intentoIndex + 1}</span>
                <span
                  className={
                    intento.noPronunciado
                      ? "no-pronunciado"
                      : intento.correcto
                      ? "correcto"
                      : "incorrecto"
                  }
                >
                  {intento.noPronunciado
                    ? "No pronunciada"
                    : intento.correcto
                    ? "Correcto"
                    : "Incorrecta"}
                </span>
                <span>{intento.pronunciado || "—"}</span>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Resultados;
