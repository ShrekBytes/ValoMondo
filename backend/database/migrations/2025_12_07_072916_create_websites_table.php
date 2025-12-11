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
        Schema::create('websites', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('url')->unique();
            $table->string('category')->nullable(); // e.g., "E-commerce", "News", "Education", "Government"
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('instagram_url')->nullable();
            // Website details
            $table->boolean('is_bangladeshi')->default(true);
            $table->boolean('has_mobile_app')->default(false);
            $table->string('app_android_url')->nullable();
            $table->string('app_ios_url')->nullable();
            $table->json('languages_supported')->nullable(); // Bengali, English, etc.
            $table->json('payment_methods')->nullable(); // bKash, Nagad, Card, etc.
            $table->boolean('has_customer_support')->default(false);
            $table->string('support_phone')->nullable();
            $table->string('support_email')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('last_info_updated')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'name']);
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('websites');
    }
};
