// togetherai-chatgpt.js

export async function getChatGPTResponse(prompt = "Hello from TogetherAI ChatGPT!") {
  const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

  const body = {
    model: "meta-llama/Llama-3-70b-chat-hf",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1024,
  };

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response from ChatGPT.";
    return reply;
  } catch (err) {
    console.error("TogetherAI error:", err);
    return "Error fetching ChatGPT response.";
  }
}

// Optional: keep original endpoint handler
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const prompt = req.body.prompt || "Hello from TogetherAI ChatGPT!";
  const reply = await getChatGPTResponse(prompt);
  res.status(200).json({ reply });
}


