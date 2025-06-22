// src/paginas/logica1/pagina1.js
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
    const texto = event.results[0][0].transcript.toLowerCase().trim();
    console.log("🎤 Texto detectado:", texto);

    if (navegarA) {
      // Detenemos cualquier audio en reproducción
      if (window.audio && !window.audio.paused) {
        window.audio.pause();
        window.audio.currentTime = 0;
      }

      // Reproduce el audio "indicacion 2.mp3"
      window.audio = new Audio("/audios/indicaciones/indicacion 2.mp3");
      window.audio.play().catch((e) =>
        console.warn("No se pudo reproducir audio:", e)
      );

      navegarA(texto);
    }
  };

  reconocimiento.onerror = function (event) {
    console.error("❌ Error en reconocimiento:", event.error);
  };
}

export function iniciarReconocimientoVoz(navigate, tipo) {
  if (reconocimiento && !escuchando) {
    escuchando = true;

    navegarA = (texto) => {
      if (texto.includes("niño")) {
        navigate(`/pagina2/${tipo}/niño`);
      } else if (texto.includes("adulto")) {
        navigate(`/pagina2/${tipo}/adulto`);
      } else {
        alert("No se reconoció un comando válido. Intenta decir 'niño' o 'adulto'.");
      }
    };

    reconocimiento.start();
    console.log("🟢 Reconocimiento de voz iniciado");
  }
}

export function detenerReconocimientoVoz() {
  if (reconocimiento && escuchando) {
    escuchando = false;
    reconocimiento.stop();
    console.log("🛑 Reconocimiento de voz detenido");
  }
}
