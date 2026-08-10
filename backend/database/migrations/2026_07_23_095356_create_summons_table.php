<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('summons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('summon_code')->unique();
            $table->string('violation_type');
            $table->decimal('amount', 8, 2);
            $table->dateTime('due_date');
            $table->enum('status', ['unpaid', 'paid', 'appealed', 'waived'])->default('unpaid');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('summons');
    }
};
