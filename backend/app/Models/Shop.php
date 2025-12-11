<?php

namespace App\Models;

use App\Models\Traits\Reviewable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;

class Shop extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, Reviewable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'branches',
        'shop_type',
        'payment_types',
        'does_delivery',
        'famous_for',
        'website',
        'email',
        'phone',
        'facebook_url',
        'division',
        'district',
        'area',
        'address',
        'latitude',
        'longitude',
        'operating_hours',
        'status',
        'approved_at',
        'approved_by',
        'last_info_updated',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'operating_hours' => 'array',
        'branches' => 'array',
        'payment_types' => 'array',
        'does_delivery' => 'boolean',
        'approved_at' => 'datetime',
        'last_info_updated' => 'datetime',
    ];

    /**
     * Get the products sold at this shop
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_shop')
            ->withPivot('price_at_shop', 'is_available', 'last_seen_at')
            ->withTimestamps();
    }

    /**
     * Get the approver
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Register media collections
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->useFallbackUrl('/img/placeholder.jpg');
    }
}

