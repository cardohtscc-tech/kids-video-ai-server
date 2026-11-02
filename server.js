
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    proyecto: "Kids Video AI",
    estado: "Servidor funcionando"
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    mensaje: "Kids Video AI conectado"
  });
});

app.post("/api/generate", (req, res) => {
  const { title, story, format, duration } = req.body;

  if (!story) {
    return res.status(400).json({
      error: "Debes escribir una historia"
    });
  }

  res.status(501).json({
    mensaje: "Solicitud recibida",
    titulo: title || "Mi película",
    formato: format || "16:9",
    duracion: duration || 1,
    estado: "Falta conectar el generador de videos"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Kids Video AI funcionando en el puerto " + PORT);
});
