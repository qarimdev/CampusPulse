<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    // GET /api/announcements
    public function index()
    {
        // Fetch latest announcements first
        $announcements = Announcement::orderBy('created_at', 'desc')->get();
        return response()->json($announcements, 200);
    }

    // POST /api/announcements
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required|string',
            'category'     => 'required|string|max:100',
            'is_important' => 'boolean',
        ]);

        $announcement = Announcement::create($validated);

        return response()->json($announcement, 201);
    }

    // GET /api/announcements/{id}
    public function show(Announcement $announcement)
    {
        return response()->json($announcement, 200);
    }

    // DELETE /api/announcements/{id}
    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted successfully'], 200);
    }
}
