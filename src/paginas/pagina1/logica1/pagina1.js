let reconocimiento;
let escuchando = false;
let navegarA = null; // Función que maneja la navegación

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

    // Define cómo navegar según el texto detectado y el tipo actual
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
