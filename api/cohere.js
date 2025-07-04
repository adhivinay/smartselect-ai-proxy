export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const COHERE_API_KEY = process.env.COHERE_API_KEY; // ✅ Uses Vercel env var!
  const prompt = req.body.prompt || "Hello from Cohere!";

  const body = {
    model: "command-r",
    prompt,
    temperature: 0.7,
    max_tokens: 300
  };

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("🔵 Cohere proxy response:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Cohere error:", err);
    res.status(500).json({ error: "Cohere proxy error", message: err.message });
  }
}