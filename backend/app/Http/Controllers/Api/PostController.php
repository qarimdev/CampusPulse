<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('comments')->latest()->get();
        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
        ]);

        $post = Post::create([
            'author_name' => 'You',
            'author_role' => 'Software Engineering',
            'category' => $validated['category'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'likes' => 0,
        ]);

        return response()->json($post->load('comments'), 201);
    }

    /**
     * @param int|string $id
     */
    public function toggleLike($id)
    {
        $post = Post::findOrFail($id);
        $post->increment('likes');

        return response()->json(['likes' => $post->likes]);
    }

    /**
     * @param Request $request
     * @param int|string $postId
     */
    public function storeComment(Request $request, $postId)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'post_id' => $postId,
            'author_name' => 'You',
            'author_role' => 'Software Engineering',
            'content' => $validated['content'],
        ]);

        return response()->json($comment, 201);
    }
}
