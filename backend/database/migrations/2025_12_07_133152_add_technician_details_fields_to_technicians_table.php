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
        Schema::table('technicians', function (Blueprint $table) {
            $table->string('technician_type')->nullable()->after('specialty'); // e.g., "Plumber", "Programmer", "Video Editor"
            $table->json('specialized_fields')->nullable()->after('technician_type'); // Array of specialized areas
            $table->string('portfolio_link')->nullable()->after('specialized_fields'); // URL to portfolio
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('technicians', function (Blueprint $table) {
            $table->dropColumn([
                'technician_type',
                'specialized_fields',
                'portfolio_link',
            ]);
        });
    }
};
