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
          <span>Intento</span>
          <span>Palabra</span>
          <span>Resultado</span>
          <span>{tipo === "escritura" ? "Escribió" : "Pronunció"}</span>
        </div>

        {resultados.map((intentos, palabraIndex) =>
          Array.isArray(intentos) ? (
            intentos.map((res, intentoIndex) => (
              <div
                key={`${palabraIndex}-${intentoIndex}`}
                className="fila-resultado"
              >
                <span>Intento {intentoIndex + 1}</span>
                <span>{res.item?.valor || "—"}</span>
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
            ))
          ) : (
            // Fallback por si resultados contiene objetos simples
            <div key={palabraIndex} className="fila-resultado">
              <span>Intento 1</span>
              <span>{intentos.item?.valor || "—"}</span>
              <span
                className={
                  intentos.noPronunciado
                    ? "no-pronunciado"
                    : intentos.correcto
                    ? "correcto"
                    : "incorrecto"
                }
              >
                {intentos.noPronunciado
                  ? "No pronunciada"
                  : intentos.correcto
                  ? "Correcto"
                  : "Incorrecta"}
              </span>
              <span>{intentos.pronunciado || "—"}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Resultados;
