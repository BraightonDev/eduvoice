let reconocimiento;
let escuchando = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = 'es-ES';
  reconocimiento.continuous = false;

  reconocimiento.onerror = function (event) {
    console.error("Error en reconocimiento:", event.error);
    if (typeof reconocimiento._onFinalizado === "function") {
      reconocimiento._onFinalizado("error");
    }
    detenerPronunciacion();
  };

  reconocimiento.onend = function () {
    escuchando = false; // <-- Asegura que puedas volver a iniciar
    console.log("Reconocimiento de voz finalizado");
  };
}

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zñ0-9]/gi, "")
    .toLowerCase();
}

export function iniciarPronunciacion(esperado, tema, callback) {
  if (reconocimiento && !escuchando) {
    escuchando = true;

    reconocimiento.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      console.log("Texto detectado:", transcript);

      const dicho = normalizar(transcript);
      const objetivo = normalizar(esperado);

      let resultado;
      
      if (tema === "numeros") {
        resultado = dicho.includes(objetivo);
      } else if (tema === "letras") {
        const ultimaLetra = dicho.slice(-1);
        resultado = ultimaLetra === objetivo;
      } else {
        resultado = dicho === objetivo;
      }

      callback(resultado ? "correcta" : "incorrecta");
      detenerPronunciacion(); // <-- Asegura detener al final
    };

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
