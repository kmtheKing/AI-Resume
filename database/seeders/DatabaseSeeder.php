<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $fields = [
            ['name' => 'Software Engineering', 'description' => 'Focuses on programming languages, frameworks, system architecture, and software development lifecycles.'],
            ['name' => 'Data Science', 'description' => 'Focuses on data analysis, machine learning models, statistics, and data visualization.'],
            ['name' => 'Design', 'description' => 'Focuses on UI/UX, graphic design principles, user research, and wireframing methodologies.'],
            ['name' => 'Marketing', 'description' => 'Focuses on SEO, content strategy, campaign management, conversion metrics, and brand development.'],
            ['name' => 'Finance', 'description' => 'Focuses on financial modeling, accounting standards, risk assessment, and quantitative analysis.']
        ];

        foreach ($fields as $field) {
            \App\Models\FieldOfWork::create($field);
        }
    }
}
