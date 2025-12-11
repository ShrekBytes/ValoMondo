<?php

namespace App\Models;

use App\Models\Traits\Reviewable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;

class University extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, Reviewable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'accreditation',
        'help_desk_phone',
        'admission_office_phone',
        'email',
        'website',
        'facebook_url',
        'division',
        'district',
        'area',
        'address',
        'latitude',
        'longitude',
        'courses_offered',
        'famous_for_courses',
        'university_grade',
        'organization',
        'undergraduate_fee',
        'graduate_fee',
        'total_students',
        'total_teachers',
        'total_faculty',
        'vice_chancellor',
        'established_year',
        'status',
        'approved_at',
        'approved_by',
        'last_info_updated',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'courses_offered' => 'array',
        'famous_for_courses' => 'array',
        'undergraduate_fee' => 'decimal:2',
        'graduate_fee' => 'decimal:2',
        'total_students' => 'integer',
        'total_teachers' => 'integer',
        'total_faculty' => 'integer',
        'established_year' => 'integer',
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

        $this->addMediaCollection('images')
            ->useFallbackUrl('/img/placeholder.jpg');
    }
}

