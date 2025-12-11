<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Livewire\ItemModeration;
use App\Livewire\UpdateRequestModeration;
use App\Livewire\ReportModeration;

// Login routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('admin.login.post');

Route::get('/', function () {
    return redirect()->route('admin.dashboard');
});

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/items', ItemModeration::class)->name('items');
    Route::get('/update-requests', UpdateRequestModeration::class)->name('update-requests');
    Route::get('/reports', ReportModeration::class)->name('reports');
    Route::get('/users', \App\Livewire\UserManagement::class)->name('users');
    
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
