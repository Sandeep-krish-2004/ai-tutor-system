import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = 3001; // You can change this if needed

// Enable JSON parsing
app.use(express.json());

// Serve static files from 'public' folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Route: AI Tutor Chat
app.post('/ask', async (req, res) => {
  const userPrompt = req.body.prompt;
  console.log("User asked:", userPrompt);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();
    console.log("OpenAI response:", JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "No response from AI" });
    }

  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Server error while talking to AI" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ AI Tutor server running at http://localhost:${PORT}`);
});
  