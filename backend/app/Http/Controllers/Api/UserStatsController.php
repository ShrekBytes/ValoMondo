<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Product, Restaurant, Shop, School, University, Hospital, Hotel, TouristSpot, Technician, Website, Manufacturer, Review, Rating};
use Illuminate\Http\Request;

class UserStatsController extends Controller
{
    /**
     * Get user's reviews
     */
    public function reviews(Request $request)
    {
        $user = $request->user();
        
        $reviews = Review::where('user_id', $user->id)
            ->with(['reviewable'])
            ->latest()
            ->paginate(20);
        
        // Add item details
        $reviews->getCollection()->transform(function ($review) {
            $reviewable = $review->reviewable;
            $review->item_name = $reviewable ? $reviewable->name : 'Unknown';
            $review->item_slug = $reviewable ? $reviewable->slug : null;
            $review->item_type = class_basename($review->reviewable_type);
            
            // Get category slug for the item
            $categoryMap = [
                'Product' => 'products',
                'Restaurant' => 'restaurants',
                'Shop' => 'shops',
                'School' => 'schools',
                'University' => 'universities',
                'Hospital' => 'hospitals',
                'Hotel' => 'hotels',
                'TouristSpot' => 'tourist-spots',
                'Technician' => 'technicians',
                'Website' => 'websites',
                'Manufacturer' => 'manufacturers',
            ];
            $review->category_slug = $categoryMap[$review->item_type] ?? null;
            
            return $review;
        });
        
        return response()->json($reviews);
    }

    /**
     * Get user's ratings
     */
    public function ratings(Request $request)
    {
        $user = $request->user();
        
        $ratings = Rating::where('user_id', $user->id)
            ->with(['ratable'])
            ->latest()
            ->paginate(20);
        
        // Add item details
        $ratings->getCollection()->transform(function ($rating) {
            $ratable = $rating->ratable;
            $rating->item_name = $ratable ? $ratable->name : 'Unknown';
            $rating->item_slug = $ratable ? $ratable->slug : null;
            $rating->item_type = class_basename($rating->ratable_type);
            
            // Get category slug for the item
            $categoryMap = [
                'Product' => 'products',
                'Restaurant' => 'restaurants',
                'Shop' => 'shops',
                'School' => 'schools',
                'University' => 'universities',
                'Hospital' => 'hospitals',
                'Hotel' => 'hotels',
                'TouristSpot' => 'tourist-spots',
                'Technician' => 'technicians',
                'Website' => 'websites',
                'Manufacturer' => 'manufacturers',
            ];
            $rating->category_slug = $categoryMap[$rating->item_type] ?? null;
            
            return $rating;
        });
        
        return response()->json($ratings);
    }

