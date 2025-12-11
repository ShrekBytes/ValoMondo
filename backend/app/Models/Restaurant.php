<?php

namespace App\Models;

use App\Models\Traits\Reviewable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;

class Restaurant extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, Reviewable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'cuisine_type',
        'avg_price_per_person',
        'phone',
        'website',
        'facebook_url',
        'division',
        'district',
        'area',
        'address',
        'latitude',
        'longitude',
        'operating_hours',
        'has_delivery',
        'has_dine_in',
        'status',
        'approved_at',
        'approved_by',
        'last_info_updated',
    ];

    protected $casts = [
        'avg_price_per_person' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'operating_hours' => 'array',
        'has_delivery' => 'boolean',
        'has_dine_in' => 'boolean',
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

        $this->addMediaCollection('menu')
            ->useFallbackUrl('/img/placeholder.jpg');
    }
}

