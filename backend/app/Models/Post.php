<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_name',
        'author_role',
        'category',
        'title',
        'content',
        'likes',
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class)->latest();
    }
}
