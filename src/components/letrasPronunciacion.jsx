import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { iniciarPronunciacion } from "./logicaPronunciacion";
import "./letrasPronunciacion.css";

function LetrasAudio() {
  const navigate = useNavigate();
  const { tipo, categoria, tema } = useParams();
  const [contenido, setContenido] = useState([]);
  const [index, setIndex] = useState(0);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const obtenerContenidoDesdeAPI = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:8080/api/palabras/lista-aleatoria/niños"
        );
        if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");

        const datos = await respuesta.json();
        setContenido(datos);
      } catch (error) {
        console.error("Error al obtener datos desde API:", error);
        navigate("/pagina0");
      }
    };

    obtenerContenidoDesdeAPI();
  }, [navigate]);

  const volverAtras = () => navigate(`/pagina2/${tipo}/${categoria}`);

  const siguiente = () => {
    if (index < contenido.length - 1) {
      setIndex(index + 1);
      setResultado(null);
    }
  };

  const verificarPronunciacion = () => {
    const itemActual = contenido[index];
    const valor = itemActual.valor.toLowerCase();

    let formasEsperadas = [valor];

    if (tema === "numeros") {
      const mapaNumeros = {
        "0": "cero",
        "1": "uno",
        "2": "dos",
        "3": "tres",
        "4": "cuatro",
        "5": "cinco",
        "6": "seis",
        "7": "siete",
        "8": "ocho",
        "9": "nueve",
        "10": "diez"
      };

      const formaTexto = mapaNumeros[valor];
      const formaNumero = Object.keys(mapaNumeros).find(
        (num) => mapaNumeros[num] === valor
      );

      if (formaTexto && !formasEsperadas.includes(formaTexto)) {
        formasEsperadas.push(formaTexto);
      }

      if (formaNumero && !formasEsperadas.includes(formaNumero)) {
        formasEsperadas.push(formaNumero);
      }
    }

    iniciarPronunciacion(formasEsperadas, tema, (resultadoFinal) => {
      setResultado(resultadoFinal);
    });
  };

  const reproducirAudio = () => {
    const audio = new Audio(contenido[index].audio);
    audio.play().catch((e) => console.warn("Error al reproducir:", e.message));
  };

  if (!contenido.length) return <p>Cargando contenido...</p>;

  const itemActual = contenido[index];

  const obtenerInstruccion = () => {
    const valor = itemActual.valor;
    if (tema === "letras") return `Di: letra ${valor}`;
    if (tema === "numeros") return `Di: ${valor}`;
    return `Di: ${valor}`;
  };

  return (
    <div className="letras-container" key={index}>
      <button className="boton-volver-pagina2" onClick={volverAtras}>
        Volver atrás
      </button>
      <h1 className="letras-titulo">Pronunciación de {tema}</h1>

      <div className="letras-cuadro">
        <img src={itemActual.imagen} alt={itemActual.valor} />
      </div>

      <h2 className="letras-subtitulo">{obtenerInstruccion()}</h2>

      <div className="letras-botones-container">
        <button
          className="letras-boton letras-boton-escuchar"
          onClick={reproducirAudio}
        >
          Escuchar sonido
        </button>
        <button
          className="letras-boton letras-boton-pronunciar"
          onClick={verificarPronunciacion}
        >
          Pronunciar
        </button>
        <button
          className="letras-boton letras-boton-siguiente"
          onClick={siguiente}
          disabled={index >= contenido.length - 1}
        >
          Siguiente
        </button>
      </div>

      <div className="letras-mensaje">
        {resultado === "correcta" && (
          <p className="mensaje-correcto">✅ ¡Pronunciación correcta!</p>
        )}
        {resultado === "incorrecta" && (
          <p className="mensaje-incorrecto">❌ Intenta de nuevo</p>
        )}
        {resultado === "error" && (
          <p className="mensaje-error">⚠️ Error al reconocer la voz</p>
        )}
      </div>
    </div>
  );
}

export default LetrasAudio;
