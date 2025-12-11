# Bangladesh Review - Admin Panel

Laravel Livewire admin panel for content moderation.

## Quick Start

```bash
# Install dependencies
composer install

# Copy environment file (use same database as backend)
cp .env.example .env

# Configure same database as backend in .env:
DB_CONNECTION=pgsql
DB_DATABASE=bangladesh_review
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Generate app key
php artisan key:generate

# Create symbolic link to backend models
cd app
rm -rf Models
ln -s ../../backend/app/Models Models
cd ..

# Start server on different port
php artisan serve --port=8001
```

## Features

- Review moderation (approve/reject)
- Item moderation (approve/reject)
- User management
- Dashboard with statistics
- Real-time updates with Livewire

## Creating Moderator Users

```bash
php artisan tinker

# In tinker:
App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
    'is_moderator' => true,
    'is_active' => true
]);
```
