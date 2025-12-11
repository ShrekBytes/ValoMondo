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
        Schema::create('product_shop', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->decimal('price_at_shop', 10, 2)->nullable(); // Price at specific shop
            $table->boolean('is_available')->default(true);
            $table->timestamp('last_seen_at')->nullable(); // When product was last available
            $table->timestamps();
            
            $table->unique(['product_id', 'shop_id']);
            $table->index('shop_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_shop');
    }
};
