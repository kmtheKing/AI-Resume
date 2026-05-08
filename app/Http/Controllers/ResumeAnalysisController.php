<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FieldOfWork;
use App\Models\ResumeAnalysis;
use Illuminate\Support\Facades\Http;
use Smalot\PdfParser\Parser;

class ResumeAnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx,txt|max:10240',
            'field' => 'required|string',
        ]);

        $file = $request->file('resume');
        $fieldRecord = FieldOfWork::where('name', $request->field)->firstOrFail();
        
        $path = $file->store('resumes', 'public');

        $analysis = ResumeAnalysis::create([
            'user_id' => auth()->id(),
            'file_path' => $path,
            'field_of_work_id' => $fieldRecord->id,
            'status' => 'analyzing',
        ]);

        $apiKey = config('services.gemini.key');
        if (!$apiKey) {
            return response()->json(['error' => 'Gemini API Key missing. Please check .env'], 500);
        }
        
        // Extract native text
        $parsedText = "No text could be extracted.";
        if ($file->getClientOriginalExtension() === 'pdf' || $file->extension() === 'pdf') {
            try {
                $parser = new Parser();
                $pdf = $parser->parseFile($file->getPathname());
                $parsedText = $pdf->getText();
                $parsedText = substr($parsedText, 0, 20000);
            } catch (\Exception $e) {
                $parsedText = "Error extracting PDF text: " . $e->getMessage();
            }
        } else if ($file->getClientOriginalExtension() === 'txt' || $file->extension() === 'txt') {
            $parsedText = file_get_contents($file->getPathname());
            $parsedText = substr($parsedText, 0, 20000);
        }

        // Deep prompt mapping exactly to React ResumeAnalysis Interface
        $prompt = "You are the Senior CV Architect & Active Intelligence Editor specializing in high-growth sectors. Function as a 'Live Intelligence Layer' for a resume builder. 
Analyze the candidate RESUME TEXT against the requirements and standards for their target field of '{$request->field}'.
Field standards/requirements: {$fieldRecord->description}.

TASK REQUIREMENTS:
1. Contextual Intelligence: Generate a Strategy Report identifying critical experience gaps (Key Suggestions) and structural/linguistic fixes (Writing Tips).
2. The 'Uniqueness' Rule: Within your tips, provide at least one contrarian or highly specific piece of advice that goes beyond standard generic resume tips.
3. Adaptive AI Summary: Rewrite the candidate's professional summary. You MUST wrap any significantly improved, high-impact keywords, or newly added professional phrasing in <mark> tags (e.g., <mark>Led a team of 5</mark>) so the user can visually see exactly what you enhanced from their original text.
4. Precision Over Length: Ensure tips and summaries are impactful, concise, and tailored to a professional ONE-PAGE format.

--- CANDIDATE RESUME START ---
{$parsedText}
--- CANDIDATE RESUME END ---

Please return a valid JSON object EXCLUSIVELY with the following keys. Do not include markdown formatting like ```json or any conversational text:
{
  \"score\": [number between 0-100 indicating general fit],
  \"summary\": \"[string: a 3-sentence high-impact summary with <mark> tags around your edits]\",
  \"strengths\": [\"[string]\", \"[string]\"],
  \"weaknesses\": [\"[string]\", \"[string]\"],
  \"writing_tips\": [\"[string: focus on structural/linguistic fixes like replacing passive voice with action verbs]\"],
  \"key_suggestions\": [\"[string: strategic advice on content gaps, missing skills, and industry requirements]\"],
  \"suggestions\": [
    {
      \"section\": \"[string]\",
      \"improvement\": \"[string]\",
      \"reason\": \"[string]\"
    }
  ],
  \"atsCompatibility\": [number between 0-100 indicating ATS parser friendliness],
  \"arrangedText\": \"[string: The candidate's resume text COMPLETELY REWRITTEN AND TAILORED for the target field. Optimize the Professional Summary and rewrite Experience bullet points. Use standard symbols like '•' for bullets and distinct section headers in ALL CAPS.]\"
}";
        
        $response = Http::withOptions(['verify' => false])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
            'contents' => [['role' => 'user', 'parts' => [['text' => $prompt]]]],
            'generationConfig' => ['response_mime_type' => 'application/json'],
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
            
            $text = preg_replace('/```json|```/', '', $text);
            $resultInfo = json_decode(trim($text), true);

            $analysis->update([
                'status' => 'completed',
                'result' => $resultInfo,
                'tokens_used' => (int) ((strlen($prompt) + strlen($text)) / 4), // Rough estimate: 1 token ≈ 4 chars
            ]);

            $arrangedText = $resultInfo['arrangedText'] ?? $parsedText;

            return response()->json([
                'message' => 'Analysis completed successfully.',
                'analysis' => $analysis,
                'parsedText' => $arrangedText // Neatly formatted text
            ]);
        }

        $analysis->update(['status' => 'failed']);
        
        $statusCode = $response->status();
        if ($statusCode === 429) {
            return response()->json(['error' => 'Rate limit reached. The API tier allows limited requests per minute. Please wait 30-60 seconds and try again.'], 429);
        }
        
        return response()->json(['error' => 'AI analysis failed (HTTP ' . $statusCode . '). Please try again shortly.'], 500);
    }

    public function improveSection(Request $request) 
    {
        $request->validate([
            'sectionText' => 'required|string',
            'context' => 'required|string',
        ]);

        $apiKey = config('services.gemini.key');
        if (!$apiKey) {
            return response()->json(['error' => 'Gemini API Key missing.'], 500);
        }

        $prompt = "You are a world-class Executive Resume Writer. Improve the following resume section. 
STRICT REQUIREMENTS:
1. Use strong ACTION VERBS (e.g., 'Spearheaded', 'Optimized', 'Engineered').
2. QUANTIFY achievements with numbers, percentages, or data (e.g., 'Increased efficiency by 25%', 'Managed $50k budget').
3. Keep it CONCISE and impactful to fit a ONE-PAGE professional format.
4. Use professional, industry-standard terminology.
5. Return ONLY the improved text, no introduction, no quotes.

Context/Goal:
{$request->context}

Section to improve:
{$request->sectionText}";

        $response = Http::withOptions(['verify' => false])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
            'contents' => [['role' => 'user', 'parts' => [['text' => $prompt]]]]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $improvedText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
            return response()->json(['improvedText' => trim($improvedText)]);
        }

        return response()->json(['error' => 'Failed to improve text'], 500);
    }
}
