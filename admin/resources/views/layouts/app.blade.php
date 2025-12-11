<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin Panel') - ValoMondo.info</title>
    <script src="https://cdn.tailwindcss.com"></script>
    @livewireStyles
</head>
<body class="bg-gray-100">
    <div class="min-h-screen">
        <!-- Navigation -->
        <nav class="bg-white shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <div class="flex-shrink-0 flex items-center">
                            <span class="text-xl font-bold text-primary-600">🔐 Admin Panel - ValoMondo.info</span>
                        </div>
                        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <a href="{{ route('admin.dashboard') }}" class="border-b-2 @if(request()->routeIs('admin.dashboard')) border-blue-500 @else border-transparent @endif text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                Dashboard
                            </a>
                            <a href="{{ route('admin.items') }}" class="border-b-2 @if(request()->routeIs('admin.items')) border-blue-500 @else border-transparent @endif text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                Items
                            </a>
                            <a href="{{ route('admin.update-requests') }}" class="border-b-2 @if(request()->routeIs('admin.update-requests')) border-blue-500 @else border-transparent @endif text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                Updates
                            </a>
                            <a href="{{ route('admin.reports') }}" class="border-b-2 @if(request()->routeIs('admin.reports')) border-blue-500 @else border-transparent @endif text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                Reports
                            </a>
                            @if(auth()->user()->isAdmin())
                                <a href="{{ route('admin.users') }}" class="border-b-2 @if(request()->routeIs('admin.users')) border-blue-500 @else border-transparent @endif text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                    Users
                                </a>
                            @endif
                        </div>
                    </div>
                    <div class="flex items-center">
                        <span class="text-gray-700 mr-4">{{ auth()->user()->name ?? 'Admin' }}</span>
                        <form method="POST" action="{{ route('admin.logout') }}">
                            @csrf
                            <button type="submit" class="text-gray-700 hover:text-gray-900">Logout</button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Page Content -->
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            @if(session('success'))
                <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {{ session('success') }}
                </div>
            @endif

            @if(session('error'))
                <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {{ session('error') }}
                </div>
            @endif

            {{ $slot ?? '' }}
            @hasSection('content')
                @yield('content')
            @endif
        </main>
    </div>

    @livewireScripts
</body>
</html>

