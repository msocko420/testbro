const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/synthesize-speech', async (req, res) => {
  const { text } = req.body;
  const API_KEY = process.env.API_KEY;
  const VOICE_ID = process.env.VOICE_ID;
  const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;

  const payload = {
    model_id: "eleven_monolingual_v1",
    text: text,
  };

  console.log("Sending to Eleven Labs:", JSON.stringify(payload));

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  };

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(API_URL, options);

    if (!response.ok) {
      const errorBody = await response.text(); // Adjust based on the expected error format
      console.error("Error Body from Eleven Labs:", errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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
