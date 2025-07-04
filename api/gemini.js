// api/gemini.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const OPENROUTER_API_KEY = "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";
  const prompt = req.body.prompt || "Hello from Gemini via OpenRouter!";

  const body = {
    model: "mistralai/mistral-7b-instruct", // ✅ Or "google/gemini-pro" if available
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1024
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("🔵 Gemini proxy response:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Gemini error:", err);
    res.status(500).json({ error: "Gemini proxy error", message: err.message });
  }
}