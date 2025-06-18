let reconocimiento;
let escuchando = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
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
    escuchando = false;
    console.log("Reconocimiento de voz finalizado");
  };
}

function normalizar(texto) {
  if (typeof texto !== "string") return "";
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zñ0-9]/gi, "")
    .toLowerCase();
}

// Mapeo de números para reconocer formas textuales y numéricas
const numerosMap = {
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
  "10": "diez",
  "11": "once",
  "12": "doce",
  "13": "trece",
  "14": "catorce",
  "15": "quince",
  "16": "dieciseis",
  "17": "diecisiete",
  "18": "dieciocho",
  "19": "diecinueve",
  "20": "veinte",
};

export function iniciarPronunciacion(esperado, tema, callback) {
  if (reconocimiento && !escuchando) {
    escuchando = true;

    reconocimiento.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      console.log("Texto detectado:", transcript);

      const dicho = normalizar(transcript);
      const objetivo = normalizar(esperado);

      let resultado = false;

      if (tema === "numeros") {
        const formasEsperadas = new Set([
          objetivo,
          normalizar(numerosMap[objetivo] || ""),
        ]);

        for (const [numero, nombre] of Object.entries(numerosMap)) {
          if (normalizar(nombre) === objetivo) {
            formasEsperadas.add(normalizar(numero));
            break;
          }
        }

        resultado = [...formasEsperadas].some(f => dicho.includes(f));
      } else if (tema === "letras") {
        const ultimaLetra = dicho.slice(-1);
        resultado = ultimaLetra === objetivo;
      } else {
        resultado = dicho === objetivo;
      }

      callback(resultado ? "correcta" : "incorrecta");
      detenerPronunciacion();
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
