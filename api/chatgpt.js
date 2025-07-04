// api/togetherai-chatgpt.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
  const prompt = req.body.prompt || "Hello from TogetherAI ChatGPT!";

  const body = {
    model: "meta-llama/Llama-3-70b-chat-hf", // ✅ Example: TogetherAI popular open model
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1024
  };

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOGETHER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("🟢 TogetherAI ChatGPT proxy response:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ TogetherAI error:", err);
    res.status(500).json({ error: "TogetherAI proxy error", message: err.message });
  }
}