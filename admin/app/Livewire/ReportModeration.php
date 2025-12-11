<?php

namespace App\Livewire;

use App\Models\ReviewReport;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\Layout;

#[Layout('layouts.app')]
class ReportModeration extends Component
{
    use WithPagination;

    public $filter = 'pending';

    public function review($reportId, $action)
    {
        $report = ReviewReport::findOrFail($reportId);
        
        if ($action === 'dismiss') {
            $report->update([
                'status' => 'dismissed',
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
            ]);
            session()->flash('success', 'Report dismissed');
        } elseif ($action === 'action') {
            // Delete the review
            $review = $report->review;
            if ($review) {
                $review->delete();
            }
            
            $report->update([
                'status' => 'reviewed',
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
            ]);
            session()->flash('success', 'Review deleted and report marked as reviewed');
        }
    }

    public function render()
    {
        $reports = ReviewReport::with(['user', 'review.user', 'review.reviewable'])
            ->when($this->filter !== 'all', function ($query) {
                $query->where('status', $this->filter);
            })
            ->latest()
            ->paginate(20);

        return view('livewire.report-moderation', compact('reports'));
    }
}
