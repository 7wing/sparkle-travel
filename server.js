// server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// reconstruct __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ✅ Serve static files locally (optional). On Vercel, static files in /public are served automatically.
// If you want to keep this for local dev, it’s safe:
app.use(express.static(path.join(__dirname, 'public')));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = process.env.GEMINI_API_URL;

const fetchWithRetry = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }

      if (response.status === 403 || response.status === 429 || response.status >= 500) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      const errorBody = await response.text();
      throw new Error(`Gemini API error! Status: ${response.status}. Body: ${errorBody}`);
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

app.post('/api/plan-trip', async (req, res) => {
  const { destination, origin, experience } = req.body;

  if (!destination) {
    return res.status(400).json({ error: 'Destination is required.' });
  }
  if (!GEMINI_API_KEY || !GEMINI_BASE_URL) {
    return res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY or GEMINI_API_URL is missing.' });
  }

  const systemPrompt = `You are a specialized, comprehensive travel analyst and risk assessor. Your task is to provide a detailed, single-block travel report for the user's requested destination, using real-time information from Google Search.

  ## 1. Logistics & Booking Estimates
  - Provide current flight price ranges for travel from ${origin || 'the user\'s origin city'} (including airports searched).
  - List accommodation type recommendations and price estimates (e.g., luxury, mid-range, budget hostels).

  ## 2. Local Safety & Real-Time News
  - Summarize the latest, most relevant news or advisories for travelers.
  - Provide an objective assessment of the crime rate and specific safety concerns.
  - Clearly identify areas that are known to be tourism-friendly and those that are recommended to avoid.

  ## 3. Culture, Food & Guides
  - Recommend must-try local foods and dining areas.
  - List major travel centers (e.g., transit hubs, main information offices).
  - Recommend 1-3 highly-rated, local travel guides or guide services.`;

  let userQuery = `Generate a full travel intelligence report for traveling from ${origin || 'an unspecified location'} to: ${destination}.`;
  if (experience) {
    userQuery += ` The user is specifically looking for the following experience: ${experience}. Tailor all recommendations (accommodation, food, guides, and area suggestions) to meet this request.`;
  }

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    tools: [{ "google_search": {} }],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
  };

  const apiUrlWithKey = `${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`;

  try {
    const apiResponse = await fetchWithRetry(apiUrlWithKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await apiResponse.json();
    res.json(result);

  } catch (error) {
    console.error("Backend API Error:", error.message);
    res.status(500).json({ error: 'Internal server error processing request.' });
  }
});

// ❌ Do not call app.listen() on Vercel
// app.listen(port, () => {
//   console.log(`Server running securely at http://localhost:${port}`);
// });

// ✅ Export the app for Vercel
export default app;
