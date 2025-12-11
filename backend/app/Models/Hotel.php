<?php

namespace App\Models;

use App\Models\Traits\Reviewable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;

class Hotel extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, Reviewable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'star_rating',
        'phone',
        'email',
        'website',
        'facebook_url',
        'division',
        'district',
        'area',
        'address',
        'latitude',
        'longitude',
        'amenities',
        'price_range_min',
        'price_range_max',
        'total_rooms',
        'has_restaurant',
        'has_parking',
        'status',
        'approved_at',
        'approved_by',
        'last_info_updated',
    ];

    protected $casts = [
        'star_rating' => 'integer',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'amenities' => 'array',
        'price_range_min' => 'decimal:2',
        'price_range_max' => 'decimal:2',
        'total_rooms' => 'integer',
        'has_restaurant' => 'boolean',
        'has_parking' => 'boolean',
        'approved_at' => 'datetime',
        'last_info_updated' => 'datetime',
    ];

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

