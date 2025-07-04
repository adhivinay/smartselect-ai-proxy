// api/groq-grok.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const prompt = req.body.prompt || "Hello from Groq Grok!";

  const body = {
    model: "llama3-70b-8192", // ✅ Example: Groq supports Llama 3 fast inference
    messages: [{ role: "user", content: prompt }]
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("🟣 Groq Grok proxy response:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Groq error:", err);
    res.status(500).json({ error: "Groq proxy error", message: err.message });
  }
}
