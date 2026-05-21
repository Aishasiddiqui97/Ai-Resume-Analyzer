export interface AnalysisResult {
  overallScore: number;
  atsScore: number;
  jobReadinessScore: number;
  skills: {
    technical: string[];
    soft: string[];
    missing: string[];
  };
  sections: {
    contact: number;
    summary: number;
    experience: number;
    education: number;
    skills: number;
    formatting: number;
  };
  improvements: {
    category: string;
    suggestion: string;
    priority: "high" | "medium" | "low";
  }[];
  keywords: string[];
  strengths: string[];
  summary: string;
}

export interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  score: number;
  analysis: AnalysisResult;
}
