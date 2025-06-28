let reconocimiento;
let escuchando = false;

export const iniciarPronunciacion = (formasEsperadas, tema, callback) => {
  // Detener cualquier audio que esté sonando
  if (window.audio && !window.audio.paused) {
    try {
      window.audio.pause();
      window.audio.currentTime = 0;
      window.audio = null;
    } catch (e) {
      console.warn("No se pudo detener audio previo en pronunciación:", e);
    }
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
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
    const formasNormalizadas = formasEsperadas.map((f) => limpiarTexto(f));

    const esCorrecto = formasNormalizadas.includes(normalizado);

    console.log("🔊 Texto reconocido:", resultadoCrudo);
    console.log("🧼 Texto normalizado:", normalizado);
    console.log("📌 Formas esperadas (normalizadas):", formasNormalizadas);
    console.log(esCorrecto ? "✅ Pronunciación correcta" : "❌ Pronunciación incorrecta");

    callback({
      resultado: esCorrecto ? "correcta" : "incorrecta",
      pronunciado: resultadoCrudo || "No detectado",
    });
  };

  reconocimiento.onerror = (event) => {
    console.error("❌ Error en reconocimiento:", event.error);
    if (event.error === "aborted") {
      console.info("ℹ️ Reconocimiento abortado por el sistema o el usuario.");
      return;
    }
    callback({
      resultado: "error",
      pronunciado: "—",
    });
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
    // Elimina artículos o prefijos como "la letra", "el número", etc.
    .replace(/^(la|el|letra|número|numero|el número|la letra)\s+/gi, "")
    // Elimina signos de puntuación como ¿?¡!., (en cualquier lugar)
    .replace(/[¿?¡!.,]/g, "")
    .trim();
};


