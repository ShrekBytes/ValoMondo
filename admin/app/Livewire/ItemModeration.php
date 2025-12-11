<?php

namespace App\Livewire;

use App\Models\{Product, Restaurant, Shop, School, University, Hospital, Hotel, TouristSpot, Technician, Website, Manufacturer, User};
use Livewire\Component;
use Livewire\Attributes\Layout;
use Illuminate\Support\Collection;

#[Layout('layouts.app')]
class ItemModeration extends Component
{

    public $filter = 'pending';
    public $categoryFilter = 'all';

    public function approve($itemType, $itemId)
    {
        $model = $this->getModelClass($itemType);
        $item = $model::findOrFail($itemId);
        $item->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        session()->flash('success', 'Item approved successfully');
    }

    public function reject($itemType, $itemId)
    {
        $model = $this->getModelClass($itemType);
        $item = $model::findOrFail($itemId);
        $item->update([
            'status' => 'rejected',
            'approved_by' => auth()->id(),
        ]);

        session()->flash('success', 'Item rejected successfully');
    }

    public function delete($itemType, $itemId)
    {
        $user = auth()->user();
        
        // Check if user is moderator or admin
        if (!$user->isModeratorOrAdmin()) {
            session()->flash('error', 'You do not have permission to delete items.');
            return;
        }

        $model = $this->getModelClass($itemType);
        $item = $model::findOrFail($itemId);
        $itemName = $item->name;
        $item->delete();

        session()->flash('success', "Item '{$itemName}' deleted successfully");
    }

    private function getModelClass($type)
    {
        $map = [
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

        return $map[$type] ?? Product::class;
    }

    public function render()
    {
        try {
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

            $allItems = collect();

            foreach ($models as $model) {
                try {
                    if (!class_exists($model)) {
                        continue;
                    }
                    
                    $query = $model::query();
                    
                    if ($this->filter !== 'all') {
                        $query->where('status', $this->filter);
                    }

                    $items = $query->latest()->get();
                    
                    foreach ($items as $item) {
                        $allItems->push([
                            'id' => $item->id,
                            'name' => $item->name ?? 'N/A',
                            'description' => $item->description ?? '',
                            'type' => class_basename($model),
                            'status' => $item->status ?? 'pending',
                            'created_at' => $item->created_at ?? now(),
                            'price' => $item->price ?? null,
                            'manufacturer' => $item->manufacturer ?? null,
                        ]);
                    }
                } catch (\Exception $e) {
                    \Log::error("Error loading model {$model}: " . $e->getMessage());
                    continue;
                }
            }

            // Sort by created_at
            $items = $allItems->sortByDesc('created_at')->values();

            return view('livewire.item-moderation', ['items' => $items]);
        } catch (\Exception $e) {
            \Log::error("ItemModeration render error: " . $e->getMessage());
            return view('livewire.item-moderation', ['items' => collect(), 'error' => $e->getMessage()]);
        }
    }
}

