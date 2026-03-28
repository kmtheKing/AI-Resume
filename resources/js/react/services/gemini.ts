export interface ResumeAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: {
    section: string;
    improvement: string;
    reason: string;
  }[];
  atsCompatibility: number;
}

export async function analyzeResume(file: File, field: string): Promise<any> {
  const AppConfig = (window as any).AppConfig;
  
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('field', field);

  const response = await fetch(AppConfig.routes.analyze, {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': AppConfig.csrfToken,
      'Accept': 'application/json'
    },
    body: formData
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to analyze resume");
  }

  // Ensure returning full payload: { result: ResumeAnalysis, parsedText: string }
  return {
    result: data.analysis.result,
    parsedText: data.parsedText || ""
  };
}

export async function improveResumeSection(sectionText: string, context: string): Promise<string> {
  const AppConfig = (window as any).AppConfig;

  const response = await fetch(AppConfig.routes.improve, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': AppConfig.csrfToken,
      'Accept': 'application/json'
    },
    body: JSON.stringify({ sectionText, context })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to improve text");
  }

  return data.improvedText;
}
