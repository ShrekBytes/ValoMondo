<?php

namespace App\Models;

use App\Models\Traits\Reviewable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;

class School extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, Reviewable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'eiin_number',
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
        'admission_fee',
        'monthly_fee',
        'total_students',
        'total_teachers',
        'status',
        'approved_at',
        'approved_by',
        'last_info_updated',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'admission_fee' => 'decimal:2',
        'monthly_fee' => 'decimal:2',
        'total_students' => 'integer',
        'total_teachers' => 'integer',
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

