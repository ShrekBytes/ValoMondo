<?php

namespace App\Models;

use App\Models\Traits\Reviewable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;

class Hospital extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, Reviewable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'phone',
        'emergency_phone',
        'email',
        'website',
        'facebook_url',
        'division',
        'district',
        'area',
        'address',
        'latitude',
        'longitude',
        'specialties',
        'has_emergency',
        'has_icu',
        'has_ambulance',
        'total_beds',
        'operating_hours',
        'status',
        'approved_at',
        'approved_by',
        'last_info_updated',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'specialties' => 'array',
        'has_emergency' => 'boolean',
        'has_icu' => 'boolean',
        'has_ambulance' => 'boolean',
        'total_beds' => 'integer',
        'operating_hours' => 'array',
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

