<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    // GET /api/courses
    public function index(Request $request)
    {
        $user = $request->user();

        // Pluck ONLY the IDs directly from the pivot table without loading full models
        $enrolledIds = $user ? $user->courses()->pluck('courses.id')->toArray() : [];

        // Retrieve courses without heavy relationships
        $courses = Course::select(['id', 'code', 'title', 'description', 'instructor', 'credits'])
            ->get()
            ->map(function ($course) use ($enrolledIds) {
                $course->is_enrolled = in_array($course->id, $enrolledIds);
                return $course;
            });

        return response()->json($courses, 200);
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

    // POST /api/courses/{id}/enroll (Toggles enrollment on/off)
    public function enroll(Request $request, $id)
    {
        $user = $request->user();
        $course = Course::findOrFail($id);

        // Toggle enrollment: attaches if not enrolled, detaches if already enrolled
        $changes = $user->courses()->toggle($course->id);
        $isEnrolled = count($changes['attached']) > 0;

        return response()->json([
            'message'     => $isEnrolled ? 'Enrolled successfully' : 'Unenrolled successfully',
            'is_enrolled' => $isEnrolled,
        ], 200);
    }
}
