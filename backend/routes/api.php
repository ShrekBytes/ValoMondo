<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CategoryItemController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\ItemUpdateRequestController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Api\UserStatsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/categories/{slug}/items', [CategoryItemController::class, 'index']);
Route::get('/categories/{categorySlug}/items/{slug}', [CategoryItemController::class, 'show']);

// Products (public read)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// Reviews (public read)
Route::get('/reviews', [ReviewController::class, 'index']);

// Ratings (public read)
Route::get('/ratings', [RatingController::class, 'index']);

// Search
Route::get('/search', [SearchController::class, 'search']);
Route::get('/filter', [SearchController::class, 'filter']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    
    // User Stats & Data
    Route::get('/user/stats', [UserStatsController::class, 'index']);
    Route::get('/user/reviews', [UserStatsController::class, 'reviews']);
    Route::get('/user/ratings', [UserStatsController::class, 'ratings']);
    Route::get('/user/submissions', [UserStatsController::class, 'submissions']);
    
    // Generic item submission (for all categories)
    Route::post('/items', [ItemController::class, 'store']);
    Route::delete('/items/{category}/{id}', [ItemController::class, 'destroy']);
    
    // Products (create/update)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    
    // Reviews (create/update/delete)
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::post('/reviews/{id}/report', [ReviewController::class, 'report']);
    
    // Ratings (create/delete)
    Route::get('/ratings/user', [RatingController::class, 'getUserRating']);
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::delete('/ratings/{id}', [RatingController::class, 'destroy']);
    
    // Item Update Requests
    Route::post('/item-updates', [ItemUpdateRequestController::class, 'store']);
    Route::get('/item-updates', [ItemUpdateRequestController::class, 'index']);
    Route::post('/item-updates/{id}/approve', [ItemUpdateRequestController::class, 'approve']);
    Route::post('/item-updates/{id}/reject', [ItemUpdateRequestController::class, 'reject']);
    
    // Admin: User Management (admins only)
    Route::prefix('admin')->group(function () {
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::put('/users/{id}/role', [UserManagementController::class, 'updateRole']);
        Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);
    });
});

