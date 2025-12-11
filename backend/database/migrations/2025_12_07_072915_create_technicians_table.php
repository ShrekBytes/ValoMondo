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
        Schema::create('technicians', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('specialty')->nullable(); // e.g., "Electrician", "Plumber", "AC Technician"
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('facebook_url')->nullable();
            // Location & Service area
            $table->string('division')->nullable();
            $table->string('district')->nullable();
            $table->string('area')->nullable();
            $table->text('address')->nullable();
            $table->json('service_areas')->nullable(); // Areas where they provide service
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            // Service details
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->decimal('visit_charge', 8, 2)->nullable();
            $table->json('services_offered')->nullable(); // List of services
            $table->integer('years_of_experience')->nullable();
            $table->boolean('available_emergency')->default(false);
            $table->json('working_hours')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('last_info_updated')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'name']);
            $table->index(['division', 'district']);
            $table->index('specialty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technicians');
    }
};
