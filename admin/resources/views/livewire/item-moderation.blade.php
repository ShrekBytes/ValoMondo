<div class="px-4 sm:px-0">
    @if(isset($error))
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {{ $error }}
        </div>
    @endif
    
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Item Moderation</h1>
        <div>
            <select wire:model.live="filter" class="border rounded-lg px-4 py-2">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="all">All</option>
            </select>
        </div>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($items as $item)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                    {{ is_array($item) ? $item['type'] : $item->type }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ is_array($item) ? $item['name'] : $item->name }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-500 max-w-md">{{ Str::limit(is_array($item) ? $item['description'] : $item->description, 80) }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @php
                                    $status = is_array($item) ? $item['status'] : $item->status;
                                @endphp
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    @if($status === 'approved') bg-green-100 text-green-800
                                    @elseif($status === 'rejected') bg-red-100 text-red-800
                                    @else bg-yellow-100 text-yellow-800 @endif">
                                    {{ ucfirst($status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                @if(is_array($item))
                                    {{ \Carbon\Carbon::parse($item['created_at'])->format('M d, Y') }}
                                @elseif($item->created_at instanceof \Carbon\Carbon)
                                    {{ $item->created_at->format('M d, Y') }}
                                @else
                                    {{ \Carbon\Carbon::parse($item->created_at)->format('M d, Y') }}
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                @php
                                    $itemType = is_array($item) ? $item['type'] : $item->type;
                                    $itemId = is_array($item) ? $item['id'] : $item->id;
                                    $itemStatus = is_array($item) ? $item['status'] : $item->status;
                                @endphp
                                <div class="flex items-center gap-2">
                                    @if($itemStatus === 'pending')
                                        <button wire:click="approve('{{ $itemType }}', {{ $itemId }})" class="text-green-600 hover:text-green-900">
                                            Approve
                                        </button>
                                        <button wire:click="reject('{{ $itemType }}', {{ $itemId }})" class="text-red-600 hover:text-red-900">
                                            Reject
                                        </button>
                                    @endif
                                    @if(auth()->user()->isModeratorOrAdmin())
                                        <button 
                                            wire:click="delete('{{ $itemType }}', {{ $itemId }})" 
                                            wire:confirm="Are you sure you want to delete this item? This action cannot be undone."
                                            class="text-red-600 hover:text-red-900 font-semibold"
                                        >
                                            Delete
                                        </button>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                                No items found
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @if(session()->has('success'))
        <div class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {{ session('success') }}
        </div>
    @endif

    @if(session()->has('error'))
        <div class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ session('error') }}
        </div>
    @endif
</div>

