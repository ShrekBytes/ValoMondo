<?php

namespace App\Models\Traits;

use App\Models\Rating;
use App\Models\Review;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

trait Reviewable
{
    use InteractsWithMedia;

    /**
     * Get all reviews for this model
     */
    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    /**
     * Get all ratings for this model
     */
    public function ratings()
    {
        return $this->morphMany(Rating::class, 'ratable');
    }

    /**
     * Get the average user rating
     */
    public function averageUserRating()
    {
        return $this->ratings()
            ->userRatings()
            ->avg('rating');
    }

    /**
     * Get the moderator rating
     */
    public function moderatorRating()
    {
        return $this->ratings()
            ->moderatorRating()
            ->first()?->rating;
    }

    /**
     * Get total user ratings count
     */
    public function totalUserRatings()
    {
        return $this->ratings()
            ->userRatings()
            ->count();
    }

    /**
     * Scope for approved items
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for pending items
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Check if item is approved
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if item is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}

