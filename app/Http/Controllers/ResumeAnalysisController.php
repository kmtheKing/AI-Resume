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
            'file_path' => $path,
            'field_of_work_id' => $fieldRecord->id,
            'status' => 'analyzing',
        ]);

        $apiKey = env('GEMINI_API_KEY');
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
        $prompt = "You are an expert AI Resume Analyzer and Career Coach. 
Analyze the following candidate RESUME TEXT against the requirements and standards for the field of '{$request->field}'.
Field standards/requirements: {$fieldRecord->description}. 

--- CANDIDATE RESUME START ---
{$parsedText}
--- CANDIDATE RESUME END ---

Please return a valid JSON object EXCLUSIVELY with the following keys, no markdown, no other text:
- 'score' (number between 0-100 indicating general fit)
- 'summary' (string: a professional summary of their fit)
- 'strengths' (array of strings)
- 'weaknesses' (array of strings)
- 'suggestions' (array of objects, each with 'section', 'improvement', and 'reason' string properties)
- 'atsCompatibility' (number between 0-100 indicating ATS parser friendliness).";
        
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
            ]);

            return response()->json([
                'message' => 'Analysis completed successfully.',
                'analysis' => $analysis,
                'parsedText' => $parsedText // Crucial for the interactive AI editor
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

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'Gemini API Key missing.'], 500);
        }

        $prompt = "Improve the following resume section based on professional standards and the provided context. 
Make it more impactful, use action verbs, and quantify achievements where possible. Return ONLY the improved text, no intro, no surrounding quotes.

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
