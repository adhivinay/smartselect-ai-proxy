import { getGeminiResponse } from './gemini.js';
import { getGrokResponse } from './groq-grok.js';
import { getCopilotResponse } from './mistral-copilot.js';
import { getChatGPTResponse } from './togetherai-chatgpt.js';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query is required and must be a string." });
  }

  async function safeCall(fn, label) {
    try {
      const result = await fn(query);
      return result || `${label} returned empty response.`;
    } catch (err) {
      console.error(`${label} error:`, err);
      return `${label} failed to respond.`;
    }
  }

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

  const scored = responses.map(r => ({
    ...r,
    score: r.text.length
  }));

  const best = scored.reduce((a, b) => (a.score > b.score ? a : b));

  res.status(200).json({
    query,
    smartselect: {
      source: best.source,
      response: best.text
    },
    allResponses: scored
  });
}

