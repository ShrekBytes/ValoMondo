<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Product, Restaurant, Shop, School, University, Hospital, Hotel, TouristSpot, Technician, Website, Manufacturer};
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Global search across all categories
     */
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        $category = $request->input('category');
        $limit = $request->input('limit', 10);

        if (empty($query)) {
            return response()->json([
                'results' => [],
                'message' => 'Please provide a search query',
            ]);
        }

        $results = [];

        // If category is specified, search only in that category
        if ($category) {
            $results = $this->searchCategory($category, $query, $limit);
        } else {
            // Search across all categories
            $categories = [
                'products' => Product::class,
                'restaurants' => Restaurant::class,
                'shops' => Shop::class,
                'manufacturers' => Manufacturer::class,
                'schools' => School::class,
                'universities' => University::class,
                'hospitals' => Hospital::class,
                'hotels' => Hotel::class,
                'tourist_spots' => TouristSpot::class,
                'technicians' => Technician::class,
                'websites' => Website::class,
            ];

            foreach ($categories as $categoryName => $modelClass) {
                $categoryResults = $this->searchInModel($modelClass, $query, 5);
                if ($categoryResults->isNotEmpty()) {
                    $results[$categoryName] = $categoryResults;
                }
            }
        }

        return response()->json([
            'query' => $query,
            'results' => $results,
        ]);
    }

    /**
     * Search in a specific category
     */
    private function searchCategory($category, $query, $limit)
    {
        $modelMap = [
            'products' => Product::class,
            'restaurants' => Restaurant::class,
            'shops' => Shop::class,
            'manufacturers' => Manufacturer::class,
            'schools' => School::class,
            'universities' => University::class,
            'hospitals' => Hospital::class,
            'hotels' => Hotel::class,
            'tourist_spots' => TouristSpot::class,
            'technicians' => Technician::class,
            'websites' => Website::class,
        ];

        if (!isset($modelMap[$category])) {
            return [];
        }

        return $this->searchInModel($modelMap[$category], $query, $limit);
    }

    /**
     * Perform full-text search in a model
     */
    private function searchInModel($modelClass, $query, $limit)
    {
        return $modelClass::approved()
            ->with('media')
            ->where(function ($q) use ($query) {
                $q->where('name', 'ILIKE', "%{$query}%")
                    ->orWhere('description', 'ILIKE', "%{$query}%");
            })
            ->select('id', 'name', 'slug', 'description')
            ->limit($limit)
            ->get()
            ->map(function ($item) use ($modelClass) {
                $item->category = $this->getCategoryName($modelClass);
                $item->images = $item->getMedia('images')->map(fn($media) => [
                    'id' => $media->id,
                    'url' => $media->getFullUrl(),
                    'name' => $media->file_name,
                ])->values();
                unset($item->media); // Remove the media relation, keep only images
                return $item;
            });
    }

    /**
     * Get category name from model class
     */
    private function getCategoryName($modelClass)
    {
        $map = [
            Product::class => 'product',
            Restaurant::class => 'restaurant',
            Shop::class => 'shop',
            Manufacturer::class => 'manufacturer',
            School::class => 'school',
            University::class => 'university',
            Hospital::class => 'hospital',
            Hotel::class => 'hotel',
            TouristSpot::class => 'tourist_spot',
            Technician::class => 'technician',
            Website::class => 'website',
        ];
        
        return $map[$modelClass] ?? 'unknown';
    }

    /**
     * Advanced filter search
     */
    public function filter(Request $request)
    {
        $category = $request->input('category');
        $filters = $request->except(['category', 'page', 'per_page']);
        
        $modelMap = [
            'products' => Product::class,
            'restaurants' => Restaurant::class,
            'shops' => Shop::class,
            'schools' => School::class,
            'universities' => University::class,
            'hospitals' => Hospital::class,
            'hotels' => Hotel::class,
            'tourist_spots' => TouristSpot::class,
            'technicians' => Technician::class,
            'websites' => Website::class,
        ];

        if (!isset($modelMap[$category])) {
            return response()->json([
                'error' => 'Invalid category',
            ], 400);
        }

        $query = $modelMap[$category]::approved();

        // Apply filters
        foreach ($filters as $key => $value) {
            if (empty($value)) continue;

            switch ($key) {
                case 'division':
                case 'district':
                case 'area':
                    $query->where($key, $value);
                    break;
                case 'min_price':
                    $query->where('price', '>=', $value);
                    break;
                case 'max_price':
                    $query->where('price', '<=', $value);
                    break;
                case 'search':
                    $query->where(function ($q) use ($value) {
                        $q->where('name', 'ILIKE', "%{$value}%")
                            ->orWhere('description', 'ILIKE', "%{$value}%");
                    });
                    break;
            }
        }

        $results = $query->paginate($request->input('per_page', 15));

        return response()->json($results);
    }
}

