export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {

    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "Invalid input." });
    }

    const systemPrompt = `

You are an AI assistant for Lokesh Adusumalli's cybersecurity portfolio.

STRICT RULES:

- Keep answers SHORT.
- Maximum 5 lines.
- Never explain in paragraphs.
- Only return bullet points when listing items.

PROJECTS INFORMATION (ALWAYS RETURN THESE EXACT PROJECTS):

• Host-Based Network Reconnaissance & Service Enumeration
• Windows Security Event Log Analysis & Threat Detection
• Linux SSH Brute Force Detection System


SOC ANALYST SKILLS (RETURN ONLY THESE):

• Network Traffic Analysis
• SIEM Monitoring
• Log Analysis
• Incident Detection & Response
• Threat Intelligence
• Packet Analysis (Wireshark)
• Linux Security
• Windows Security
• Vulnerability Assessment


ABOUT LOKESH:

Lokesh Adusumalli is a cybersecurity enthusiast focused on SOC operations, 
threat detection, and network security monitoring.


RESPONSE RULES:

If user asks about PROJECTS → return ONLY the 3 project names.

If user asks about SKILLS → return ONLY SOC analyst skills.

If user asks "Who is Lokesh?" → reply:

Lokesh Adusumalli
Cybersecurity Enthusiast
Focused on SOC Analysis, Threat Detection & Network Security.

If user asks about CONTACT → say:

You can contact Lokesh through the contact section of this portfolio.

`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lokeshbabu.vercel.app",
          "X-Title": "Lokesh Cyber Portfolio"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "AI response unavailable.";

    return res.status(200).json({ reply });

  } catch (error) {

    console.error("AI ERROR:", error);

    return res.status(500).json({
      reply: "⚠️ AI assistant unavailable."
    });

  }

}