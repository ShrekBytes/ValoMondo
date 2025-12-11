<div class="px-4 sm:px-0">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Review Reports</h1>
        <div>
            <select wire:model.live="filter" class="border rounded-lg px-4 py-2">
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="dismissed">Dismissed</option>
                <option value="all">All</option>
            </select>
        </div>
    </div>

    @if(session()->has('success'))
        <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {{ session('success') }}
        </div>
    @endif

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($reports as $report)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ $report->user->name }}</div>
                                <div class="text-sm text-gray-500">{{ $report->user->email }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-900 max-w-md">
                                    @if($report->review)
                                        <div class="font-medium mb-1">By: {{ $report->review->user->name }}</div>
                                        <div>{{ Str::limit($report->review->comment, 100) }}</div>
                                    @else
                                        <span class="text-gray-400">Review deleted</span>
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($report->review && $report->review->reviewable)
                                    <div class="text-sm text-gray-900">{{ $report->review->reviewable->name ?? 'N/A' }}</div>
                                    <div class="text-sm text-gray-500">{{ class_basename($report->review->reviewable_type) }}</div>
                                @else
                                    <span class="text-gray-400">N/A</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    @if($report->status === 'reviewed') bg-green-100 text-green-800
                                    @elseif($report->status === 'dismissed') bg-gray-100 text-gray-800
                                    @else bg-yellow-100 text-yellow-800 @endif">
                                    {{ ucfirst($report->status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $report->created_at->format('M d, Y') }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                @if($report->status === 'pending')
                                    <button wire:click="review({{ $report->id }}, 'action')" class="text-red-600 hover:text-red-900 mr-3">
                                        Delete Review
                                    </button>
                                    <button wire:click="review({{ $report->id }}, 'dismiss')" class="text-gray-600 hover:text-gray-900">
                                        Dismiss
                                    </button>
                                @else
                                    <span class="text-gray-400">No actions</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                                No reports found
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-4">
        {{ $reports->links() }}
    </div>
</div>
