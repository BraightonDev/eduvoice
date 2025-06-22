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
  const [entradaUsuario, setEntradaUsuario] = useState("");

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
        if (!respuesta.ok)
          throw new Error("Error en la respuesta del servidor");

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

    const mantenerActiva = setInterval(() => {
      fetch("https://eduvoice-backend.onrender.com/")
        .then(() => console.log("🔄 API mantenida activa"))
        .catch((err) => console.warn("⚠️ Error al mantener API activa:", err));
    }, 240000);

    return () => clearInterval(mantenerActiva);
  }, [categoria, tema, navigate]);

  const volverAtras = () => navigate(`/pagina2/${tipo}/${categoria}`);

  const siguiente = () => {
    if (index < contenido.length - 1) {
      setIndex(index + 1);
      setResultado(null);
      setEntradaUsuario("");
    }
  };

  const verificar = () => {
    const itemActual = contenido[index];
    const valorEsperado = String(itemActual.valor).toLowerCase();
    const entradaNormalizada = entradaUsuario.trim().toLowerCase();

    if (tipo === "pronunciacion") {
      let formasEsperadas = [valorEsperado];
      if (tema === "numeros") {
        const mapaNumeros = {
          0: "cero",
          1: "uno",
          2: "dos",
          3: "tres",
          4: "cuatro",
          5: "cinco",
          6: "seis",
          7: "siete",
          8: "ocho",
          9: "nueve",
          10: "diez",
          11: "once",
          12: "doce",
          13: "trece",
          14: "catorce",
          15: "quince",
          16: "dieciséis",
          17: "diecisiete",
          18: "dieciocho",
          19: "diecinueve",
          20: "veinte",
        };

        const formaTexto = mapaNumeros[valorEsperado];
        const formaNumero = Object.keys(mapaNumeros).find(
          (num) => mapaNumeros[num] === valorEsperado
        );
        if (formaTexto) formasEsperadas.push(formaTexto);
        if (formaNumero) formasEsperadas.push(formaNumero);
      }
      iniciarPronunciacion(formasEsperadas, tema, setResultado);
    } else {
      if (tema === "numeros") {
        const mapaNumeros = {
          0: "cero",
          1: "uno",
          2: "dos",
          3: "tres",
          4: "cuatro",
          5: "cinco",
          6: "seis",
          7: "siete",
          8: "ocho",
          9: "nueve",
          10: "diez",
          11: "once",
          12: "doce",
          13: "trece",
          14: "catorce",
          15: "quince",
          16: "dieciséis",
          17: "diecisiete",
          18: "dieciocho",
          19: "diecinueve",
          20: "veinte",
        };

        const valor = Number(itemActual.valor);
        const formaTexto = mapaNumeros[valor];
        const posiblesFormas = [
          String(valor),
          formaTexto,
          formaTexto?.toLowerCase(),
          formaTexto?.toUpperCase(),
          capitalizarPrimeraLetra(formaTexto),
        ];

        if (posiblesFormas.includes(entradaUsuario.trim())) {
          setResultado("correcta");
        } else {
          setResultado("incorrecta");
        }
      } else {
        setResultado(
          entradaNormalizada === valorEsperado ? "correcta" : "incorrecta"
        );
      }
    }
  };

  const capitalizarPrimeraLetra = (str) =>
    !str ? "" : str.charAt(0).toUpperCase() + str.slice(1);

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
      if (tema === "letras") return `/audios/letras/${valor.toUpperCase()}.mp3`;
      if (tema === "numeros")
        return `/audios/numeros/${valor}. ${capitalizarPrimeraLetra(
          texto
        )}.mp3`;
    }
    return "";
  };

  const reproducirAudio = () => {
    const audioUrl = obtenerRutaArchivo("audio");
    if (audioUrl)
      new Audio(audioUrl)
        .play()
        .catch((e) => console.warn("Error al reproducir:", e.message));
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
    if (tipo === "escritura") return `Ingresa la ${tema}`;
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

      <h1 className="letras-titulo">
        {capitalizarPrimeraLetra(tipo)} de {tema}
      </h1>
      <h2 className="letras-titulo">Categoría: {categoria}</h2>

      {/* Imagen solo si no es escritura */}
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

      {/* Input libre si es tipo escritura */}
      {tipo === "escritura" && (
        <input
          className="input-escritura"
          type="text"
          value={entradaUsuario}
          onChange={(e) => setEntradaUsuario(e.target.value)}
          placeholder={`Escribe la ${tema}`}
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
        <button
          className="letras-boton letras-boton-pronunciar"
          onClick={verificar}
        >
          {tipo === "escritura" ? "Validar" : "Pronunciar"}
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
