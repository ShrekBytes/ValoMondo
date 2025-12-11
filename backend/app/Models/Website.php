<?php

namespace App\Models;

use App\Models\Traits\Reviewable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;

class Website extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, Reviewable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'url',
        'category',
        'website_type',
        'email',
        'phone',
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'is_bangladeshi',
        'has_mobile_app',
        'app_android_url',
        'app_ios_url',
        'languages_supported',
        'payment_methods',
        'has_customer_support',
        'support_phone',
        'support_email',
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
        'status',
        'approved_at',
        'approved_by',
        'last_info_updated',
    ];

    protected $casts = [
        'is_bangladeshi' => 'boolean',
        'has_mobile_app' => 'boolean',
        'languages_supported' => 'array',
        'payment_methods' => 'array',
        'has_customer_support' => 'boolean',
        'has_physical_store' => 'boolean',
        'other_domains' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'total_employees' => 'integer',
        'delivery_rate' => 'decimal:2',
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
        $this->addMediaCollection('logo')
            ->singleFile()
            ->useFallbackUrl('/img/placeholder.jpg');

        $this->addMediaCollection('screenshots')
            ->useFallbackUrl('/img/placeholder.jpg');
    }
}

