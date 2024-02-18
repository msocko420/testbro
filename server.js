const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/synthesize-speech', async (req, res) => {
  const { text } = req.body;
  // Ensure API_KEY is set in your environment variables
  const API_KEY = process.env.API_KEY;
  const VOICE_ID = process.env.VOICE_ID; // Ensure this is correctly set
  const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;

  const payload = {
    model_id: "eleven_turbo_v2", // Updated model_id based on the working format
    text: text,
  };

  console.log("Sending to Eleven Labs:", JSON.stringify(payload));

  const options = {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY, // Updated header for API key
      'Content-Type': 'application/json',
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

    // Adjust response handling if necessary based on your application's needs
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
