<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\{Product, Restaurant, Shop, School, University, Hospital, Hotel, TouristSpot, Technician, Website, Manufacturer};
use App\Models\User;
use App\Models\ItemUpdateRequest;
use App\Models\ReviewReport;

class DashboardController extends Controller
{
    public function index()
    {
        // Count pending items across all categories
        $pendingItems = 0;
        $models = [
            Product::class,
            Restaurant::class,
            Shop::class,
            Manufacturer::class,
            School::class,
            University::class,
            Hospital::class,
            Hotel::class,
            TouristSpot::class,
            Technician::class,
            Website::class,
        ];
        
        foreach ($models as $model) {
            $pendingItems += $model::where('status', 'pending')->count();
        }

        $stats = [
            'pending_items' => $pendingItems,
            'pending_update_requests' => ItemUpdateRequest::where('status', 'pending')->count(),
            'pending_reports' => ReviewReport::where('status', 'pending')->count(),
            'total_users' => User::count(),
            'total_reviews' => Review::count(),
        ];

        return view('dashboard', compact('stats'));
    }
}

