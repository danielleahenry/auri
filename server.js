const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// ✅ Correct CORS configuration
const corsOptions = {
  origin: "https://danielleahenry.github.io", // Frontend URL
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200, // Helps with legacy browser issues
};

app.use(cors(corsOptions)); // Apply CORS middleware globally
app.use(express.json());

// Route to handle the search
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
