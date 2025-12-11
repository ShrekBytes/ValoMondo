<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Products',
                'slug' => 'products',
                'model_type' => 'App\\Models\\Product',
                'description' => 'All kinds of products including food items, electronics, and more',
                'icon' => 'shopping-bag',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Restaurants',
                'slug' => 'restaurants',
                'model_type' => 'App\\Models\\Restaurant',
                'description' => 'Restaurants and food places across Bangladesh',
                'icon' => 'utensils',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Shops',
                'slug' => 'shops',
                'model_type' => 'App\\Models\\Shop',
                'description' => 'Retail shops and stores',
                'icon' => 'store',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Manufacturers',
                'slug' => 'manufacturers',
                'model_type' => 'App\\Models\\Manufacturer',
                'description' => 'Product manufacturers and brands',
                'icon' => 'industry',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Schools',
                'slug' => 'schools',
                'model_type' => 'App\\Models\\School',
                'description' => 'Educational institutions - schools',
                'icon' => 'school',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Universities',
                'slug' => 'universities',
                'model_type' => 'App\\Models\\University',
                'description' => 'Universities and colleges',
                'icon' => 'graduation-cap',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Hospitals',
                'slug' => 'hospitals',
                'model_type' => 'App\\Models\\Hospital',
                'description' => 'Hospitals, clinics, and medical centers',
                'icon' => 'hospital',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'Tourist Spots',
                'slug' => 'tourist-spots',
                'model_type' => 'App\\Models\\TouristSpot',
                'description' => 'Tourist destinations and attractions',
                'icon' => 'map-marked-alt',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name' => 'Hotels',
                'slug' => 'hotels',
                'model_type' => 'App\\Models\\Hotel',
                'description' => 'Hotels and accommodations',
                'icon' => 'hotel',
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'name' => 'Technicians',
                'slug' => 'technicians',
                'model_type' => 'App\\Models\\Technician',
                'description' => 'Service technicians and professionals',
                'icon' => 'tools',
                'is_active' => true,
                'sort_order' => 10,
            ],
            [
                'name' => 'Websites',
                'slug' => 'websites',
                'model_type' => 'App\\Models\\Website',
                'description' => 'Websites and online services',
                'icon' => 'globe',
                'is_active' => true,
                'sort_order' => 11,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}

