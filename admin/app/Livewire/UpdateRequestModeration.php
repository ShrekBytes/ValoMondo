<?php

namespace App\Livewire;

use App\Models\ItemUpdateRequest;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\Layout;

#[Layout('layouts.app')]
class UpdateRequestModeration extends Component
{
    use WithPagination;

    public $filter = 'pending';

    public function approve($requestId)
    {
        $request = ItemUpdateRequest::findOrFail($requestId);
        $item = $request->item_type::find($request->item_id);
        
        if (!$item) {
            session()->flash('error', 'Item not found');
            return;
        }

        // Apply the proposed changes
        foreach ($request->proposed_data as $key => $value) {
            if (in_array($key, $item->getFillable())) {
                $item->$key = $value;
            }
        }
        $item->last_info_updated = now();
        $item->save();

        // Update request status
        $request->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        session()->flash('success', 'Update request approved and applied');
    }

    public function reject($requestId)
    {
        $request = ItemUpdateRequest::findOrFail($requestId);
        
        $request->update([
            'status' => 'rejected',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        session()->flash('success', 'Update request rejected');
    }

    public function render()
    {
        $requests = ItemUpdateRequest::with(['user', 'item'])
            ->when($this->filter !== 'all', function ($query) {
                $query->where('status', $this->filter);
            })
            ->latest()
            ->paginate(20);

        return view('livewire.update-request-moderation', compact('requests'));
    }
}
