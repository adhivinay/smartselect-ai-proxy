export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;

  // ✅ Add this to handle raw string bodies
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  console.log("req.body:", body);

  const { prompt } = body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await mistralResponse.json();
    console.log("Mistral API raw response:", data);

    res.status(200).json(data);
  } catch (error) {
    console.error("Mistral API error:", error);
    res.status(500).json({ error: "Failed to connect to Mistral API" });
  }
}

// ✅ Keep the bodyParser config
export const config = {
  api: {
    bodyParser: true,
  },
};
