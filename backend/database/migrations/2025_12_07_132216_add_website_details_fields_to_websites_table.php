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
        Schema::table('websites', function (Blueprint $table) {
            $table->string('website_type')->nullable()->after('category'); // e.g., "E-commerce", "News", "Education"
            $table->boolean('has_physical_store')->default(false)->after('has_mobile_app');
            $table->json('other_domains')->nullable()->after('url');
            
            // Physical location fields
            $table->string('division')->nullable()->after('has_physical_store');
            $table->string('district')->nullable()->after('division');
            $table->string('area')->nullable()->after('district');
            $table->text('address')->nullable()->after('area');
            $table->decimal('latitude', 10, 8)->nullable()->after('address');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            
            // Office and organization details
            $table->string('office_time')->nullable()->after('longitude'); // e.g., "9 AM - 6 PM, Sat-Thu"
            $table->string('organization')->nullable()->after('office_time');
            $table->integer('total_employees')->nullable()->after('organization');
            $table->decimal('delivery_rate', 10, 2)->nullable()->after('total_employees');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('websites', function (Blueprint $table) {
            $table->dropColumn([
                'website_type',
                'has_physical_store',
                'other_domains',
                'division',
                'district',
                'area',
                'address',
                'latitude',
                'longitude',
                'office_time',
                'organization',
                'total_employees',
                'delivery_rate',
            ]);
        });
    }
};
