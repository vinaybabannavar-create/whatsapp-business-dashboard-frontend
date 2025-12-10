export const runtime = "nodejs";

import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  console.log("🔥 AI ROUTE HIT");

  try {
    const body = await req.json();
    const { industry, tone, details, mode } = body;

    if (!mode) {
      return Response.json(
        { success: false, error: "Mode is required" },
        { status: 400 }
      );
    }

    let prompt = "";

    // ------------------------------
    // SINGLE TEMPLATE
    // ------------------------------
    if (mode === "single") {
      prompt = `
Generate a WhatsApp Business template.

Industry: ${industry}
Tone: ${tone}
Details: ${details}

Rules:
- Short lines (2–4 total)
- Emojis where suitable
- Include variables like {{name}}, {{date}}, {{offer}}
- Output ONLY the final message.
`;
    }

    // ------------------------------
    // MULTI TEMPLATE (3 variants)
    // ------------------------------
    if (mode === "multi") {
      prompt = `
Generate 3 different WhatsApp Business templates.

Industry: ${industry}
Tone: ${tone}
Details: ${details}

Rules:
- Short lines
- Emojis
- Variables like {{name}}, {{discount}}, {{date}}
- Separate each version using ***BREAK***
- Output ONLY messages.
`;
    }

    // ------------------------------
    // REWRITE MODE
    // ------------------------------
    if (mode === "rewrite") {
      prompt = `
Rewrite this WhatsApp message:

"${details}"

Rules:
- Improve clarity
- Add variables like {{name}} if suitable
- Use short WhatsApp-friendly lines
- Output ONLY the rewritten message.
`;
    }

    // ------------------------------
    // AI REQUEST
    // ------------------------------
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.6,
      messages: [{ role: "user", content: prompt }],
    });

    const output = completion.choices?.[0]?.message?.content?.trim() || "";

    // ------------------------------
    // MULTI RESPONSE SPLIT
    // ------------------------------
    if (mode === "multi") {
      let variants = output.split("***BREAK***").map((s) => s.trim());

      if (variants.length < 2) {
        variants = [
          output,
          "Alternative version not generated.",
          "Try again with more details.",
        ];
      }

      return Response.json({ success: true, output: variants });
    }

    return Response.json({ success: true, output });
  } catch (err) {
    console.error("❌ AI ERROR:", err);
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
