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
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->integer('star_rating')->nullable(); // 1-5 stars
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('facebook_url')->nullable();
            // Location fields
            $table->string('division')->nullable();
            $table->string('district')->nullable();
            $table->string('area')->nullable();
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            // Amenities & Pricing
            $table->json('amenities')->nullable(); // WiFi, Pool, Gym, etc.
            $table->decimal('price_range_min', 10, 2)->nullable(); // Minimum room rate
            $table->decimal('price_range_max', 10, 2)->nullable(); // Maximum room rate
            $table->integer('total_rooms')->nullable();
            $table->boolean('has_restaurant')->default(false);
            $table->boolean('has_parking')->default(false);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('last_info_updated')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'name']);
            $table->index(['division', 'district']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
