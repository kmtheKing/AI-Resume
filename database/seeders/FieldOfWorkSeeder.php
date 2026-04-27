<?php

namespace Database\Seeders;

use App\Models\FieldOfWork;
use Illuminate\Database\Seeder;

class FieldOfWorkSeeder extends Seeder
{
    public function run(): void
    {
        FieldOfWork::updateOrCreate(
            ['name' => 'English Literature'],
            [
                'category' => 'Arts & Humanities',
                'description' => 'Academic and professional field focused on literature written in English, including critical analysis, writing, and teaching.',
            ]
        );
    }
}
