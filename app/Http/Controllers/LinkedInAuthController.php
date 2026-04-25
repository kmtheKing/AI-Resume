<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Laravel\Socialite\Facades\Socialite;

class LinkedInAuthController extends Controller
{
    /**
     * Redirect the user to LinkedIn for authentication.
     * No login required — anyone can use LinkedIn to generate a resume.
     */
    public function redirectToLinkedIn()
    {
        // Store the requested field of work in session so we carry it through OAuth
        if (request()->has('field')) {
            Session::put('linkedin_field', request()->get('field'));
        }

        return Socialite::driver('linkedin-openid')
            ->scopes(['openid', 'profile', 'email'])
            ->redirect();
    }

    /**
     * Handle the LinkedIn OAuth callback.
     * Fetch profile data, call Gemini to generate a resume, store in session, redirect to app.
     */
    public function handleLinkedInCallback()
    {
        try {
            $linkedinUser = Socialite::driver('linkedin-openid')->user();
        } catch (\Exception $e) {
            return redirect()->route('home')->with('error', 'LinkedIn authentication failed. Please try again.');
        }

        // — Gather profile data from OpenID response —
        $profile = [
            'name'      => $linkedinUser->getName()  ?? 'Unknown',
            'email'     => $linkedinUser->getEmail()  ?? '',
            'headline'  => $linkedinUser->user['headline'] ?? null,
            'avatar'    => $linkedinUser->getAvatar() ?? null,
            'token'     => $linkedinUser->token,
        ];

        // — Try to fetch richer profile data from LinkedIn API v2 —
        $positions = $this->fetchLinkedInPositions($linkedinUser->token);

        // — Build profile text for Gemini —
        $field = Session::get('linkedin_field', 'Software Engineering');
        $profileText = $this->buildProfileText($profile, $positions);

        // — Call Gemini to generate resume + analysis —
        $geminiResult = $this->generateResumeFromProfile($profileText, $field);

        if (!$geminiResult) {
            return redirect()->route('home')->with('error', 'AI resume generation failed. Please try again.');
        }

        // — Store result in session so React can read it —
        Session::put('linkedin_resume', [
            'analysis'   => $geminiResult['analysis'],
            'resumeText' => $geminiResult['resumeText'],
            'field'      => $field,
            'profile'    => $profile,
        ]);

        Session::forget('linkedin_field');

        return redirect()->route('home')->with('linkedin_success', true);
    }

    /**
     * API endpoint: React polls this to get the LinkedIn resume result from session.
     */
    public function getLinkedInResult()
    {
        $result = Session::get('linkedin_resume');

        if (!$result) {
            return response()->json(['status' => 'none']);
        }

        Session::forget('linkedin_resume');

        return response()->json([
            'status'     => 'ready',
            'analysis'   => $result['analysis'],
            'resumeText' => $result['resumeText'],
            'field'      => $result['field'],
            'profile'    => $result['profile'],
        ]);
    }

    // ─── Private Helpers ────────────────────────────────────────────────────────

    /**
     * Attempt to fetch positions/work history from LinkedIn API.
     * Returns an array of position strings, or empty array on failure.
     */
    private function fetchLinkedInPositions(string $token): array
    {
        try {
            $response = Http::withOptions(['verify' => false])
                ->withToken($token)
                ->get('https://api.linkedin.com/v2/me', [
                    'projection' => '(id,firstName,lastName,headline,positions,educations)',
                ]);

            if (!$response->successful()) {
                return [];
            }

            $data      = $response->json();
            $positions = [];

            // Extract positions
            $elements = $data['positions']['values'] ?? [];
            foreach ($elements as $pos) {
                $title   = $pos['title'] ?? '';
                $company = $pos['company']['name'] ?? '';
                $start   = $pos['startDate'] ?? null;
                $end     = isset($pos['isCurrent']) && $pos['isCurrent'] ? 'Present' : ($pos['endDate']['year'] ?? '');
                $startY  = $start['year'] ?? '';
                $desc    = $pos['summary'] ?? '';

                if ($title || $company) {
                    $positions[] = trim("{$title} at {$company} ({$startY}–{$end}). {$desc}");
                }
            }

            // Extract educations
            $eduElements = $data['educations']['values'] ?? [];
            foreach ($eduElements as $edu) {
                $school  = $edu['schoolName'] ?? '';
                $degree  = $edu['degree'] ?? '';
                $field   = $edu['fieldOfStudy'] ?? '';
                $endY    = $edu['endDate']['year'] ?? '';
                if ($school) {
                    $positions[] = "EDUCATION: {$degree} {$field} at {$school}" . ($endY ? " ({$endY})" : '');
                }
            }

            return $positions;

        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Build a structured text block from profile data to feed into Gemini.
     */
    private function buildProfileText(array $profile, array $positions): string
    {
        $text  = "Name: {$profile['name']}\n";
        $text .= "Email: {$profile['email']}\n";

        if (!empty($profile['headline'])) {
            $text .= "Professional Headline: {$profile['headline']}\n";
        }

        if (!empty($positions)) {
            $text .= "\nWork & Education History:\n";
            foreach ($positions as $pos) {
                $text .= "• {$pos}\n";
            }
        } else {
            // Fallback: derive from headline
            if (!empty($profile['headline'])) {
                $text .= "\nProfessional Summary (derived from LinkedIn headline): {$profile['headline']}\n";
            }
        }

        return $text;
    }

    /**
     * Send profile text to Gemini and get back a resume + analysis JSON.
     */
    private function generateResumeFromProfile(string $profileText, string $field): ?array
    {
        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) return null;

        $prompt = "You are a world-class Executive Resume Writer and Career Coach.

A candidate has imported their LinkedIn profile. Based ONLY on the following profile data, do two things:

1. Write a complete, professional, ATS-optimized resume for them targeting the field of '{$field}'.
2. Score and analyze that resume.

--- CANDIDATE LINKEDIN PROFILE START ---
{$profileText}
--- CANDIDATE LINKEDIN PROFILE END ---

IMPORTANT INSTRUCTIONS:
- If work history is limited, expand professionally based on their headline and infer likely responsibilities.
- The resume should follow the standard format: Name + Contact Info, Professional Summary, Experience, Education, Skills.
- Use strong action verbs, quantify achievements where possible, and format for a ONE-PAGE professional layout.
- Use '•' for bullets, ALL CAPS for section headers.

Return a valid JSON object EXCLUSIVELY with these keys, no markdown, no extra text:
- 'score' (number 0-100: overall resume quality score)
- 'summary' (string: professional AI summary of the candidate's fit for the field)
- 'strengths' (array of strings)
- 'weaknesses' (array of strings)
- 'suggestions' (array of objects each with 'section', 'improvement', 'reason')
- 'atsCompatibility' (number 0-100)
- 'arrangedText' (string: the complete formatted resume text, ready for the editor)";

        $response = Http::withOptions(['verify' => false])
            ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'contents'        => [['role' => 'user', 'parts' => [['text' => $prompt]]]],
                'generationConfig' => ['response_mime_type' => 'application/json'],
            ]);

        if (!$response->successful()) return null;

        $data = $response->json();
        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
        $text = preg_replace('/```json|```/', '', $text);
        $result = json_decode(trim($text), true);

        if (!$result) return null;

        return [
            'analysis'   => $result,
            'resumeText' => $result['arrangedText'] ?? '',
        ];
    }
}
