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
        Schema::table('shops', function (Blueprint $table) {
            $table->json('branches')->nullable()->after('type'); // Array of branch locations
            $table->string('shop_type')->nullable()->after('branches'); // e.g., "Retail", "Wholesale", "Online", "Hybrid"
            $table->json('payment_types')->nullable()->after('shop_type'); // Array of payment methods accepted
            $table->boolean('does_delivery')->default(false)->after('payment_types');
            $table->text('famous_for')->nullable()->after('does_delivery'); // What the shop is famous for
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn([
                'branches',
                'shop_type',
                'payment_types',
                'does_delivery',
                'famous_for',
            ]);
        });
    }
};
