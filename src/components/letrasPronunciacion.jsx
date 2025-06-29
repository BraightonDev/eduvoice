import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { iniciarPronunciacion } from "./logicaPronunciacion.js";
import "./letrasPronunciacion.css";

function LetrasAudio() {
  const navigate = useNavigate();
  const { tipo, categoria, tema } = useParams();
  const [contenido, setContenido] = useState([]);
  const [index, setIndex] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [resultadosTotales, setResultadosTotales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [porcentajeCarga, setPorcentajeCarga] = useState(0);
  const [entradaUsuario, setEntradaUsuario] = useState("");

  // ✅ Reproducir audio de indicación al ingresar (una sola vez)
  useEffect(() => {
    const ruta = `/audios/indicaciones/indicacion ${tema}1.mp3`;
    const audio = new Audio(ruta);
    audio.play().catch((e) => console.warn("No se pudo reproducir la indicación:", e.message));
  }, [tema]);

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

        let datos = await respuesta.json();
        if (tema === "numeros") datos = datos.filter((item) => item.valor <= 20);
        setContenido(datos);

        const progresoCarga = setInterval(() => {
          setPorcentajeCarga((prev) => {
            if (prev >= 100) {
              clearInterval(progresoCarga);
              setTimeout(() => setCargando(false), 200);
              return 100;
            }
            return prev + 10;
          });
        }, 100);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        navigate("/pagina0");
      }
    };

    obtenerContenidoDesdeAPI();
  }, [categoria, tema, tipo, navigate]);

  const capitalizarPrimeraLetra = (str) =>
    !str ? "" : str.charAt(0).toUpperCase() + str.slice(1);

  const detenerAudio = () => {
    if (window.audio && !window.audio.paused) {
      try {
        window.audio.pause();
        window.audio.currentTime = 0;
        window.audio = null;
      } catch (e) {
        console.warn("No se pudo detener el audio previo:", e);
      }
    }
  };

  const iniciarReconocimiento = () => {
    const itemActual = contenido[index];
    const valorEsperado = String(itemActual.valor).toLowerCase().trim();

    const formasEsperadas = [
      valorEsperado,
      `letra ${valorEsperado}`,
      `número ${valorEsperado}`,
      `el número ${valorEsperado}`,
      `la letra ${valorEsperado}`,
    ];

    iniciarPronunciacion(
      formasEsperadas,
      tema,
      ({ resultado, pronunciado }) => {
        setResultado(resultado);
        const nuevoIntento = {
          item: itemActual,
          correcto: resultado === "correcta",
          pronunciado: pronunciado || "No pronunció",
          noPronunciado: !pronunciado,
        };

        setResultadosTotales((prev) => {
          const copia = [...prev];
          if (!copia[index]) copia[index] = [];
          copia[index].push(nuevoIntento);
          return copia;
        });
      }
    );
  };

  const verificar = () => {
    const itemActual = contenido[index];
    const valorEsperado = String(itemActual.valor).toLowerCase().trim();
    const entrada = entradaUsuario.toLowerCase().trim();

    const esCorrecto = entrada === valorEsperado;
    setResultado(esCorrecto ? "correcta" : "incorrecta");

    const nuevoIntento = {
      item: itemActual,
      correcto: esCorrecto,
      pronunciado: entrada || "No ingresó texto",
      noPronunciado: !entrada,
    };

    setResultadosTotales((prev) => {
      const copia = [...prev];
      if (!copia[index]) copia[index] = [];
      copia[index].push(nuevoIntento);
      return copia;
    });
  };

  const siguiente = () => {
    detenerAudio();
    if (index < contenido.length - 1) {
      setIndex(index + 1);
      setResultado(null);
      setEntradaUsuario("");
    } else {
      navigate("/resultados", {
        state: {
          resultados: resultadosTotales,
          tipo,
          categoria,
          tema,
        },
      });
    }
  };

  const volverAtras = () => {
    detenerAudio();
    navigate(`/pagina2/${tipo}/${categoria}`);
  };

  const obtenerRutaArchivo = (tipoArchivo) => {
    const valor = contenido[index]?.valor;
    const texto = contenido[index]?.texto;
    if (!valor) return "";
    if (tipoArchivo === "imagen") {
      if (tema === "letras")
        return `/imagenes/letras/${valor.toUpperCase()}.png`;
      if (tema === "numeros") return `/imagenes/numeros/${valor}.png`;
    }
    if (tipoArchivo === "audio") {
      if (tema === "letras")
        return `/audios/letras/${valor.toUpperCase()}.mp3`;
      if (tema === "numeros")
        return `/audios/numeros/${valor}. ${capitalizarPrimeraLetra(texto)}.mp3`;
      if (tema === "palabras")
        return `/audios/palabras/${categoria}/${valor}.mp3`;
      if (tema === "frases") {
        const valorLimpio = valor.replace(/[¿?]/g, "");
        return `/audios/frases/${categoria}/${valorLimpio}.mp3`;
      }
    }
    return "";
  };

  const reproducirAudio = () => {
    detenerAudio();
    const audioUrl = obtenerRutaArchivo("audio");
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      window.audio = audio;
      audio
        .play()
        .catch((e) => console.warn("Error al reproducir:", e.message));
    }
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
    if (tipo === "escritura") {
      if (tema === "numeros") return `Ingresa el número escrito`;
      if (tema === "palabras") return `Ingresa la palabra`;
      if (tema === "letras") return `Ingresa la letra`;
      if (tema === "frases") return `Ingresa la frase`;
    }
    if (tipo === "pronunciacion") {
      if (tema === "letras") return `Di: letra ${valor}`;
      if (tema === "palabras") return `Di: ${valor}`;
      if (tema === "numeros") return `Di: número ${valor} (${texto})`;
      if (tema === "frases") return `Di: ${valor}`;
    }
  };

  return (
    <div className="letras-container" key={index}>
      <button className="boton-volver-pagina2" onClick={volverAtras}>
        Volver atrás
      </button>

      <h1 className="letras-titulo">
        {capitalizarPrimeraLetra(tipo)} de {tema}
      </h1>
      <h2 className="letras-titulo">Categoría: {categoria}</h2>

      {tipo !== "escritura" && (
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
      )}

      {tipo === "escritura" && (
        <input
          className="input-escritura"
          type="text"
          value={entradaUsuario}
          onChange={(e) => setEntradaUsuario(e.target.value)}
          placeholder={`Escribe la ${tema}`}
          style={{ marginTop: "1.5rem" }}
        />
      )}

      <h2 className="letras-subtitulo">{obtenerInstruccion()}</h2>

      <div className="letras-botones-container">
        <button
          className="letras-boton letras-boton-escuchar"
          onClick={reproducirAudio}
        >
          Escuchar sonido
        </button>
        {tipo === "pronunciacion" ? (
          <button
            className="letras-boton letras-boton-pronunciar"
            onClick={iniciarReconocimiento}
          >
            Pronunciar
          </button>
        ) : (
          <button
            className="letras-boton letras-boton-pronunciar"
            onClick={verificar}
          >
            Validar
          </button>
        )}
        <button
          className="letras-boton letras-boton-siguiente"
          onClick={siguiente}
        >
          Siguiente
        </button>
      </div>

      <div className="letras-mensaje">
        {resultado === "correcta" && (
          <p className="mensaje-correcto">✅ ¡Respuesta correcta!</p>
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
