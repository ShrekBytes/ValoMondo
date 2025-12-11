'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { categories, products } from '@/lib/api';
import Link from 'next/link';
import { useAuthToken } from '@/lib/useAuthToken';

export default function SubmitPage() {
  const { data: session } = useSession();
  const token = useAuthToken();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categories.getAll();
      return response.data.categories;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Get token from localStorage (synced by useAuthToken hook)
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error('No authentication token available. Please login again.');
      }

      // Create form data for file upload
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(data).forEach(key => {
        const value = data[key];
        
        // Handle boolean values - always include them, convert to string "1" or "0" for FormData
        if (typeof value === 'boolean') {
          formDataToSend.append(key, value ? '1' : '0');
          return;
        }
        
        // Skip null and undefined, but allow empty strings for location/contact fields
        // (empty strings will be saved as empty, which is fine for optional fields)
        if (value === null || value === undefined) {
          return;
        }
        
        // Handle arrays - convert to JSON string
        if (Array.isArray(value)) {
          // Only append non-empty arrays
          if (value.length > 0) {
            formDataToSend.append(key, JSON.stringify(value));
          }
        }
        // Handle other values (including empty strings for optional fields)
        else {
          formDataToSend.append(key, String(value));
        }
      });

      // Add images
      images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      // Determine API endpoint based on category
      const endpoint = data.category === 'products' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/products`
        : `${process.env.NEXT_PUBLIC_API_URL}/items`;

      // Make API call with token
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to submit: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.auto_approved) {
        alert('Item published successfully! It is now live on the site.');
      } else {
        alert('Item submitted successfully! It will be reviewed by moderators.');
      }
      router.push('/');
    },
    onError: (err: any) => {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit item');
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
      setError('You need to be logged in to submit items. Please login again.');
      return;
    }

    // Create slug from name
    const slug = formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Prepare data for submission
    let submitData = {
      ...formData,
      slug,
      category: selectedCategory,
    };

    // Process website-specific fields
    if (selectedCategory === 'websites') {
      // Convert payment_methods from comma-separated string to array
      if (submitData.payment_methods && typeof submitData.payment_methods === 'string') {
        submitData.payment_methods = submitData.payment_methods
          .split(',')
          .map((method: string) => method.trim())
          .filter((method: string) => method.length > 0);
      }

      // Convert other_domains from newline-separated string to array
      if (submitData.other_domains && typeof submitData.other_domains === 'string') {
        submitData.other_domains = submitData.other_domains
          .split('\n')
          .map((domain: string) => domain.trim())
          .filter((domain: string) => domain.length > 0);
      }

      // Map 'website' to 'url' if it exists
      if (submitData.website) {
        submitData.url = submitData.website;
        delete submitData.website;
      }

      // Ensure has_physical_store is boolean
      submitData.has_physical_store = !!submitData.has_physical_store;
    }

    // Process technician-specific fields
    if (selectedCategory === 'technicians') {
      // Convert specialized_fields from comma-separated string to array
      if (submitData.specialized_fields && typeof submitData.specialized_fields === 'string') {
        submitData.specialized_fields = submitData.specialized_fields
          .split(',')
          .map((field: string) => field.trim())
          .filter((field: string) => field.length > 0);
      }
    }

    // Process shop-specific fields
    if (selectedCategory === 'shops') {
      // Convert payment_types from comma-separated string to array
      if (submitData.payment_types && typeof submitData.payment_types === 'string') {
        submitData.payment_types = submitData.payment_types
          .split(',')
          .map((type: string) => type.trim())
          .filter((type: string) => type.length > 0);
      }

      // Convert branches from newline-separated string to array
      if (submitData.branches && typeof submitData.branches === 'string') {
        submitData.branches = submitData.branches
          .split('\n')
          .map((branch: string) => branch.trim())
          .filter((branch: string) => branch.length > 0);
      }

      // Ensure does_delivery is boolean
      submitData.does_delivery = !!submitData.does_delivery;
    }

    // Process university-specific fields
    if (selectedCategory === 'universities') {
      // Convert courses_offered from newline-separated string to array
      if (submitData.courses_offered && typeof submitData.courses_offered === 'string') {
        submitData.courses_offered = submitData.courses_offered
          .split('\n')
          .map((course: string) => course.trim())
          .filter((course: string) => course.length > 0);
      }

      // Convert famous_for_courses from comma-separated string to array
      if (submitData.famous_for_courses && typeof submitData.famous_for_courses === 'string') {
        submitData.famous_for_courses = submitData.famous_for_courses
          .split(',')
          .map((course: string) => course.trim())
          .filter((course: string) => course.length > 0);
      }
    }

    mutation.mutate(submitData);
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit an Item</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to submit items
          </p>
          <Link href="/login" className="btn btn-primary">
            Login to Submit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit an Item</h1>
        <p className="text-gray-600 mb-8">
          Share information about products, places, or services in Bangladesh
        </p>

        {session?.user?.is_moderator && (
          <div className="mb-6 p-4 bg-primary-50 border-2 border-primary-300 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🛡️</span>
              <div>
                <h3 className="font-semibold text-primary-900">Moderator Privileges Active</h3>
                <p className="text-sm text-primary-800">
                  Your submissions will be published immediately without review
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">1. Select Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categoriesData?.map((cat: any) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === cat.slug
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{getCategoryIcon(cat.icon)}</div>
                  <div className="font-medium text-sm">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          {selectedCategory && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">2. Item Details</h2>
              <div className="space-y-4">
                {/* Basic Fields (Common to all categories) */}
                <div>
                  <label className="label">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="Enter item name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Describe the item..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="label">
                    Images / Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-50 file:text-primary-700
                      hover:file:bg-primary-100
                      cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload images or logo (max 5 images, each up to 5MB)
                  </p>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = images.filter((_, i) => i !== index);
                              const newPreviews = imagePreviews.filter((_, i) => i !== index);
                              setImages(newImages);
                              setImagePreviews(newPreviews);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category-specific fields */}
                {selectedCategory === 'products' && (
                  <>
                    <div>
                      <label className="label">Price (BDT)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="input"
                        placeholder="0.00"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Barcode</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Product barcode"
                        value={formData.barcode || ''}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {selectedCategory === 'technicians' && (
                  <>
                    <div>
                      <label className="label">Technician Type</label>
                      <select
                        className="input"
                        value={formData.technician_type || ''}
                        onChange={(e) => setFormData({ ...formData, technician_type: e.target.value })}
                      >
                        <option value="">Select type...</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Electrician">Electrician</option>
                        <option value="AC Technician">AC Technician</option>
                        <option value="Programmer">Programmer</option>
                        <option value="Web Developer">Web Developer</option>
                        <option value="Mobile App Developer">Mobile App Developer</option>
                        <option value="Video Editor">Video Editor</option>
                        <option value="Graphic Designer">Graphic Designer</option>
                        <option value="Photographer">Photographer</option>
                        <option value="Carpenter">Carpenter</option>
                        <option value="Mechanic">Mechanic</option>
                        <option value="Painter">Painter</option>
                        <option value="Tailor">Tailor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Hourly Rate (BDT)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="input"
                        placeholder="0.00"
                        value={formData.hourly_rate || ''}
                        onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Specialized Fields (comma-separated)</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., React, Node.js, Laravel, Python"
                        value={formData.specialized_fields || ''}
                        onChange={(e) => setFormData({ ...formData, specialized_fields: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple fields with commas</p>
                    </div>
                    <div>
                      <label className="label">Portfolio Link</label>
                      <input
                        type="url"
                        className="input"
                        placeholder="https://portfolio.example.com"
                        value={formData.portfolio_link || ''}
                        onChange={(e) => setFormData({ ...formData, portfolio_link: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {selectedCategory === 'shops' && (
                  <>
                    <div>
                      <label className="label">Shop Type</label>
                      <select
                        className="input"
                        value={formData.shop_type || ''}
                        onChange={(e) => setFormData({ ...formData, shop_type: e.target.value })}
                      >
                        <option value="">Select type...</option>
                        <option value="Cosmetics">Cosmetics</option>
                        <option value="Meat Shop">Meat Shop</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Stationery">Stationery</option>
                        <option value="Bookstore">Bookstore</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Mobile & Accessories">Mobile & Accessories</option>
                        <option value="Computer & IT">Computer & IT</option>
                        <option value="Sports & Fitness">Sports & Fitness</option>
                        <option value="Toys & Games">Toys & Games</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                        <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                        <option value="Pet Supplies">Pet Supplies</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Gift Shop">Gift Shop</option>
                        <option value="Convenience Store">Convenience Store</option>
                        <option value="Supermarket">Supermarket</option>
                        <option value="Department Store">Department Store</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Payment Types (comma-separated)</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., Cash, bKash, Nagad, Card, Mobile Banking"
                        value={formData.payment_types || ''}
                        onChange={(e) => setFormData({ ...formData, payment_types: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple payment types with commas</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="does_delivery"
                        checked={formData.does_delivery || false}
                        onChange={(e) => setFormData({ ...formData, does_delivery: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="does_delivery" className="text-sm text-gray-700">
                        Does Delivery
                      </label>
                    </div>
                    <div>
                      <label className="label">Branches (one per line)</label>
                      <textarea
                        className="input min-h-[80px]"
                        placeholder="Branch 1 Address&#10;Branch 2 Address&#10;Branch 3 Address"
                        value={formData.branches || ''}
                        onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter one branch address per line</p>
                    </div>
                    <div>
                      <label className="label">Famous For</label>
                      <textarea
                        className="input min-h-[60px]"
                        placeholder="What is this shop famous for? e.g., Best prices, Quality products, Fast delivery"
                        value={formData.famous_for || ''}
                        onChange={(e) => setFormData({ ...formData, famous_for: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {selectedCategory === 'universities' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Help Desk / Information Desk Phone</label>
                        <input
                          type="tel"
                          className="input"
                          placeholder="+880..."
                          value={formData.help_desk_phone || ''}
                          onChange={(e) => setFormData({ ...formData, help_desk_phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Admission Office Phone</label>
                        <input
                          type="tel"
                          className="input"
                          placeholder="+880..."
                          value={formData.admission_office_phone || ''}
                          onChange={(e) => setFormData({ ...formData, admission_office_phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Courses/Programs (one per line)</label>
                      <textarea
                        className="input min-h-[100px]"
                        placeholder="Computer Science&#10;Electrical Engineering&#10;Business Administration"
                        value={formData.courses_offered || ''}
                        onChange={(e) => setFormData({ ...formData, courses_offered: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter one course per line</p>
                    </div>
                    <div>
                      <label className="label">Famous/Best For Courses (comma-separated)</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., Computer Science, Engineering, Business"
                        value={formData.famous_for_courses || ''}
                        onChange={(e) => setFormData({ ...formData, famous_for_courses: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple courses with commas</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">University Grade</label>
                        <select
                          className="input"
                          value={formData.university_grade || ''}
                          onChange={(e) => setFormData({ ...formData, university_grade: e.target.value })}
                        >
                          <option value="">Select grade...</option>
                          <option value="A+">A+</option>
                          <option value="A">A</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="B-">B-</option>
                          <option value="C+">C+</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Organization</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="University organization/affiliation"
                          value={formData.organization || ''}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Total Faculty</label>
                        <input
                          type="number"
                          className="input"
                          placeholder="Number of faculty members"
                          value={formData.total_faculty || ''}
                          onChange={(e) => setFormData({ ...formData, total_faculty: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Vice Chancellor / CEO</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Name of Vice Chancellor"
                          value={formData.vice_chancellor || ''}
                          onChange={(e) => setFormData({ ...formData, vice_chancellor: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Location fields (for most categories) */}
                {!['websites'].includes(selectedCategory) && (
                  <>
                    <h3 className="font-semibold text-lg mt-6 mb-2">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="label">Division</label>
                        <select
                          className="input"
                          value={formData.division || ''}
                          onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                        >
                          <option value="">Select...</option>
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Barisal">Barisal</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Rangpur">Rangpur</option>
                          <option value="Mymensingh">Mymensingh</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">District</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="District"
                          value={formData.district || ''}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Area</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Area/Locality"
                          value={formData.area || ''}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Full Address</label>
                      <textarea
                        className="input"
                        placeholder="Complete address..."
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {/* Website-specific fields */}
                {selectedCategory === 'websites' && (
                  <>
                    <h3 className="font-semibold text-lg mt-6 mb-2">Website Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Website Type</label>
                        <select
                          className="input"
                          value={formData.website_type || ''}
                          onChange={(e) => setFormData({ ...formData, website_type: e.target.value })}
                        >
                          <option value="">Select type...</option>
                          <option value="E-commerce">E-commerce</option>
                          <option value="News">News</option>
                          <option value="Education">Education</option>
                          <option value="Government">Government</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Business">Business</option>
                          <option value="Service">Service</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Organization</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Organization name"
                          value={formData.organization || ''}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Total Employees</label>
                        <input
                          type="number"
                          className="input"
                          placeholder="Number of employees"
                          value={formData.total_employees || ''}
                          onChange={(e) => setFormData({ ...formData, total_employees: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Delivery Rate (BDT)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="input"
                          placeholder="0.00"
                          value={formData.delivery_rate || ''}
                          onChange={(e) => setFormData({ ...formData, delivery_rate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Office Time</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., 9 AM - 6 PM, Sat-Thu"
                        value={formData.office_time || ''}
                        onChange={(e) => setFormData({ ...formData, office_time: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="label">Payment Methods (comma-separated)</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="bKash, Nagad, Card, Cash on Delivery"
                        value={formData.payment_methods || ''}
                        onChange={(e) => setFormData({ ...formData, payment_methods: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple methods with commas</p>
                    </div>

                    <div>
                      <label className="label">Other Domains (one per line)</label>
                      <textarea
                        className="input min-h-[80px]"
                        placeholder="https://example.com&#10;https://www.example.com"
                        value={formData.other_domains || ''}
                        onChange={(e) => setFormData({ ...formData, other_domains: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter one domain per line</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="has_physical_store"
                        checked={formData.has_physical_store || false}
                        onChange={(e) => setFormData({ ...formData, has_physical_store: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="has_physical_store" className="text-sm text-gray-700">
                        Has Physical Store
                      </label>
                    </div>

                    {/* Physical Location (shown if has_physical_store is checked) */}
                    {formData.has_physical_store && (
                      <>
                        <h4 className="font-semibold text-md mt-4 mb-2">Physical Location</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="label">Division</label>
                            <select
                              className="input"
                              value={formData.division || ''}
                              onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                            >
                              <option value="">Select...</option>
                              <option value="Dhaka">Dhaka</option>
                              <option value="Chittagong">Chittagong</option>
                              <option value="Rajshahi">Rajshahi</option>
                              <option value="Khulna">Khulna</option>
                              <option value="Barisal">Barisal</option>
                              <option value="Sylhet">Sylhet</option>
                              <option value="Rangpur">Rangpur</option>
                              <option value="Mymensingh">Mymensingh</option>
                            </select>
                          </div>
                          <div>
                            <label className="label">District</label>
                            <input
                              type="text"
                              className="input"
                              placeholder="District"
                              value={formData.district || ''}
                              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="label">Area</label>
                            <input
                              type="text"
                              className="input"
                              placeholder="Area/Locality"
                              value={formData.area || ''}
                              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="label">Full Address</label>
                          <textarea
                            className="input"
                            placeholder="Complete address..."
                            value={formData.address || ''}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Contact fields */}
                {!['products', 'websites', 'universities'].includes(selectedCategory) && (
                  <>
                    <h3 className="font-semibold text-lg mt-6 mb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Phone</label>
                        <input
                          type="tel"
                          className="input"
                          placeholder="+880..."
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Email</label>
                        <input
                          type="email"
                          className="input"
                          placeholder="email@example.com"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Website</label>
                      <input
                        type="url"
                        className="input"
                        placeholder="https://..."
                        value={formData.website || ''}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {/* Contact fields for universities */}
                {selectedCategory === 'universities' && (
                  <>
                    <h3 className="font-semibold text-lg mt-6 mb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Email</label>
                        <input
                          type="email"
                          className="input"
                          placeholder="email@example.com"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Website</label>
                        <input
                          type="url"
                          className="input"
                          placeholder="https://..."
                          value={formData.website || ''}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Contact fields for websites */}
                {selectedCategory === 'websites' && (
                  <>
                    <h3 className="font-semibold text-lg mt-6 mb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Phone</label>
                        <input
                          type="tel"
                          className="input"
                          placeholder="+880..."
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Email</label>
                        <input
                          type="email"
                          className="input"
                          placeholder="email@example.com"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {selectedCategory && (
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="btn btn-primary flex-1"
              >
                {mutation.isPending 
                  ? 'Submitting...' 
                  : session?.user?.is_moderator 
                    ? 'Publish Item' 
                    : 'Submit for Review'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Submission Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Provide accurate and complete information</li>
            {session?.user?.is_moderator ? (
              <>
                <li>• ✨ As a moderator, your submissions will be published immediately</li>
                <li>• Your items will be visible to all users instantly</li>
              </>
            ) : (
              <>
                <li>• Your submission will be reviewed by moderators</li>
                <li>• Approved items will be visible to all users</li>
              </>
            )}
            <li>• You can edit your submissions later</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(iconName: string) {
  const icons: { [key: string]: string } = {
    'shopping-bag': '🛍️',
    'utensils': '🍽️',
    'store': '🏪',
    'industry': '🏭',
    'school': '🏫',
    'graduation-cap': '🎓',
    'hospital': '🏥',
    'map-marked-alt': '🗺️',
    'hotel': '🏨',
    'tools': '🔧',
    'globe': '🌐',
  };
  return icons[iconName] || '📦';
}

