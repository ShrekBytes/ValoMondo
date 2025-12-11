<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Product, Restaurant, Shop, School, University, Hospital, Hotel, TouristSpot, Technician, Website, Manufacturer};
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ItemController extends Controller
{
    /**
     * Map category slugs to model classes
     */
    private function getModelClass($categorySlug)
    {
        $categoryModelMap = [
            'products' => Product::class,
            'restaurants' => Restaurant::class,
            'shops' => Shop::class,
            'manufacturers' => Manufacturer::class,
            'schools' => School::class,
            'universities' => University::class,
            'hospitals' => Hospital::class,
            'hotels' => Hotel::class,
            'tourist-spots' => TouristSpot::class,
            'technicians' => Technician::class,
            'websites' => Website::class,
        ];

        return $categoryModelMap[$categorySlug] ?? null;
    }

    /**
     * Store a new item (generic endpoint for all categories)
     */
    public function store(Request $request)
    {
        $category = $request->input('category');
        
        if (!$category) {
            return response()->json([
                'message' => 'Category is required',
            ], 400);
        }

        $modelClass = $this->getModelClass($category);
        
        if (!$modelClass) {
            return response()->json([
                'message' => 'Invalid category',
            ], 400);
        }

        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        // Get fillable fields from the model
        $model = new $modelClass();
        $fillable = $model->getFillable();
        
        // Prepare validation rules
        $rules = [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:' . (new $modelClass())->getTable() . ',slug',
            'description' => 'nullable|string',
            'images.*' => 'nullable|image|max:5120',
            // Common fields for most categories
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'division' => 'nullable|string|max:255',
            'district' => 'nullable|string|max:255',
            'area' => 'nullable|string|max:255',
            'address' => 'nullable|string',
        ];

        // Category-specific validation rules
        if ($category === 'products') {
            $rules['price'] = 'nullable|numeric|min:0';
            $rules['manufacturer_id'] = 'nullable|exists:manufacturers,id';
        }

        if ($category === 'websites') {
            $rules['url'] = 'required|url|unique:websites,url';
            $rules['website_type'] = 'nullable|string';
            $rules['organization'] = 'nullable|string';
            $rules['total_employees'] = 'nullable|integer|min:0';
            $rules['delivery_rate'] = 'nullable|numeric|min:0';
            $rules['office_time'] = 'nullable|string';
            // Accept boolean as string from FormData (1/0, true/false, etc.)
            $rules['has_physical_store'] = 'nullable';
        }

        if ($category === 'technicians') {
            $rules['technician_type'] = 'nullable|string';
            $rules['hourly_rate'] = 'nullable|numeric|min:0';
            $rules['specialized_fields'] = 'nullable';
            $rules['portfolio_link'] = 'nullable|url';
        }

        if ($category === 'shops') {
            $rules['shop_type'] = 'nullable|string';
            $rules['payment_types'] = 'nullable';
            // Accept boolean as string from FormData (1/0, true/false, etc.)
            $rules['does_delivery'] = 'nullable';
            $rules['branches'] = 'nullable';
            $rules['famous_for'] = 'nullable|string';
        }

        if ($category === 'universities') {
            $rules['help_desk_phone'] = 'nullable|string';
            $rules['admission_office_phone'] = 'nullable|string';
            $rules['courses_offered'] = 'nullable';
            $rules['famous_for_courses'] = 'nullable';
            $rules['university_grade'] = 'nullable|string';
            $rules['organization'] = 'nullable|string';
            $rules['total_faculty'] = 'nullable|integer|min:0';
            $rules['vice_chancellor'] = 'nullable|string';
        }

        $validated = $request->validate($rules);

        // Ensure common fields are included in validated data if they exist in the request
        $commonFields = ['phone', 'email', 'website', 'division', 'district', 'area', 'address'];
        foreach ($commonFields as $field) {
            if ($request->has($field) && in_array($field, $fillable)) {
                $validated[$field] = $request->input($field);
            }
        }

        // Process website-specific fields
        if ($category === 'websites') {
            // Convert payment_methods from string/array to array
            if ($request->has('payment_methods')) {
                $paymentMethods = $request->input('payment_methods');
                if (is_string($paymentMethods)) {
                    // Split comma-separated string
                    $validated['payment_methods'] = array_filter(
                        array_map('trim', explode(',', $paymentMethods))
                    );
                } elseif (is_array($paymentMethods)) {
                    $validated['payment_methods'] = array_filter($paymentMethods);
                }
            }

            // Convert other_domains from string/array to array
            if ($request->has('other_domains')) {
                $otherDomains = $request->input('other_domains');
                if (is_string($otherDomains)) {
                    // Split newline-separated string
                    $validated['other_domains'] = array_filter(
                        array_map('trim', explode("\n", $otherDomains))
                    );
                } elseif (is_array($otherDomains)) {
                    $validated['other_domains'] = array_filter($otherDomains);
                }
            }

            // Ensure has_physical_store is boolean
            // Handle both string and boolean values from FormData
            if ($request->has('has_physical_store')) {
                $hasPhysicalStore = $request->input('has_physical_store');
                // Convert string "1"/"0" or boolean true/false to proper boolean
                if (is_string($hasPhysicalStore)) {
                    $validated['has_physical_store'] = in_array(strtolower($hasPhysicalStore), ['1', 'true', 'yes', 'on'], true);
                } else {
                    $validated['has_physical_store'] = filter_var($hasPhysicalStore, FILTER_VALIDATE_BOOLEAN);
                }
            } else {
                // Default to false if not provided
                $validated['has_physical_store'] = false;
            }
        }

        // Process technician-specific fields
        if ($category === 'technicians') {
            // Convert specialized_fields from string/array to array
            if ($request->has('specialized_fields')) {
                $specializedFields = $request->input('specialized_fields');
                if (is_string($specializedFields)) {
                    // Split comma-separated string
                    $validated['specialized_fields'] = array_filter(
                        array_map('trim', explode(',', $specializedFields))
                    );
                } elseif (is_array($specializedFields)) {
                    $validated['specialized_fields'] = array_filter($specializedFields);
                }
            }
        }

        // Process shop-specific fields
        if ($category === 'shops') {
            // Convert payment_types from string/array to array
            if ($request->has('payment_types')) {
                $paymentTypes = $request->input('payment_types');
                if (is_string($paymentTypes)) {
                    $validated['payment_types'] = array_filter(
                        array_map('trim', explode(',', $paymentTypes))
                    );
                } elseif (is_array($paymentTypes)) {
                    $validated['payment_types'] = array_filter($paymentTypes);
                }
            }

            // Convert branches from string/array to array
            if ($request->has('branches')) {
                $branches = $request->input('branches');
                if (is_string($branches)) {
                    $validated['branches'] = array_filter(
                        array_map('trim', explode("\n", $branches))
                    );
                } elseif (is_array($branches)) {
                    $validated['branches'] = array_filter($branches);
                }
            }

            // Ensure does_delivery is boolean
            // Handle both string and boolean values from FormData
            if ($request->has('does_delivery')) {
                $doesDelivery = $request->input('does_delivery');
                // Convert string "1"/"0" or boolean true/false to proper boolean
                if (is_string($doesDelivery)) {
                    $validated['does_delivery'] = in_array(strtolower($doesDelivery), ['1', 'true', 'yes', 'on'], true);
                } else {
                    $validated['does_delivery'] = filter_var($doesDelivery, FILTER_VALIDATE_BOOLEAN);
                }
            } else {
                // Default to false if not provided
                $validated['does_delivery'] = false;
            }
        }

        // Process university-specific fields
        if ($category === 'universities') {
            // Convert courses_offered from string/array to array
            if ($request->has('courses_offered')) {
                $coursesOffered = $request->input('courses_offered');
                if (is_string($coursesOffered)) {
                    $validated['courses_offered'] = array_filter(
                        array_map('trim', explode("\n", $coursesOffered))
                    );
                } elseif (is_array($coursesOffered)) {
                    $validated['courses_offered'] = array_filter($coursesOffered);
                }
            }

            // Convert famous_for_courses from string/array to array
            if ($request->has('famous_for_courses')) {
                $famousForCourses = $request->input('famous_for_courses');
                if (is_string($famousForCourses)) {
                    $validated['famous_for_courses'] = array_filter(
                        array_map('trim', explode(',', $famousForCourses))
                    );
                } elseif (is_array($famousForCourses)) {
                    $validated['famous_for_courses'] = array_filter($famousForCourses);
                }
            }
        }

        // Check if user is a moderator or admin - auto-approve their submissions
        if ($user->isModeratorOrAdmin()) {
            $validated['status'] = 'approved';
            $validated['approved_at'] = now();
            $validated['approved_by'] = $user->id;
            $message = 'Item published successfully';
        } else {
            $validated['status'] = 'pending';
            $message = 'Item submitted for review';
        }

        $validated['last_info_updated'] = now();
        $validated['last_updated_at'] = now();

        // Filter validated data to only include fillable fields
        $dataToCreate = array_intersect_key($validated, array_flip($fillable));

        $item = $modelClass::create($dataToCreate);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $item->addMedia($image)
                    ->toMediaCollection('images');
            }
        }

        return response()->json([
            'message' => $message,
            'item' => $item->load('media'),
            'auto_approved' => $user->isModeratorOrAdmin(),
        ], 201);
    }

    /**
     * Delete an item (moderators and admins only)
     */
    public function destroy(Request $request, $category, $id)
    {
        $user = $request->user();
        
        // Check if user is moderator or admin
        if (!$user->isModeratorOrAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only moderators and admins can delete items.',
            ], 403);
        }

        $modelClass = $this->getModelClass($category);
        
        if (!$modelClass) {
            return response()->json([
                'message' => 'Invalid category',
            ], 400);
        }

        $item = $modelClass::find($id);
        
        if (!$item) {
            return response()->json([
                'message' => 'Item not found',
            ], 404);
        }

        // Delete the item (soft delete if available)
        $item->delete();

        return response()->json([
            'message' => 'Item deleted successfully',
        ]);
    }
}
