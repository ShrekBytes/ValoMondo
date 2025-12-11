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
        Schema::create('tourist_spots', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('type')->nullable(); // e.g., "Beach", "Historical", "Park", "Museum"
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            // Location fields
            $table->string('division')->nullable();
            $table->string('district')->nullable();
            $table->string('area')->nullable();
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            // Entry & Timing
            $table->decimal('entry_fee', 8, 2)->nullable();
            $table->json('opening_hours')->nullable();
            $table->string('best_visit_time')->nullable(); // e.g., "November-February"
            $table->json('activities')->nullable(); // Array of activities available
            $table->boolean('has_parking')->default(false);
            $table->boolean('has_restaurant')->default(false);
            $table->boolean('family_friendly')->default(true);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('last_info_updated')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'name']);
            $table->index(['division', 'district']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tourist_spots');
    }
};
