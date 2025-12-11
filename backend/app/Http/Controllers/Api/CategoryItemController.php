<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Product, Restaurant, Shop, School, University, Hospital, Hotel, TouristSpot, Technician, Website, Manufacturer};
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;

class CategoryItemController extends Controller
{
    /**
     * Get items for a specific category
     */
    public function index(Request $request, $categorySlug)
    {
        // Map category slugs to model classes
        $categoryModelMap = [
            'products' => Product::class,
            'restaurants' => Restaurant::class,
            'shops' => Shop::class,
            'manufacturers' => Manufacturer::class,
            'schools' => School::class,
            'universities' => University::class,
            'hospitals' => Hospital::class,
            'hotels' => Hotel::class,
            'tourist-spots' => TouristSpot::class,
            'technicians' => Technician::class,
            'websites' => Website::class,
        ];

        if (!isset($categoryModelMap[$categorySlug])) {
            return response()->json([
                'error' => 'Invalid category',
            ], 404);
        }

        $modelClass = $categoryModelMap[$categorySlug];
        
        $query = $modelClass::with(['media'])
            ->approved();

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('description', 'ILIKE', "%{$search}%");
            });
        }

        // Location filters (if applicable)
        if ($request->has('division')) {
            $query->where('division', $request->input('division'));
        }
        if ($request->has('district')) {
            $query->where('district', $request->input('district'));
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        if ($sortBy === 'rating') {
            // For rating sort, we'll need to join with ratings table
            // For now, just sort by created_at
            $query->orderBy('created_at', $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $items = $query->paginate(15);

        // Calculate ratings for each item
        $items->getCollection()->transform(function ($item) {
            $item->avg_user_rating = $item->averageUserRating();
            $item->moderator_rating = $item->moderatorRating();
            $item->total_ratings = $item->totalUserRatings();
            return $item;
        });

        // Use ProductResource for now (works for all models with similar structure)
        return ProductResource::collection($items);
    }

    /**
     * Get a single item by category and slug
     */
    public function show($categorySlug, $slug)
    {
        // Map category slugs to model classes
        $categoryModelMap = [
            'products' => Product::class,
            'restaurants' => Restaurant::class,
            'shops' => Shop::class,
            'manufacturers' => Manufacturer::class,
            'schools' => School::class,
            'universities' => University::class,
            'hospitals' => Hospital::class,
            'hotels' => Hotel::class,
            'tourist-spots' => TouristSpot::class,
            'technicians' => Technician::class,
            'websites' => Website::class,
        ];

        if (!isset($categoryModelMap[$categorySlug])) {
            return response()->json([
                'error' => 'Invalid category',
            ], 404);
        }

        $modelClass = $categoryModelMap[$categorySlug];
        
        $item = $modelClass::with(['media', 'reviews.user', 'ratings'])
            ->where('slug', $slug)
            ->approved()
            ->first();

        if (!$item) {
            return response()->json([
                'error' => 'Item not found',
            ], 404);
        }

        // Calculate ratings
        $item->avg_user_rating = $item->averageUserRating();
        $item->moderator_rating = $item->moderatorRating();
        $item->total_ratings = $item->totalUserRatings();

        // Use ProductResource for now (works for all models with similar structure)
        return new ProductResource($item);
    }
}
