<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'description' => 'Get your score. Know where you stand.',
                'price' => 2.00,
                'duration_days' => 365, // effectively one-time/yearly
                'features' => json_encode([
                    'Full AI Resume Analysis',
                    'ATS Compatibility Score',
                    'Section-by-section Breakdown',
                    'Basic Editor Access',
                    '1 Resume Download (Classic Template)',
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'Build more. Stand out more.',
                'price' => 5.00,
                'duration_days' => 365,
                'features' => json_encode([
                    'Everything in Starter',
                    'Create Unlimited Resumes',
                    '3 Premium Templates (Modern, Executive, Creative)',
                    'AI Resume Polishing',
                    'Auto-generated Project Descriptions',
                    'Priority Support',
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Elite',
                'slug' => 'elite',
                'description' => 'Ace the interview. Land the job.',
                'price' => 7.00,
                'duration_days' => 365,
                'features' => json_encode([
                    'Everything in Pro',
                    'Interview Prep Module',
                    'Field-specific Question Bank',
                    'AI Mock Interview Insights',
                    'Salary Negotiation Tips',
                    'Career Coaching AI',
                ]),
                'is_active' => true,
            ],
        ];

        foreach ($packages as $pkg) {
            Package::updateOrCreate(
                ['slug' => $pkg['slug']],
                $pkg
            );
        }
    }
}
