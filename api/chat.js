
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Faqat POST so'rovi mumkin"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Xabar yuborilmadi"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions: "You are My Personal AI, a helpful assistant. Respond in Uzbek when the user writes in Uzbek.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "AI javob bera olmadi"
      });
    }

    const answer = data.output
      ?.flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n") || "Javob topilmadi";

    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(500).json({
      error: "Serverda xatolik yuz berdi"
    });
  }
}
