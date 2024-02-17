const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());

// Proxy endpoint
app.post('/synthesize-speech', async (req, res) => {
  const { text } = req.body;
  const API_KEY = process.env.API_KEY
  const VOICE_ID = 'IKne3meq5aSn9XLyUdCD';
  const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        text,
        voice_settings: {}, // Optional: Add any desired voice settings here
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    // Forward the audio stream back to the client
    res.setHeader('Content-Type', 'audio/mpeg');
    response.body.pipe(res);
  } catch (error) {
    console.error("Error in proxying speech synthesis:", error);
    res.status(500).send("Error synthesizing speech.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
