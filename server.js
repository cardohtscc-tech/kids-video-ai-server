
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({ proyecto: "Kids Video AI", estado: "Servidor funcionando" });
});

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    chatgpt: Boolean(process.env.OPENAI_API_KEY)
  });
});

app.post("/api/story", async (req, res) => {
  try {
    const {
      title,
      characters,
      idea,
      duration,
      format,
      style,
      language
    } = req.body;

    if (!idea || !idea.trim()) {
      return res.status(400).json({ error: "Escribe una idea para tu historia." });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: "Eres un guionista creativo de películas familiares. Escribe contenido original, apropiado para todas las edades, en el idioma solicitado. Devuelve un guion organizado con escenas, descripciones visuales y diálogos.",
      input: `Crea una historia titulada "${title || "Mi película"}".
Personajes: ${characters || "Personajes originales"}.
Idea: ${idea}
Duración deseada: ${duration || 1} minutos.
Formato: ${format || "16:9"}.
Estilo visual: ${style || "3D"}.
Idioma: ${language || "Español"}.
Incluye una introducción, desarrollo, desenlace y escenas numeradas.`
    });

    res.json({
      estado: "Historia creada",
      historia: response.output_text
    });

  } catch (error) {
    console.error("Error creando historia:", error.message);
    res.status(500).json({
      error: "No se pudo generar la historia. Revisa la configuración de la API."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Kids Video AI funcionando en el puerto ${PORT}`);
});
const RunwayML = require("@runwayml/sdk");

const runway = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET
});

app.post("/api/runway-test", async (req, res) => {
  try {
    const task = await runway.textToVideo.create({
      model: "gen4.5",
      promptText: req.body.prompt,
      ratio: "1280:720",
      duration: 5
    }).waitForTaskOutput();

    res.json({
      success: true,
      videoUrl: task.output[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "No se pudo generar el video."
    });
  }
});
