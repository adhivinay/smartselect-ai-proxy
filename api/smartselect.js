import { getGeminiResponse } from './gemini.js';
import { getGrokResponse } from './groq-grok.js';
import { getCopilotResponse } from './mistral-copilot.js';
import { getChatGPTResponse } from './togetherai-chatgpt.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { query } = req.body;

  // Validate input
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query is required and must be a string." });
  }

  // Safe wrapper for bot calls
  async function safeCall(fn, label) {
    try {
      const result = await fn(query);
      return result || `${label} returned empty response.`;
    } catch (err) {
      console.error(`${label} error:`, err);
      return `${label} failed to respond.`;
    }
  }

  // Collect responses from all 4 bots
  const [gemini, grok, copilot, chatgpt] = await Promise.all([
    safeCall(getGeminiResponse, "Gemini"),
    safeCall(getGrokResponse, "Grok"),
    safeCall(getCopilotResponse, "Copilot"),
    safeCall(getChatGPTResponse, "ChatGPT")
  ]);

  const responses = [
    { source: 'Gemini', text: gemini },
    { source: 'Grok', text: grok },
    { source: 'Copilot', text: copilot },
    { source: 'ChatGPT', text: chatgpt }
  ];

  // Simple scoring logic (based on length)
  const scored = responses.map(r => ({
    ...r,
    score: r.text.length
  }));

  // Pick the highest scoring response
  const best = scored.reduce((a, b) => (a.score > b.score ? a : b));

  // Return SmartSelect's synthesized response
  res.status(200).json({
    query,
    smartselect: {
      source: best.source,
      response: best.text
    },
    allResponses: scored
  });
}

