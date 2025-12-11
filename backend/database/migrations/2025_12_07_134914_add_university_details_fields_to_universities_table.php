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
        Schema::table('universities', function (Blueprint $table) {
            // Rename phone to help_desk_phone
            $table->renameColumn('phone', 'help_desk_phone');
            
            // Add new fields
            $table->string('admission_office_phone')->nullable()->after('help_desk_phone');
            $table->json('famous_for_courses')->nullable()->after('courses_offered'); // Array of courses the university is famous for
            $table->string('university_grade')->nullable()->after('famous_for_courses'); // e.g., "A+", "A", "B+"
            $table->string('organization')->nullable()->after('university_grade'); // University organization/affiliation
            $table->integer('total_faculty')->nullable()->after('total_teachers'); // Total faculty members
            $table->string('vice_chancellor')->nullable()->after('total_faculty'); // Vice Chancellor/CEO name
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('universities', function (Blueprint $table) {
            $table->renameColumn('help_desk_phone', 'phone');
            $table->dropColumn([
                'admission_office_phone',
                'famous_for_courses',
                'university_grade',
                'organization',
                'total_faculty',
                'vice_chancellor',
            ]);
        });
    }
};
