// groq-grok.js

export async function getGrokResponse(prompt = "Hello from Grok (Groq)!") {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  const body = {
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: prompt }],
};

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response from Grok.";
    return reply;
  } catch (err) {
    console.error("Grok error:", err);
    return "Error fetching Grok response.";
  }
}

// Optional: keep original endpoint handler
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const prompt = req.body.prompt || "Hello from Grok (Groq)!";
  const reply = await getGrokResponse(prompt);
  res.status(200).json({ reply });
}



