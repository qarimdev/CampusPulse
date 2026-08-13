<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        Announcement::create([
            'title'        => 'Mid-Term Examination Schedule Released',
            'content'      => 'The schedule for the upcoming mid-term examinations is now available on the student portal. Please check your timetable.',
            'category'     => 'Academic',
            'is_important' => true,
        ]);

        Announcement::create([
            'title'        => 'Campus Sports Day Registration Open',
            'content'      => 'Sign up for the annual football and track tournaments! Registration closes end of this week.',
            'category'     => 'Event',
            'is_important' => false,
        ]);

        Announcement::create([
            'title'        => 'Library Maintenance Notice',
            'content'      => 'The central library digital hub will undergo routine maintenance this Saturday from 10 PM to 2 AM.',
            'category'     => 'General',
            'is_important' => false,
        ]);
    }
}
