<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewReport extends Model
{
    protected $fillable = [
        'review_id',
        'user_id',
        'status',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    /**
     * Get the review that was reported
     */
    public function review()
    {
        return $this->belongsTo(Review::class);
    }

    /**
     * Get the user who reported
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the moderator who reviewed the report
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
