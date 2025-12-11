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
        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('type')->nullable(); // e.g., "Public", "Private", "National"
            $table->string('accreditation')->nullable(); // e.g., "UGC", "Approved"
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
            // Courses & Fees
            $table->json('courses_offered')->nullable(); // Array of courses
            $table->decimal('undergraduate_fee', 10, 2)->nullable(); // Per semester
            $table->decimal('graduate_fee', 10, 2)->nullable(); // Per semester
            $table->integer('total_students')->nullable();
            $table->integer('total_teachers')->nullable();
            $table->year('established_year')->nullable();
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
        Schema::dropIfExists('universities');
    }
};
