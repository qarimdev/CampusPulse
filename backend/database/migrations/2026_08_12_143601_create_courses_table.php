<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();         // e.g., "CS101"
            $table->string('title');                  // e.g., "Introduction to Computer Science"
            $table->text('description')->nullable();
            $table->string('instructor')->nullable(); // e.g., "Dr. Smith"
            $table->integer('credits')->default(3);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
