export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  try {
    const edenResponse = await fetch("https://api.edenai.run/v2/text/generation", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.EDENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        providers: "openai",  // or any provider you want
        text: prompt,
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await edenResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to Eden AI" });
  }
}
