<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'kamalmoayed@gmail.com'],
            [
                'name'     => 'Moayed',
                'password' => bcrypt('12345678'),
                'is_admin' => true,
            ]
        );
    }
}
