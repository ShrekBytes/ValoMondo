<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'reviewable_type',
        'reviewable_id',
        'comment',
        'status',
        'approved_at',
        'approved_by',
        'parent_id',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    /**
     * Get the reviewable model (polymorphic relationship)
     */
    public function reviewable()
    {
        return $this->morphTo();
    }

    /**
     * Get the user who wrote the review
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the moderator who approved the review
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get parent review (for nested comments)
     */
    public function parent()
    {
        return $this->belongsTo(Review::class, 'parent_id');
    }

    /**
     * Get replies to this review
     */
    public function replies()
    {
        return $this->hasMany(Review::class, 'parent_id');
    }

    /**
     * Scope for approved reviews
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for pending reviews
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for top-level reviews (no parent)
     */
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }
}

