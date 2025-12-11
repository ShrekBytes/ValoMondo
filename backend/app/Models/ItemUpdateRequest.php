<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemUpdateRequest extends Model
{
    protected $fillable = [
        'user_id',
        'item_type',
        'item_id',
        'current_data',
        'proposed_data',
        'status',
        'admin_notes',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'current_data' => 'array',
        'proposed_data' => 'array',
        'reviewed_at' => 'datetime',
    ];

    /**
     * Get the user who submitted the update request
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the moderator who reviewed the request
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get the item being updated (polymorphic)
     */
    public function item()
    {
        return $this->morphTo('item', 'item_type', 'item_id');
    }
}
