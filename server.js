const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Dynamically import node-fetch
app.post('/synthesize-speech', async (req, res) => {
  const { text } = req.body;
  const API_KEY = 'your_api_key';
  const VOICE_ID = 'your_voice_id';
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
        voice_settings: {},
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
