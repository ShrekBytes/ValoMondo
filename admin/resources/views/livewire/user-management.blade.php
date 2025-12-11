<div class="px-4 sm:px-0">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">User Management</h1>

    @if(!auth()->user()->isAdmin())
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            You do not have permission to manage users. Only admins can access this page.
        </div>
    @endif

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-2">Total Users</div>
            <div class="text-3xl font-bold text-blue-600">{{ \App\Models\User::count() }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-2">Admins</div>
            <div class="text-3xl font-bold text-red-600">{{ \App\Models\User::where('is_admin', true)->count() }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-2">Moderators</div>
            <div class="text-3xl font-bold text-green-600">{{ \App\Models\User::where('is_moderator', true)->where('is_admin', false)->count() }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-2">Regular Users</div>
            <div class="text-3xl font-bold text-purple-600">{{ \App\Models\User::where('is_moderator', false)->where('is_admin', false)->count() }}</div>
        </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ratings</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        @if(auth()->user()->isAdmin())
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        @endif
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($users as $user)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ $user->name }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-500">{{ $user->email }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($user->is_admin)
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        Admin
                                    </span>
                                @elseif($user->is_moderator)
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Moderator
                                    </span>
                                @else
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        User
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($user->is_active)
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                @else
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        Inactive
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $user->reviews_count }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $user->ratings_count }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $user->created_at->format('M d, Y') }}
                            </td>
                            @if(auth()->user()->isAdmin())
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex items-center gap-2">
                                        <button 
                                            wire:click="openRoleModal({{ $user->id }})" 
                                            class="text-blue-600 hover:text-blue-900"
                                        >
                                            Edit Role
                                        </button>
                                        @if($user->id !== auth()->id())
                                            <button 
                                                wire:click="deleteUser({{ $user->id }})" 
                                                wire:confirm="Are you sure you want to delete this user? This action cannot be undone."
                                                class="text-red-600 hover:text-red-900 font-semibold"
                                            >
                                                Delete
                                            </button>
                                        @else
                                            <span class="text-gray-400 text-xs">(You)</span>
                                        @endif
                                    </div>
                                </td>
                            @endif
                        </tr>
                    @empty
                        <tr>
                            <td colspan="{{ auth()->user()->isAdmin() ? '8' : '7' }}" class="px-6 py-4 text-center text-gray-500">
                                No users found
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-4">
        {{ $users->links() }}
    </div>

    <!-- Role Update Modal -->
    @if($showRoleModal && $selectedUser)
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center" wire:click="closeRoleModal">
            <div class="relative mx-auto p-6 border w-96 shadow-lg rounded-md bg-white" wire:click.stop>
                <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Edit User Role: {{ $selectedUser->name }}</h3>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    wire:model="isModerator" 
                                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                >
                                <span class="ml-2 text-sm text-gray-700">Moderator</span>
                            </label>
                        </div>
                        <div>
                            <label class="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    wire:model="isAdmin" 
                                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                >
                                <span class="ml-2 text-sm text-gray-700">Admin</span>
                            </label>
                        </div>
                        <div>
                            <label class="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    wire:model="isActive" 
                                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                >
                                <span class="ml-2 text-sm text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-6">
                        <button 
                            type="button"
                            wire:click="closeRoleModal" 
                            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            wire:click="updateRole" 
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                        >
                            Update Role
                        </button>
                    </div>
                </div>
            </div>
        </div>
    @endif

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
