<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    /**
     * Get ratings for an item
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'ratable_type' => 'required|string',
            'ratable_id' => 'required|integer',
        ]);

        $userRatings = Rating::where('ratable_type', $validated['ratable_type'])
            ->where('ratable_id', $validated['ratable_id'])
            ->userRatings()
            ->get();

        $moderatorRating = Rating::where('ratable_type', $validated['ratable_type'])
            ->where('ratable_id', $validated['ratable_id'])
            ->moderatorRating()
            ->first();

        $avgRating = $userRatings->avg('rating');
        $totalRatings = $userRatings->count();

        return response()->json([
            'average_rating' => round($avgRating, 2),
            'total_ratings' => $totalRatings,
            'moderator_rating' => $moderatorRating?->rating,
            'distribution' => [
                5 => $userRatings->where('rating', 5)->count(),
                4 => $userRatings->where('rating', 4)->count(),
                3 => $userRatings->where('rating', 3)->count(),
                2 => $userRatings->where('rating', 2)->count(),
                1 => $userRatings->where('rating', 1)->count(),
            ],
        ]);
    }

    /**
     * Get the current user's rating for an item
     */
    public function getUserRating(Request $request)
    {
        $validated = $request->validate([
            'ratable_type' => 'required|string',
            'ratable_id' => 'required|integer',
        ]);

        $rating = Rating::where('ratable_type', $validated['ratable_type'])
            ->where('ratable_id', $validated['ratable_id'])
            ->where('user_id', $request->user()->id)
            ->first();

        return response()->json([
            'rating' => $rating?->rating,
        ]);
    }

    /**
     * Create or update a rating (authenticated users only)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ratable_type' => 'required|string',
            'ratable_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['is_moderator_rating'] = false;

        // Update or create rating
        $rating = Rating::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'ratable_type' => $validated['ratable_type'],
                'ratable_id' => $validated['ratable_id'],
            ],
            [
                'rating' => $validated['rating'],
            ]
        );

        return response()->json([
            'message' => 'Rating saved successfully',
            'rating' => $rating,
        ]);
    }

    /**
     * Delete a rating
     */
    public function destroy(Request $request, $id)
    {
        $rating = Rating::findOrFail($id);

        // Check if user owns the rating
        if ($rating->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $rating->delete();

        return response()->json([
            'message' => 'Rating deleted successfully',
        ]);
    }
}

