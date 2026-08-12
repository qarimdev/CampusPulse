<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    // GET /api/courses
    public function index()
    {
        return response()->json(Course::all(), 200);
    }

    // POST /api/courses
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'        => 'required|string|unique:courses,code',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructor'  => 'nullable|string|max:255',
            'credits'     => 'required|integer|min:1',
        ]);

        $course = Course::create($validated);

        return response()->json($course, 201);
    }

    // GET /api/courses/{id}
    public function show(Course $course)
    {
        return response()->json($course, 200);
    }

    // PUT /api/courses/{id}
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'code'        => 'required|string|unique:courses,code,' . $course->id,
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructor'  => 'nullable|string|max:255',
            'credits'     => 'required|integer|min:1',
        ]);

        $course->update($validated);

        return response()->json($course, 200);
    }

    // DELETE /api/courses/{id}
    public function destroy(Course $course)
    {
        $course->delete();

        return response()->json(['message' => 'Course deleted successfully'], 200);
    }
}
