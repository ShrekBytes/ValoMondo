<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ratable_type',
        'ratable_id',
        'rating',
        'is_moderator_rating',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_moderator_rating' => 'boolean',
    ];

    /**
     * Get the ratable model (polymorphic relationship)
     */
    public function ratable()
    {
        return $this->morphTo();
    }

    /**
     * Get the user who gave the rating
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for user ratings only
     */
    public function scopeUserRatings($query)
    {
        return $query->where('is_moderator_rating', false);
    }

    /**
     * Scope for moderator rating only
     */
    public function scopeModeratorRating($query)
    {
        return $query->where('is_moderator_rating', true);
    }
}

