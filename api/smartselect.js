// smartselect.js

import getGeminiResponse from './gemini.js';
import getGrokResponse from './groq-grok.js';
import getCopilotResponse from './mistral-copilot.js';
import getChatGPTResponse from './togetherai-chatgpt.js';

export default async function handler(req, res) {
  const { query } = req.body;

  // Collect responses from all 4 bots
  const [gemini, grok, copilot, chatgpt] = await Promise.all([
    getGeminiResponse(query),
    getGrokResponse(query),
    getCopilotResponse(query),
    getChatGPTResponse(query)
  ]);

  const responses = [
    { source: 'Gemini', text: gemini },
    { source: 'Grok', text: grok },
    { source: 'Copilot', text: copilot },
    { source: 'ChatGPT', text: chatgpt }
  ];

  // Simple scoring logic (can be upgraded later)
  const scored = responses.map(r => ({
    ...r,
    score: r.text.length // Example: score by length
  }));

  // Pick the highest scoring response
  const best = scored.reduce((a, b) => (a.score > b.score ? a : b));

  // Return SmartSelect's synthesized response
  res.status(200).json({
    smartselect: `SmartSelect synthesized: ${best.text}`,
    sources: scored
  });
}
