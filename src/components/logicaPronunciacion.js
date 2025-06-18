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
    console.log("🎤 Reconocimiento iniciado...");
    console.log("✅ Formas esperadas:", formasEsperadas);
  };

  reconocimiento.onresult = (event) => {
    escuchando = false;
    const resultadoCrudo = event.results[0][0].transcript.toLowerCase().trim();
    const normalizado = limpiarTexto(resultadoCrudo);
    // Sustituir esto
    const formasNormalizadas = formasEsperadas.map((f) => limpiarTexto(f));

    // Por esto (garantiza que uses el array limpio en la comparación)
    formasEsperadas = formasEsperadas.map((f) => limpiarTexto(f));
    if (formasEsperadas.includes(normalizado)) {
      console.log("✅ Pronunciación correcta");
      callback("correcta");
    } else {
      console.log("❌ Pronunciación incorrecta");
      callback("incorrecta");
    }

    console.log("🔊 Texto reconocido por el micrófono:", resultadoCrudo);
    console.log("🧼 Texto normalizado:", normalizado);
    console.log("📌 Formas esperadas (normalizadas):", formasNormalizadas);

    if (formasNormalizadas.includes(normalizado)) {
      console.log("✅ Pronunciación correcta");
      callback("correcta");
    } else {
      console.log("❌ Pronunciación incorrecta");
      callback("incorrecta");
    }
  };

  reconocimiento.onerror = (event) => {
    console.error("❌ Error en reconocimiento:", event.error);
    if (event.error === "aborted") {
      console.info("ℹ️ Reconocimiento abortado por el sistema o el usuario.");
      return; // no llamamos al callback para no mostrar error innecesario
    }
    callback("error");
  };

  reconocimiento.onend = () => {
    escuchando = false;
    console.log("🛑 Reconocimiento finalizado.");
  };

  reconocimiento.start();
};

export const detenerReconocimientoVoz = () => {
  if (escuchando && reconocimiento) {
    reconocimiento.abort();
    console.log("🛑 Reconocimiento abortado manualmente.");
  }
};

const limpiarTexto = (texto) => {
  return texto
    .replace(/^(la|el|letra|número|numero|el número|la letra)\s*/gi, "") 
    .replace(/[.,¡!¿?]/g, "")  
    .replace(/\s+/g, "")       
    .toLowerCase();            
};

