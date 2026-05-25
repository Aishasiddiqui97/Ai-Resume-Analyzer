import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Demo mode - returns sample data for testing (when quota exceeded)
const DEMO_RESPONSE = {
  overallScore: 78,
  atsScore: 82,
  jobReadinessScore: 75,
  skills: {
    technical: ["JavaScript", "React", "Node.js", "TypeScript", "MongoDB"],
    soft: ["Leadership", "Communication", "Problem Solving", "Team Collaboration"],
    missing: ["Python", "AWS", "Docker", "Kubernetes", "Machine Learning", "CI/CD", "GraphQL"],
  },
  sections: {
    contact: 90,
    summary: 70,
    experience: 75,
    education: 85,
    skills: 80,
    formatting: 88,
  },
  improvements: [
    {
      category: "Summary",
      suggestion: "Add quantifiable achievements (e.g., '20% performance improvement')",
      priority: "high",
    },
    { category: "Skills", suggestion: "Include cloud technologies like AWS or Azure", priority: "high" },
    { category: "Experience", suggestion: "Use action verbs and metrics in bullet points", priority: "medium" },
    { category: "Keywords", suggestion: "Add industry-specific keywords from job postings", priority: "medium" },
  ],
  keywords: ["Full Stack Developer", "Agile", "REST API", "Responsive Design", "Git", "Testing", "Debugging"],
  strengths: [
    "Clear work experience timeline",
    "Good technical skills listed",
    "Professional formatting",
    "Educational background is relevant",
  ],
  summary:
    "Your resume has a solid foundation with good technical skills and formatting. Focus on adding quantifiable achievements and industry keywords to boost ATS compatibility and stand out to recruiters.",
};

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text too short or empty." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const analysis = JSON.parse(cleaned);

    return NextResponse.json({ analysis });
  } catch (err: unknown) {
    console.error("Analysis error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
