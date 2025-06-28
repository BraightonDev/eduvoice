// src/components/GrabarPronunciacion.jsx
import React, { useState, useRef } from "react";

const GrabarPronunciacion = ({ onResultado }) => {
  const [grabando, setGrabando] = useState(false);
  const [transcripcion, setTranscripcion] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const iniciarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "grabacion.webm");

        const respuesta = await fetch("http://localhost:5000/transcribir", {
          method: "POST",
          body: formData,
        });

        const data = await respuesta.json();
        setTranscripcion(data.texto || "No se pudo transcribir");
        if (onResultado) onResultado(data.texto);
      };

      mediaRecorder.start();
      setGrabando(true);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
      alert("No se pudo acceder al micrófono");
    }
  };

  const detenerGrabacion = () => {
    if (mediaRecorderRef.current && grabando) {
      mediaRecorderRef.current.stop();
      setGrabando(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Grabación de pronunciación</h2>
      <button onClick={grabando ? detenerGrabacion : iniciarGrabacion}>
        {grabando ? "Detener" : "Comenzar a grabar"}
      </button>

      {transcripcion && (
        <p>
          <strong>Texto transcrito:</strong> {transcripcion}
        </p>
      )}
    </div>
  );
};

export default GrabarPronunciacion;
