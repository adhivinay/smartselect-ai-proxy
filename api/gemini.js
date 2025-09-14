export async function getGeminiResponse(prompt = "Hello from Gemini!") {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const body = {
    model: "mistralai/mistral-7b-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1024,
  };
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "No response from Gemini.";
  } catch (err) {
    console.error("Gemini error:", err);
    return "Error fetching Gemini response.";
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const prompt = req.body.prompt || "Hello from Gemini!";
  const reply = await getGeminiResponse(prompt);
  res.status(200).json({
    choices: [
      {
        message: {
          content: reply,
        },
      },
    ],
  });
}
