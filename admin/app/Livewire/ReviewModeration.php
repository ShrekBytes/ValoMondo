<?php

namespace App\Livewire;

use App\Models\Review;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\Layout;

#[Layout('layouts.app')]
class ReviewModeration extends Component
{
    use WithPagination;

    public $filter = 'pending';

    public function mount()
    {
        //
    }

    public function approve($reviewId)
    {
        $review = Review::findOrFail($reviewId);
        $review->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        session()->flash('success', 'Review approved successfully');
    }

    public function reject($reviewId)
    {
        $review = Review::findOrFail($reviewId);
        $review->update([
            'status' => 'rejected',
            'approved_by' => auth()->id(),
        ]);

        session()->flash('success', 'Review rejected successfully');
    }

    public function render()
    {
        $reviews = Review::with(['user', 'reviewable'])
            ->when($this->filter !== 'all', function ($query) {
                $query->where('status', $this->filter);
            })
            ->latest()
            ->paginate(20);

        return view('livewire.review-moderation', compact('reviews'));
    }
}

