# ValoMondo
<!-- # ValoMondo.Info -->

A comprehensive review and information platform for everything in Bangladesh - from products and services to places and professionals.

![](/screenshots/showcase.png)


## Project Structure

```
valomondo/
├── backend/          # Laravel API (PostgreSQL)
├── frontend/         # Next.js User Frontend
├── admin/            # Laravel Admin Panel (Livewire)
└── screenshots/      # Project previews
```


## Technology Stack

### Backend API
- **Laravel 12** with API Resources
- **PostgreSQL** for database
- **Laravel Sanctum** for API authentication
- **Spatie Media Library** for file handling
- **Spatie Laravel Permission** for role management
- **Intervention Image** for image processing

### Frontend
- **Next.js 14+** with App Router
- **NextAuth.js** for authentication
- **Tailwind CSS** for styling
- **React Query** for API state management
- **Axios** for HTTP requests
- **Leaflet/React-Leaflet** for maps

### Admin Panel
- **Laravel 12** with Livewire 3.x
- **Tailwind CSS** for styling
- Shared database with backend API

## Features

### 11 Categories and more coming
1. **Products** - Food items, electronics, and consumer goods
2. **Restaurants** - Food establishments
3. **Shops** - Retail stores
4. **Manufacturers** - Product manufacturers and brands
5. **Schools** - Educational institutions
6. **Universities** - Higher education
7. **Hospitals** - Healthcare facilities
8. **Tourist Spots** - Tourist attractions
9. **Hotels** - Accommodations
10. **Technicians** - Service professionals
11. **Websites** - Online services

### Core Features
- User authentication and profiles
- Review and rating system (1-5 stars)
- Dual rating system (user ratings + moderator rating)
- Nested comment replies and reports
- Content moderation workflow
- Full-text search with filters
- Location-based search (Division, District, Area)
- Price tracking and comparisons
- Media uploads (photos/videos)
- Map integration for location-based items

## Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL
- npm or yarn

### 1. Backend API Setup

```bash
cd backend

# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
# Edit .env file with your database credentials:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=bangladesh_review
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed categories
php artisan db:seed --class=CategorySeeder

# Start the server
php artisan serve
# API will be available at http://localhost:8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-here

# Start development server
npm run dev
# Frontend will be available at http://localhost:3000
```

### 3. Admin Panel Setup

```bash
cd admin

# The admin panel shares the same database with backend
# Copy the .env from backend or create a new one
cp .env.example .env
# Use the same database credentials as backend

# Install dependencies
composer install

# Generate key
php artisan key:generate

# Start the server (on different port)
php artisan serve --port=8001
# Admin panel will be available at http://localhost:8001
```

### 4. Create Symbolic Links for Models

The admin panel needs access to backend models. Create symbolic links:

```bash
# From the admin directory
cd admin/app
rm -rf Models
ln -s ../../backend/app/Models Models
cd ../..
```

### 5. Create First Moderator User

```bash
cd backend
php artisan tinker

# In tinker:
$user = App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
    'is_moderator' => true,
    'is_active' => true
]);
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout (auth required)
- `GET /api/me` - Get current user (auth required)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{slug}` - Get category by slug

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/{slug}` - Get product details
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/{id}` - Update product (auth required)

### Reviews
- `GET /api/reviews?reviewable_type=...&reviewable_id=...` - Get reviews
- `POST /api/reviews` - Create review (auth required)
- `PUT /api/reviews/{id}` - Update review (auth required)
- `DELETE /api/reviews/{id}` - Delete review (auth required)

### Ratings
- `GET /api/ratings?ratable_type=...&ratable_id=...` - Get ratings
- `POST /api/ratings` - Create/update rating (auth required)
- `DELETE /api/ratings/{id}` - Delete rating (auth required)

### Search
- `GET /api/search?q=...&category=...` - Global search
- `GET /api/filter?category=...&division=...` - Advanced filtering


## Admin Panel Features

- **Dashboard** - Overview statistics
- **Review Moderation** - Approve/reject reviews
- **Item Moderation** - Approve/reject submitted items
- **User Management** - Manage users and moderators
- **Moderator Rating** - Assign official ratings to items

## Development Workflow

1. **Start Backend API:**
   ```bash
   cd backend && php artisan serve
   ```

2. **Start Frontend:**
   ```bash
   cd frontend && npm run dev
   ```

3. **Start Admin Panel:**
   ```bash
   cd admin && php artisan serve --port=8001
   ```


## 🤝 Contributing

Found a bug or have a feature request?
[Open an issue](../../issues) or submit a pull request.

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

##

Built with ❤️ for Bangladesh 🇧🇩

