// gemini.js

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
    const reply = data?.choices?.[0]?.message?.content || "No response from Gemini.";
    return reply;
  } catch (err) {
    console.error("Gemini error:", err);
    return "Error fetching Gemini response.";
  }
}
