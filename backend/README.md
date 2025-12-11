# Bangladesh Review - Backend API

Laravel API backend for the Bangladesh Review platform.

## Quick Start

```bash
# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Configure database in .env:
DB_CONNECTION=pgsql
DB_DATABASE=bangladesh_review
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed categories
php artisan db:seed --class=CategorySeeder

# Start server
php artisan serve
```

## Available Commands

```bash
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## API Documentation

See main README.md for full API documentation.
