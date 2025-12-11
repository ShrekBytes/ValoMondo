<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_moderator',
        'is_admin',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_moderator' => 'boolean',
            'is_admin' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get all reviews by this user
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get all ratings by this user
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Get items approved by this moderator
     */
    public function approvedProducts()
    {
        return $this->hasMany(Product::class, 'approved_by');
    }

    /**
     * Scope for active users
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for moderators
     */
    public function scopeModerators($query)
    {
        return $query->where('is_moderator', true);
    }

    /**
     * Check if user is a moderator
     */
    public function isModerator(): bool
    {
        return $this->is_moderator;
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->is_admin;
    }

    /**
     * Check if user is moderator or admin
     */
    public function isModeratorOrAdmin(): bool
    {
        return $this->is_moderator || $this->is_admin;
    }
}
