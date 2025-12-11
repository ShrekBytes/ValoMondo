@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="px-4 sm:px-0">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-2">Pending Items</div>
            <div class="text-3xl font-bold text-yellow-600">{{ $stats['pending_items'] ?? 0 }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-2">Update Requests</div>
            <div class="text-3xl font-bold text-orange-600">{{ $stats['pending_update_requests'] ?? 0 }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-2">Review Reports</div>
            <div class="text-3xl font-bold text-red-600">{{ $stats['pending_reports'] ?? 0 }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-2">Total Users</div>
            <div class="text-3xl font-bold text-green-600">{{ $stats['total_users'] ?? 0 }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-2">Total Reviews</div>
            <div class="text-3xl font-bold text-purple-600">{{ $stats['total_reviews'] ?? 0 }}</div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="{{ route('admin.items') }}" class="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
                <span class="text-2xl mr-3">📦</span>
                <div>
                    <div class="font-semibold">Approve Items</div>
                    <div class="text-sm text-gray-600">Check pending submissions</div>
                </div>
            </a>
            <a href="{{ route('admin.update-requests') }}" class="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition">
                <span class="text-2xl mr-3">🔄</span>
                <div>
                    <div class="font-semibold">Update Requests</div>
                    <div class="text-sm text-gray-600">Review item updates</div>
                </div>
            </a>
            <a href="{{ route('admin.reports') }}" class="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition">
                <span class="text-2xl mr-3">🚩</span>
                <div>
                    <div class="font-semibold">Review Reports</div>
                    <div class="text-sm text-gray-600">Handle reported content</div>
                </div>
            </a>
            <a href="{{ route('admin.users') }}" class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
                <span class="text-2xl mr-3">👥</span>
                <div>
                    <div class="font-semibold">Manage Users</div>
                    <div class="text-sm text-gray-600">View and manage users</div>
                </div>
            </a>
        </div>
    </div>
</div>
@endsection

