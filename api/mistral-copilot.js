export async function getCopilotResponse(prompt = "Hello from Copilot!") {
  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
  const body = {
    model: "mistral-tiny",
    messages: [{ role: "user", content: prompt }],
  };
  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "No response from Copilot.";
  } catch (error) {
    console.error("❌ Mistral API error:", error);
    return "Error fetching Copilot response.";
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  const reply = await getCopilotResponse(prompt);
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

export const config = {
  api: {
    bodyParser: true,
  },
};
