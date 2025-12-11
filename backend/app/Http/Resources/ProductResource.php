<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * This resource is used for all item types (products, shops, technicians, etc.)
     */
    public function toArray(Request $request): array
    {
        // Get the model instance
        $model = $this->resource;
        
        // Base fields that are always included
        $data = [
            'id' => $model->id,
            'name' => $model->name,
            'slug' => $model->slug,
            'description' => $model->description,
            'status' => $model->status,
            'images' => $model->getMedia('images')->map(fn($media) => [
                'id' => $media->id,
                'url' => $media->getFullUrl(),
                'name' => $media->file_name,
            ])->values(),
            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
            'last_info_updated' => $model->last_info_updated,
        ];

        // Get all fillable attributes and add them (this includes casted values)
        $fillable = $model->getFillable();
        $hidden = $model->getHidden();
        $excluded = ['id', 'name', 'slug', 'description', 'status', 'created_at', 'updated_at', 'last_info_updated', 'approved_at', 'approved_by', 'deleted_at'];
        
        foreach ($fillable as $key) {
            // Skip fields that are already included, hidden, or excluded
            if (!in_array($key, $excluded) && !in_array($key, $hidden)) {
                // Use attribute accessor to get casted values (handles arrays, booleans, etc.)
                try {
                    $value = $model->getAttribute($key);
                    // Include all values (including null and empty strings) - let frontend handle filtering
                    $data[$key] = $value;
                } catch (\Exception $e) {
                    // Skip if there's an error accessing the attribute
                    continue;
                }
            }
        }
        
        // Also include any attributes that might not be in fillable but exist in the model
        $attributes = $model->getAttributes();
        foreach ($attributes as $key => $value) {
            if (!isset($data[$key]) && !in_array($key, $excluded) && !in_array($key, $hidden)) {
                $data[$key] = $model->getAttribute($key);
            }
        }

        // Add relationships
        $data['manufacturer'] = $this->whenLoaded('manufacturer');
        $data['shops'] = $this->whenLoaded('shops');
        $data['reviews'] = $this->whenLoaded('reviews');
        $data['ratings'] = $this->whenLoaded('ratings');

        // Add computed rating fields
        $data['avg_user_rating'] = $this->when(isset($this->avg_user_rating), $this->avg_user_rating ? (float) $this->avg_user_rating : null);
        $data['moderator_rating'] = $this->when(isset($this->moderator_rating), $this->moderator_rating ? (int) $this->moderator_rating : null);
        $data['total_ratings'] = $this->when(isset($this->total_ratings), (int) $this->total_ratings);

        return $data;
    }
}

