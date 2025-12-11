<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Get all active categories
     */
    public function index()
    {
        $categories = Category::active()
            ->ordered()
            ->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    /**
     * Get a single category by slug
     */
    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'category' => $category,
        ]);
    }
}

