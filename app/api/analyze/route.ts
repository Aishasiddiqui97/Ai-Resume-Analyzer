import { NextRequest, NextResponse } from "next/server";

const MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "openai/gpt-oss-20b:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

async function callOpenRouter(prompt: string, model: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text too short or empty." }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY is not configured on the server." }, { status: 500 });
    }

    const prompt = `You are an expert resume analyst and career coach. Analyze the following resume text and return a JSON response ONLY (no markdown, no explanation, just raw JSON).

Resume Text:
"""
${resumeText.slice(0, 8000)}
"""

Return this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "jobReadinessScore": <number 0-100>,
  "skills": {
    "technical": [<list of technical skills found>],
    "soft": [<list of soft skills found>],
    "missing": [<list of 5-8 important missing skills for modern jobs>]
  },
  "sections": {
    "contact": <score 0-100>,
    "summary": <score 0-100>,
    "experience": <score 0-100>,
    "education": <score 0-100>,
    "skills": <score 0-100>,
    "formatting": <score 0-100>
  },
  "improvements": [
    { "category": "<category>", "suggestion": "<actionable suggestion>", "priority": "<high|medium|low>" }
  ],
  "keywords": [<list of 8-10 important keywords to add>],
  "strengths": [<list of 3-5 resume strengths>],
  "summary": "<2-3 sentence overall assessment>"
}`;

    let lastError = "";
    for (const model of MODELS) {
      try {
        console.log(`Trying model: ${model}`);
        const text = await callOpenRouter(prompt, model);
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const analysis = JSON.parse(cleaned);
        return NextResponse.json({ analysis });
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        console.warn(`Model ${model} failed: ${lastError}`);
        continue;
      }
    }

    return NextResponse.json({ error: `All models failed. Last error: ${lastError}` }, { status: 500 });
  } catch (err: unknown) {
    console.error("Analysis error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
