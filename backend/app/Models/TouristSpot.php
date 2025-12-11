<?php

namespace App\Models;

use App\Models\Traits\Reviewable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;

class TouristSpot extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, Reviewable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'phone',
        'website',
        'division',
        'district',
        'area',
        'address',
        'latitude',
        'longitude',
        'entry_fee',
        'opening_hours',
        'best_visit_time',
        'activities',
        'has_parking',
        'has_restaurant',
        'family_friendly',
        'status',
        'approved_at',
        'approved_by',
        'last_info_updated',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'entry_fee' => 'decimal:2',
        'opening_hours' => 'array',
        'activities' => 'array',
        'has_parking' => 'boolean',
        'has_restaurant' => 'boolean',
        'family_friendly' => 'boolean',
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

