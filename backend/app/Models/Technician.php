<?php

namespace App\Models;

use App\Models\Traits\Reviewable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;

class Technician extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, Reviewable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'specialty',
        'technician_type',
        'specialized_fields',
        'portfolio_link',
        'phone',
        'email',
        'website',
        'facebook_url',
        'division',
        'district',
        'area',
        'address',
        'service_areas',
        'latitude',
        'longitude',
        'hourly_rate',
        'visit_charge',
        'services_offered',
        'years_of_experience',
        'available_emergency',
        'working_hours',
        'status',
        'approved_at',
        'approved_by',
        'last_info_updated',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'service_areas' => 'array',
        'specialized_fields' => 'array',
        'hourly_rate' => 'decimal:2',
        'visit_charge' => 'decimal:2',
        'services_offered' => 'array',
        'years_of_experience' => 'integer',
        'available_emergency' => 'boolean',
        'working_hours' => 'array',
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
        $this->addMediaCollection('profile_photo')
            ->singleFile()
            ->useFallbackUrl('/img/placeholder.jpg');

        $this->addMediaCollection('images')
            ->useFallbackUrl('/img/placeholder.jpg');
    }
}

