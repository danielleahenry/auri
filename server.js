const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// ✅ Robust CORS config
app.use(cors({
  origin: "https://danielleahenry.github.io",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// 🔁 Optional: handle manual preflight (in case the library fails)
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://danielleahenry.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Auri backend is live");
});

// 🎧 Voice search endpoint
app.post("/search", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const response = await axios.get("https://api.deezer.com/search", {
      params: { q: query },
    });

    const song = response.data.data[0];

    if (!song) {
      return res.status(404).json({ error: "No song found" });
    }

    res.json({
      title: song.title,
      artist: song.artist.name,
      coverUrl: song.album.cover_medium,
      previewUrl: song.preview,
    });
  } catch (error) {
    console.error("Deezer API error:", error);
    res.status(500).json({ error: "Failed to fetch from Deezer" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
