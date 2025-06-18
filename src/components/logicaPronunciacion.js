let reconocimiento;
let escuchando = false;

export const iniciarPronunciacion = (formasEsperadas, tema, callback) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconocimiento = new SpeechRecognition();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = false;
  reconocimiento.interimResults = false;

  reconocimiento.onstart = () => {
    escuchando = true;
  };

  reconocimiento.onresult = (event) => {
    escuchando = false;
    const resultadoCrudo = event.results[0][0].transcript.toLowerCase().trim();
    const normalizado = limpiarTexto(resultadoCrudo);

    const formasNormalizadas = formasEsperadas.map((f) => limpiarTexto(f));

    if (formasNormalizadas.includes(normalizado)) {
      callback("correcta");
    } else {
      callback("incorrecta");
    }
  };

  reconocimiento.onerror = (event) => {
    console.error("Error en reconocimiento:", event.error);
    callback("error");
  };

  reconocimiento.onend = () => {
    escuchando = false;
  };

  reconocimiento.start();
};

export const detenerReconocimientoVoz = () => {
  if (escuchando && reconocimiento) {
    reconocimiento.stop();
  }
};

// ✅ Limpia prefijos y espacios comunes (como "letra", "el", etc.)
const limpiarTexto = (texto) => {
  return texto
    .replace(/^(la|el|letra|número|numero|el número|la letra)\s*/gi, "")
    .replace(/\s+/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};
