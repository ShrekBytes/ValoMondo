<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    /**
     * Get all users (admins only)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Only admins can access this
        if (!$user->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins can manage users.',
            ], 403);
        }

        $users = User::withCount(['reviews', 'ratings'])
            ->latest()
            ->paginate(20);

        return response()->json($users);
    }

    /**
     * Update user role (admins only)
     */
    public function updateRole(Request $request, $id)
    {
        $user = $request->user();
        
        // Only admins can access this
        if (!$user->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins can change user roles.',
            ], 403);
        }

        $targetUser = User::find($id);
        
        if (!$targetUser) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        // Prevent admins from modifying themselves
        if ($targetUser->id === $user->id) {
            return response()->json([
                'message' => 'You cannot modify your own role',
            ], 400);
        }

        $validated = $request->validate([
            'is_moderator' => 'sometimes|boolean',
            'is_admin' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
        ]);

        // Prevent setting both admin and moderator to false if user is currently admin
        if (isset($validated['is_admin']) && $validated['is_admin'] === false && $targetUser->is_admin) {
            // If removing admin status, check if should keep moderator status
            if (!isset($validated['is_moderator'])) {
                $validated['is_moderator'] = false;
            }
        }

        $targetUser->update($validated);

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $targetUser->fresh(),
        ]);
    }

    /**
     * Delete a user (admins only)
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        
        // Only admins can access this
        if (!$user->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins can delete users.',
            ], 403);
        }

        $targetUser = User::find($id);
        
        if (!$targetUser) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        // Prevent admins from deleting themselves
        if ($targetUser->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account',
            ], 400);
        }

        // Prevent deleting other admins
        if ($targetUser->isAdmin() && !$user->isAdmin()) {
            return response()->json([
                'message' => 'You cannot delete an admin account',
            ], 400);
        }

        $targetUser->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
