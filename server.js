const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/synthesize-speech', async (req, res) => {
  const { text } = req.body;
  const API_KEY = process.env.API_KEY;
  const VOICE_ID = process.env.VOICE_ID; // Ensure this is correctly set
  const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;

  // Define the request options according to Eleven Labs' required format
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model_id: "eleven_monolingual_v1", // Ensure you're using a valid model_id
      text: text, // Use the text from the request
    }),
  };

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(API_URL, options);

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
