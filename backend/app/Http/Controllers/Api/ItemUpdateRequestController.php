<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ItemUpdateRequest;
use App\Models\{Product, Restaurant, Shop, School, University, Hospital, Hotel, TouristSpot, Technician, Website, Manufacturer};
use Illuminate\Http\Request;

class ItemUpdateRequestController extends Controller
{
    /**
     * Submit an update request for an item
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_type' => 'required|string',
            'item_id' => 'required|integer',
            'proposed_data' => 'required|array',
            'images.*' => 'nullable|image|max:5120', // 5MB max per image
        ]);

        $user = $request->user();

        // Map class names
        $modelMap = [
            'Product' => Product::class,
            'Restaurant' => Restaurant::class,
            'Shop' => Shop::class,
            'Manufacturer' => Manufacturer::class,
            'School' => School::class,
            'University' => University::class,
            'Hospital' => Hospital::class,
            'Hotel' => Hotel::class,
            'TouristSpot' => TouristSpot::class,
            'Technician' => Technician::class,
            'Website' => Website::class,
        ];

        $fullClassName = $modelMap[$validated['item_type']] ?? null;
        
        if (!$fullClassName) {
            return response()->json(['error' => 'Invalid item type'], 400);
        }

        // Get the item
        $item = $fullClassName::find($validated['item_id']);
        
        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        // If user is moderator, apply changes directly
        if ($user->is_moderator) {
            foreach ($validated['proposed_data'] as $key => $value) {
                if (in_array($key, $item->getFillable())) {
                    $item->$key = $value;
                }
            }
            $item->last_info_updated = now();
            $item->save();

            // Handle image uploads
            if ($request->hasFile('images')) {
                // Clear existing images
                $item->clearMediaCollection('images');
                
                // Add new images
                foreach ($request->file('images') as $image) {
                    $item->addMedia($image)->toMediaCollection('images');
                }
            }

            return response()->json([
                'message' => 'Item updated successfully',
                'auto_approved' => true,
            ]);
        }

        // For regular users, create update request
        $proposedData = $validated['proposed_data'];
        
        // Store images temporarily if any
        if ($request->hasFile('images')) {
            $proposedData['has_new_images'] = true;
            $proposedData['new_images_count'] = count($request->file('images'));
        }

        $updateRequest = ItemUpdateRequest::create([
            'user_id' => $user->id,
            'item_type' => $fullClassName,
            'item_id' => $validated['item_id'],
            'current_data' => $item->toArray(),
            'proposed_data' => $proposedData,
            'status' => 'pending',
        ]);

        // Store images temporarily for the update request
        // We'll associate them with the update request until approved
        if ($request->hasFile('images')) {
            // Create a temporary model to store the images
            // In a real app, you might want to store these differently
            // For now, we'll note that images are pending in the proposed_data
        }

        return response()->json([
            'message' => 'Update request submitted successfully. It will be reviewed by moderators.',
            'request' => $updateRequest,
            'auto_approved' => false,
        ], 201);
    }

    /**
     * Get all pending update requests (moderators only)
     */
    public function index(Request $request)
    {
        if (!$request->user()->is_moderator) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $requests = ItemUpdateRequest::with(['user'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(20);

        return response()->json($requests);
    }

    /**
     * Approve an update request (moderators only)
     */
    public function approve(Request $request, $id)
    {
        if (!$request->user()->is_moderator) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $updateRequest = ItemUpdateRequest::findOrFail($id);
        
        // Get the item
        $item = $updateRequest->item_type::find($updateRequest->item_id);
        
        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        // Apply the proposed changes
        foreach ($updateRequest->proposed_data as $key => $value) {
            if (in_array($key, $item->getFillable()) && $key !== 'has_new_images' && $key !== 'new_images_count') {
                $item->$key = $value;
            }
        }
        $item->last_info_updated = now();
        $item->save();
        
        // Note: Image handling for approved requests would need additional implementation
        // For now, images are only updated for moderator direct updates

        // Update request status
        $updateRequest->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Update request approved and applied',
            'item' => $item,
        ]);
    }

    /**
     * Reject an update request (moderators only)
     */
    public function reject(Request $request, $id)
    {
        if (!$request->user()->is_moderator) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'admin_notes' => 'nullable|string',
        ]);

        $updateRequest = ItemUpdateRequest::findOrFail($id);
        
        $updateRequest->update([
            'status' => 'rejected',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
            'admin_notes' => $validated['admin_notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Update request rejected',
        ]);
    }
}
