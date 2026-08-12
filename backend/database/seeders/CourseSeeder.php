<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        Course::create([
            'code' => 'CS101',
            'title' => 'Introduction to Computer Science',
            'description' => 'Fundamental concepts of programming, algorithms, and data structures.',
            'instructor' => 'Dr. Smith',
            'credits' => 3,
        ]);

        Course::create([
            'code' => 'WEB202',
            'title' => 'Web Application Development',
            'description' => 'Full-stack modern web development with Angular and Laravel.',
            'instructor' => 'Prof. Johnson',
            'credits' => 4,
        ]);

        Course::create([
            'code' => 'DB301',
            'title' => 'Database Management Systems',
            'description' => 'Relational database design, SQL queries, and normalization.',
            'instructor' => 'Dr. Alan',
            'credits' => 3,
        ]);
    }
}
