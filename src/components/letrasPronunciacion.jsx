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
  const [cargando, setCargando] = useState(true);
  const [porcentajeCarga, setPorcentajeCarga] = useState(0);

  useEffect(() => {
  const obtenerContenidoDesdeAPI = async () => {
    try {
      let url = "";
      if (tema === "palabras") {
        url = `https://eduvoice-backend.onrender.com/api/palabras/lista-aleatoria?categoria=${categoria}`;
      } else if (tema === "letras") {
        url = `https://eduvoice-backend.onrender.com/api/letras/lista-aleatoria`;
      } else if (tema === "numeros") {
        url = `https://eduvoice-backend.onrender.com/api/numeros/lista-aleatoria`;
      } else if (tema === "frases") {
        url = `https://eduvoice-backend.onrender.com/api/frases/lista-aleatoria?categoria=${categoria}`;
      } else {
        throw new Error("Tema no válido");
      }

      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");

      const datos = await respuesta.json();
      setContenido(datos);

      let progreso = 0;
      const intervalo = setInterval(() => {
        progreso += 10;
        setPorcentajeCarga(Math.min(progreso, 100));
        if (progreso >= 100) {
          clearInterval(intervalo);
          setTimeout(() => {
            setCargando(false);
          }, 100);
        }
      }, 100);

    } catch (error) {
      console.error("Error al obtener datos:", error);
      navigate("/pagina0");
    }
  };

  obtenerContenidoDesdeAPI();

  // ⏱️ Intervalo para mantener la API activa
  const mantenerActiva = setInterval(() => {
    fetch("https://eduvoice-backend.onrender.com/") // o una ruta válida como /api/ping si tienes una
      .then(() => console.log("🔄 API mantenida activa"))
      .catch((err) => console.warn("⚠️ Error al mantener API activa:", err));
  }, 240000); // cada 4 minutos

  // Limpieza al desmontar
  return () => {
    clearInterval(mantenerActiva);
  };
}, [categoria, tema, navigate]);


  const volverAtras = () => navigate(`/pagina2/${tipo}/${categoria}`);

  const siguiente = () => {
    if (index < contenido.length - 1) {
      setIndex(index + 1);
      setResultado(null);
    }
  };

  const verificarPronunciacion = () => {
    const itemActual = contenido[index];
    const valor = String(itemActual.valor).toLowerCase();
    let formasEsperadas = [valor];

    if (tema === "numeros") {
      const mapaNumeros = {
        "0": "cero", "1": "uno", "2": "dos", "3": "tres", "4": "cuatro",
        "5": "cinco", "6": "seis", "7": "siete", "8": "ocho", "9": "nueve", "10": "diez"
      };

      const formaTexto = mapaNumeros[valor];
      const formaNumero = Object.keys(mapaNumeros).find((num) => mapaNumeros[num] === valor);

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

  const capitalizarPrimeraLetra = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const obtenerRutaArchivo = (tipoArchivo) => {
    const valor = contenido[index]?.valor;
    const texto = contenido[index]?.texto;

    if (!valor) return "";

    if (tipoArchivo === "imagen") {
      if (tema === "letras") return `/imagenes/letras/${valor.toUpperCase()}.png`;
      if (tema === "numeros") return `/imagenes/numeros/${valor}.png`;
    }

    if (tipoArchivo === "audio") {
      if (tema === "letras") return `/audios/letras/${valor.toUpperCase()}.mp3`;
      if (tema === "numeros") {
        const textoCapitalizado = capitalizarPrimeraLetra(texto);
        return `/audios/numeros/${valor}. ${textoCapitalizado}.mp3`;
      }
    }

    return "";
  };

  const reproducirAudio = () => {
    const audioUrl = obtenerRutaArchivo("audio");
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((e) => console.warn("Error al reproducir:", e.message));
    }
    console.log("Ruta de audio:", audioUrl);
  };

  if (cargando || !contenido.length) {
    return (
      <div className="letras-container letras-cargando">
        <div className="barra-progreso">
          <div
            className="barra-progreso-inner"
            style={{ width: `${porcentajeCarga}%` }}
          ></div>
        </div>
        <p>Cargando contenido, por favor espera...</p>
        <p className="porcentaje-carga">{porcentajeCarga}%</p>
      </div>
    );
  }

  const itemActual = contenido[index];

  const obtenerInstruccion = () => {
    const valor = itemActual.valor;
    const texto = itemActual.texto;

    if (tema === "letras") return `Di: letra ${valor}`;
    if (tema === "palabras") return `Di: ${valor}`;
    if (tema === "numeros") return `Di: número ${valor} (${texto})`;

    return `Di: ${valor}`;
  };

  return (
    <div className="letras-container" key={index}>
      <button className="boton-volver-pagina2" onClick={volverAtras}>
        Volver atrás
      </button>

      <h1 className="letras-titulo">Pronunciación de {tema}</h1>
      <h2 className="letras-titulo">Categoría: {categoria}</h2>

      <div className="letras-cuadro">
        <img
          src={obtenerRutaArchivo("imagen")}
          alt={itemActual.valor}
          onError={(e) => (e.target.style.display = "none")}
        />
        {tema === "numeros" && (
          <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
            {itemActual.valor} - {itemActual.texto}
          </p>
        )}
      </div>

      <h2 className="letras-subtitulo">{obtenerInstruccion()}</h2>

      <div className="letras-botones-container">
        <button className="letras-boton letras-boton-escuchar" onClick={reproducirAudio}>
          Escuchar sonido
        </button>
        <button className="letras-boton letras-boton-pronunciar" onClick={verificarPronunciacion}>
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
