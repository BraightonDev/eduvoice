// src/paginas/logica2/logica2.js

let reconocimiento;
let escuchando = false;
let navegarA = null;
let tipoGlobal = null;
let categoriaGlobal = null;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = false;

  reconocimiento.onresult = function (event) {
    const texto = event.results[0][0].transcript.toLowerCase();
    console.log("Texto detectado:", texto);

    if (navegarA && tipoGlobal && categoriaGlobal) {
      let tema = null;

      if (texto.includes("letra")) tema = "letras";
      else if (texto.includes("color")) tema = "colores";
      else if (texto.includes("número") || texto.includes("numero")) tema = "numeros";
      else if (texto.includes("palabra")) tema = "palabras";

      if (tema) {
        const ruta = `/contenido/${tipoGlobal}/${categoriaGlobal}/${tema}`;
        console.log("Redirigiendo a:", ruta);
        navegarA(ruta);
      } else {
        alert("No se reconoció un tema válido.");
      }
    }
  };

  reconocimiento.onerror = function (event) {
    console.error("Error en reconocimiento:", event.error);
  };
}

export function iniciarReconocimientoVoz(navigate, tipo, categoria) {
  if (reconocimiento && !escuchando) {
    escuchando = true;
    navegarA = navigate;
    tipoGlobal = tipo;
    categoriaGlobal = categoria;
    reconocimiento.start();
    console.log("Reconocimiento de voz iniciado");
  }
}

export function detenerReconocimientoVoz() {
  if (reconocimiento && escuchando) {
    escuchando = false;
    reconocimiento.stop();
    console.log("Reconocimiento de voz detenido");
  }
}
