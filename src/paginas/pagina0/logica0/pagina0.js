// src/paginas/logica0/pagina0.js
let reconocimiento;
let escuchando = false;
let navegarA = null;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = false;

  reconocimiento.onresult = function (event) {
    const texto = event.results[0][0].transcript.toLowerCase();
    console.log("Texto detectado:", texto);

    if (navegarA) {
      // Detenemos audio actual
      if (window.audio && !window.audio.paused) {
        window.audio.pause();
        window.audio.currentTime = 0;
      }

      // Reproducción del audio "indicacion 1.mp3"
      window.audio = new Audio("/audios/indicaciones/indicacion 1.mp3");
      window.audio.play().catch((e) =>
        console.warn("No se pudo reproducir audio:", e)
      );

      if (texto.includes("pronunciación")) {
        navegarA("/pagina1/pronunciacion");
      } else if (texto.includes("escritura")) {
        navegarA("/pagina1/escritura");
      } else {
        alert("No se reconoció un comando válido.");
      }
    }
  };

  reconocimiento.onerror = function (event) {
    console.error("Error en reconocimiento:", event.error);
  };
}

export function iniciarReconocimientoVoz(navigate) {
  if (reconocimiento && !escuchando) {
    escuchando = true;
    navegarA = navigate;
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
