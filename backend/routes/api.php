<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\Api\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Require Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('courses', CourseController::class);
    Route::apiResource('announcements', AnnouncementController::class);
    Route::post('/courses/{id}/enroll', [CourseController::class, 'enroll']);

    // Community Discussion Routes
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::post('/posts/{id}/like', [PostController::class, 'toggleLike']);
    Route::post('/posts/{id}/comments', [PostController::class, 'storeComment']);
});
