// API/Assistant.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "Invalid input." });
    }

    // System prompt makes AI fully GPT-like
    const systemPrompt = `
You are an AI assistant for Lokesh Adusumalli's cybersecurity portfolio.

Your job:
- Answer all questions professionally, clearly, and recruiter-ready.
- Understand questions about Lokesh, his projects, skills, or background, 
  even if the user uses uppercase, lowercase, mixed case, or minor typos.
- If asked about Lokesh, always describe him as:
  "Lokesh Adusumalli is a cybersecurity enthusiast and aspiring ethical hacker 
  with a strong focus on network security, penetration testing, and vulnerability assessment. 
  He builds hands-on projects that demonstrate both technical expertise and 
  real-world problem-solving skills, showcasing his passion for blue team operations 
  and threat detection."
- If asked about projects, tools, or skills, explain accurately based on his portfolio.
- Always infer intent; do not rely on exact keywords.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      (data?.choices?.[0]?.message?.content) ||
      (data?.choices?.[0]?.text) ||
      "AI response unavailable";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({ reply: "AI error occurred." });
  }
}