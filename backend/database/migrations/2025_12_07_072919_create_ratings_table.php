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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // Null for moderator rating
            $table->morphs('ratable'); // Polymorphic relation to any category
            $table->tinyInteger('rating'); // 1-5
            $table->boolean('is_moderator_rating')->default(false);
            $table->timestamps();
            
            // Unique constraint: one user rating per item, one moderator rating per item
            $table->unique(['user_id', 'ratable_type', 'ratable_id'], 'unique_user_rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
