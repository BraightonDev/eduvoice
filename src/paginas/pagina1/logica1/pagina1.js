let reconocimiento;
let escuchando = false;
let navegarA = null; // Guardamos el navigate aquí

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
      if (texto.includes("niño")) {
        navegarA("/pagina2");
      } else if (texto.includes("adulto")) {
        navegarA("/pagina2");
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
