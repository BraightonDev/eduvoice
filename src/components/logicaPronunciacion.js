let reconocimiento;
let escuchando = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = 'es-ES';
  reconocimiento.continuous = false;

  reconocimiento.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    console.log("Texto detectado:", transcript);
    
    if (typeof reconocimiento._onFinalizado === "function") {
      reconocimiento._onFinalizado(transcript);
    }
  };

  reconocimiento.onerror = function (event) {
    console.error("Error en reconocimiento:", event.error);
    if (typeof reconocimiento._onFinalizado === "function") {
      reconocimiento._onFinalizado("ERROR");
    }
  };
}

export function iniciarPronunciacion(callback) {
  if (reconocimiento && !escuchando) {
    escuchando = true;
    reconocimiento._onFinalizado = callback;
    reconocimiento.start();
    console.log("Reconocimiento de voz iniciado");
  }
}

export function detenerPronunciacion() {
  if (reconocimiento && escuchando) {
    escuchando = false;
    reconocimiento.stop();
    console.log("Reconocimiento de voz detenido");
  }
}