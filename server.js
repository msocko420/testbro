const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors());

app.use(express.json());

// Dynamically import node-fetch
app.post('/synthesize-speech', async (req, res) => {
  const { text } = req.body;
  const API_KEY = process.env.API_KEY
  const VOICE_ID = 'IKne3meq5aSn9XLyUdCD';
  const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;


  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2", // Add the correct model_id here
        voice_settings: {
          // Optional: Specify voice settings here if needed
        },
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