    /**
     * Get user's submissions
     */
    public function submissions(Request $request)
    {
        $user = $request->user();
        
        // Get submissions from all categories where user is the approver (they submitted it)
        // This includes both approved items and pending items that were auto-approved by moderators/admins
        $allSubmissions = collect();
        
        // Define all models and their category info
        $models = [
            ['model' => Product::class, 'slug' => 'products', 'name' => 'Product'],
            ['model' => Restaurant::class, 'slug' => 'restaurants', 'name' => 'Restaurant'],
            ['model' => Shop::class, 'slug' => 'shops', 'name' => 'Shop'],
            ['model' => School::class, 'slug' => 'schools', 'name' => 'School'],
            ['model' => University::class, 'slug' => 'universities', 'name' => 'University'],
            ['model' => Hospital::class, 'slug' => 'hospitals', 'name' => 'Hospital'],
            ['model' => Hotel::class, 'slug' => 'hotels', 'name' => 'Hotel'],
            ['model' => TouristSpot::class, 'slug' => 'tourist-spots', 'name' => 'Tourist Spot'],
            ['model' => Technician::class, 'slug' => 'technicians', 'name' => 'Technician'],
            ['model' => Website::class, 'slug' => 'websites', 'name' => 'Website'],
            ['model' => Manufacturer::class, 'slug' => 'manufacturers', 'name' => 'Manufacturer'],
        ];
        
        // Collect items from all models
        foreach ($models as $modelInfo) {
            $modelClass = $modelInfo['model'];
            $items = $modelClass::where('approved_by', $user->id)
                ->with('media')
                ->latest()
                ->get();
            
            foreach ($items as $item) {
                $item->category_slug = $modelInfo['slug'];
                $item->category_name = $modelInfo['name'];
                $allSubmissions->push($item);
            }
        }
        
        // Sort by created_at descending
        $allSubmissions = $allSubmissions->sortByDesc('created_at')->values();
        
        // Paginate manually
        $page = $request->input('page', 1);
        $perPage = 20;
        $total = $allSubmissions->count();
        $items = $allSubmissions->slice(($page - 1) * $perPage, $perPage)->values();
        
        // Format items with images
        $formattedItems = $items->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'description' => $item->description,
                'status' => $item->status,
                'category_slug' => $item->category_slug,
                'category_name' => $item->category_name,
                'images' => $item->getMedia('images')->map(fn($media) => [
                    'id' => $media->id,
                    'url' => $media->getFullUrl(),
                    'name' => $media->file_name,
                ])->values(),
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });
        
        return response()->json([
            'data' => $formattedItems,
            'current_page' => (int) $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => (int) ceil($total / $perPage),
        ]);
    }

    /**
     * Get statistics for the authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Count submissions (for now, just products)
        $submissions = Product::where('approved_by', $user->id)->count();
        
        // Count unique items reviewed (not total comments, but distinct items)
        $itemsReviewedCount = Review::where('user_id', $user->id)
            ->distinct()
            ->count('reviewable_id');
        
        // Count unique items rated (distinct items)
        $itemsRatedCount = Rating::where('user_id', $user->id)
            ->distinct()
            ->count('ratable_id');
        
        // Get recent activity
        $recentReviews = Review::where('user_id', $user->id)
            ->with('reviewable')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($review) {
                $reviewable = $review->reviewable;
                $review->item_name = $reviewable ? $reviewable->name : 'Unknown';
                $review->item_slug = $reviewable ? $reviewable->slug : null;
                $review->item_type = class_basename($review->reviewable_type);
                
                // Get category slug for the item
                $categoryMap = [
                    'Product' => 'products',
                    'Restaurant' => 'restaurants',
                    'Shop' => 'shops',
                    'School' => 'schools',
                    'University' => 'universities',
                    'Hospital' => 'hospitals',
                    'Hotel' => 'hotels',
                    'TouristSpot' => 'tourist-spots',
                    'Technician' => 'technicians',
                    'Website' => 'websites',
                    'Manufacturer' => 'manufacturers',
                ];
                $review->category_slug = $categoryMap[$review->item_type] ?? null;
                
                return $review;
            });
        
        $recentRatings = Rating::where('user_id', $user->id)
            ->with('ratable')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($rating) {
                $ratable = $rating->ratable;
                $rating->item_name = $ratable ? $ratable->name : 'Unknown';
                $rating->item_slug = $ratable ? $ratable->slug : null;
                $rating->item_type = class_basename($rating->ratable_type);
                
                // Get category slug for the item
                $categoryMap = [
                    'Product' => 'products',
                    'Restaurant' => 'restaurants',
                    'Shop' => 'shops',
                    'School' => 'schools',
                    'University' => 'universities',
                    'Hospital' => 'hospitals',
                    'Hotel' => 'hotels',
                    'TouristSpot' => 'tourist-spots',
                    'Technician' => 'technicians',
                    'Website' => 'websites',
                    'Manufacturer' => 'manufacturers',
                ];
                $rating->category_slug = $categoryMap[$rating->item_type] ?? null;
                
                return $rating;
            });
        
        return response()->json([
            'submissions' => $submissions,
            'items_reviewed' => $itemsReviewedCount,
            'items_rated' => $itemsRatedCount,
            'recent_activity' => [
                'reviews' => $recentReviews,
                'ratings' => $recentRatings,
            ],
        ]);
    }
}
