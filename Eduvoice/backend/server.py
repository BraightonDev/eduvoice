from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import uuid

app = Flask(__name__)
CORS(app)

# Cargar modelo Whisper
model = whisper.load_model("base")

@app.route("/transcribir", methods=["POST"])
def transcribir_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No se envió ningún archivo de audio"}), 400

    archivo = request.files["audio"]
    nombre_archivo = f"{uuid.uuid4()}.webm"
    ruta_guardado = os.path.join("temp", nombre_archivo)

    # Asegurarse de que la carpeta temp exista
    os.makedirs("temp", exist_ok=True)

    archivo.save(ruta_guardado)

    # Transcribir con Whisper
    resultado = model.transcribe(ruta_guardado)
    texto = resultado.get("text", "").strip()

    os.remove(ruta_guardado)

    return jsonify({"texto": texto})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
