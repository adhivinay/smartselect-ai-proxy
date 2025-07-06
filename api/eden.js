export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  console.log("EDENAI_API_KEY:", process.env.EDENAI_API_KEY); // TEMP: confirm it's set

  try {
    const edenResponse = await fetch("https://api.edenai.run/v2/text/generation", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.EDENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        providers: "openai",
        text: prompt,
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const text = await edenResponse.text();
    console.log("Eden AI raw response:", text);

    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to connect to Eden AI" });
  }
}
