<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\ReviewReport;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get reviews for a reviewable item
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'reviewable_type' => 'required|string',
            'reviewable_id' => 'required|integer',
        ]);

        $reviews = Review::with(['user', 'replies.user'])
            ->where('reviewable_type', $validated['reviewable_type'])
            ->where('reviewable_id', $validated['reviewable_id'])
            ->approved()
            ->topLevel()
            ->latest()
            ->paginate(10);

        // Add user ratings to reviews
        $reviews->getCollection()->transform(function ($review) use ($validated) {
            $userRating = \App\Models\Rating::where('user_id', $review->user_id)
                ->where('ratable_type', $validated['reviewable_type'])
                ->where('ratable_id', $validated['reviewable_id'])
                ->where('is_moderator_rating', false)
                ->first();
            
            $review->user_rating = $userRating ? $userRating->rating : null;
            
            // Add ratings to replies as well
            if ($review->replies) {
                $review->replies->transform(function ($reply) use ($validated) {
                    $replyUserRating = \App\Models\Rating::where('user_id', $reply->user_id)
                        ->where('ratable_type', $validated['reviewable_type'])
                        ->where('ratable_id', $validated['reviewable_id'])
                        ->where('is_moderator_rating', false)
                        ->first();
                    
                    $reply->user_rating = $replyUserRating ? $replyUserRating->rating : null;
                    return $reply;
                });
            }
            
            return $review;
        });

        return response()->json($reviews);
    }

    /**
     * Create a new review (authenticated users only)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reviewable_type' => 'required|string',
            'reviewable_id' => 'required|integer',
            'comment' => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:reviews,id',
        ]);

        $user = $request->user();
        $validated['user_id'] = $user->id;

        // All users can post reviews without approval
        $validated['status'] = 'approved';
        $validated['approved_at'] = now();
        $validated['approved_by'] = $user->id;

        $review = Review::create($validated);

        return response()->json([
            'message' => 'Review published successfully',
            'review' => $review,
            'auto_approved' => true,
        ], 201);
    }

    /**
     * Update a review
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // Check if user owns the review
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:2000',
        ]);

        $review->update($validated);

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review,
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // Check if user owns the review or is moderator
        if ($review->user_id !== $request->user()->id && !$request->user()->isModerator()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully',
        ]);
    }

    /**
     * Report a review
     */
    public function report(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $user = $request->user();

        // Check if user already reported this review
        $existingReport = ReviewReport::where('review_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingReport) {
            return response()->json([
                'message' => 'You have already reported this review',
            ], 400);
        }

        // Create report
        ReviewReport::create([
            'review_id' => $id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Review reported successfully. Thank you for helping maintain our community standards.',
        ]);
    }
}

