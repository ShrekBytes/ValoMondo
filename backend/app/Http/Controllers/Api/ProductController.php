<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get all approved products
     */
    public function index(Request $request)
    {
        $query = Product::with(['manufacturer', 'shops', 'media'])
            ->approved();

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('description', 'ILIKE', "%{$search}%");
            });
        }

        // Filter by manufacturer
        if ($request->has('manufacturer_id')) {
            $query->where('manufacturer_id', $request->input('manufacturer_id'));
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        $products = $query->paginate(15);

        // Calculate ratings for each product
        $products->getCollection()->transform(function ($product) {
            $product->avg_user_rating = $product->averageUserRating();
            $product->moderator_rating = $product->moderatorRating();
            $product->total_ratings = $product->totalUserRatings();
            return $product;
        });

        return ProductResource::collection($products);
    }

    /**
     * Get a single product
     */
    public function show($slug)
    {
        $product = Product::with(['manufacturer', 'shops', 'reviews.user', 'ratings', 'media'])
            ->where('slug', $slug)
            ->approved()
            ->firstOrFail();

        // Calculate ratings
        $product->avg_user_rating = $product->averageUserRating();
        $product->moderator_rating = $product->moderatorRating();
        $product->total_ratings = $product->totalUserRatings();

        return new ProductResource($product);
    }

    /**
     * Create a new product (authenticated users)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'description' => 'nullable|string',
            'manufacturer_id' => 'nullable|exists:manufacturers,id',
            'price' => 'nullable|numeric|min:0',
            'barcode' => 'nullable|string',
            'sku' => 'nullable|string',
            'images.*' => 'nullable|image|max:5120', // Max 5MB per image
        ]);

        // Check if user is a moderator - auto-approve their submissions
        $user = $request->user();
        if ($user && $user->is_moderator) {
            $validated['status'] = 'approved';
            $validated['approved_at'] = now();
            $validated['approved_by'] = $user->id;
            $message = 'Product published successfully';
        } else {
            $validated['status'] = 'pending';
            $message = 'Product submitted for review';
        }

        $validated['last_info_updated'] = now();

        $product = Product::create($validated);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $product->addMedia($image)
                    ->toMediaCollection('images');
            }
        }

        return response()->json([
            'message' => $message,
            'product' => $product->load('media'),
            'auto_approved' => $user && $user->is_moderator,
        ], 201);
    }

    /**
     * Update a product
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'manufacturer_id' => 'nullable|exists:manufacturers,id',
            'price' => 'nullable|numeric|min:0',
            'barcode' => 'nullable|string',
            'sku' => 'nullable|string',
        ]);

        $validated['last_info_updated'] = now();
        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }
}

