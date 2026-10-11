
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body ?? {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ reply: "Please enter a message." });
    }

    const msg = message.toLowerCase();

    if (msg.includes("project")) {
      return res.status(200).json({
        reply: `• Host-Based Network Reconnaissance & Service Enumeration
• Windows Security Event Log Analysis & Threat Detection
• Linux SSH Brute Force Detection System`
      });
    }

    if (msg.includes("skill") || msg.includes("technology")) {
      return res.status(200).json({
        reply: `• Network Traffic Analysis
• SIEM Monitoring
• Log Analysis
• Incident Detection & Response
• Threat Intelligence
• Wireshark
• Linux & Windows Security
• Vulnerability Assessment`
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is missing.");
      return res.status(500).json({
        reply: "AI configuration is missing. Please try again later."
      });
    }

    const systemPrompt = `You are the AI assistant for Lokesh Adusumalli's cybersecurity portfolio.
Keep answers short, with a maximum of 5 lines.
Lokesh is a cybersecurity enthusiast focused on SOC operations,
threat detection, and network security monitoring.
If asked who Lokesh is, describe him as a Cybersecurity Enthusiast
focused on SOC Analysis, Threat Detection, and Network Security.
For contact questions, direct visitors to the portfolio contact section.
Only state facts provided here; do not invent qualifications or experience.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lokeshbabu.vercel.app",
          "X-Title": "Lokesh Cyber Portfolio"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message.trim() }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", response.status, data);
      return res.status(502).json({
        reply: "The AI service returned an error. Please try again shortly."
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      console.error("OpenRouter returned no usable reply:", data);
      return res.status(502).json({
        reply: "The AI service returned an empty response. Please try again."
      });
    }

    return res.status(200).json({ reply: reply.trim() });
  } catch (error) {
    console.error("AI handler error:", error);
    return res.status(500).json({
      reply: "The AI assistant is temporarily unavailable."
    });
  }
}
