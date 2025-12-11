'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { categories, itemUpdates, items } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UpdateItemPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  const itemSlug = params.slug as string;
  const { data: session } = useSession();

  const [formData, setFormData] = useState<any>({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Map category slugs to model class names
  const getModelClass = (slug: string): string => {
    const categoryModelMap: { [key: string]: string } = {
      'products': 'Product',
      'restaurants': 'Restaurant',
      'shops': 'Shop',
      'manufacturers': 'Manufacturer',
      'schools': 'School',
      'universities': 'University',
      'hospitals': 'Hospital',
      'hotels': 'Hotel',
      'tourist-spots': 'TouristSpot',
      'technicians': 'Technician',
      'websites': 'Website',
    };
    return categoryModelMap[slug] || 'Product';
  };

  const { data: item, isLoading } = useQuery({
    queryKey: ['categoryItem', categorySlug, itemSlug],
    queryFn: async () => {
      const response = await categories.getItemBySlug(categorySlug, itemSlug);
      const itemData = response.data.data || response.data;
      return itemData;
    },
  });

  // Initialize form data when item is loaded
  useEffect(() => {
    if (!item) return;

    // Initialize form data - convert arrays to strings for form inputs
    const initialData: any = {
      name: item.name || '',
      description: item.description || '',
    };

    // Handle category-specific fields
    if (categorySlug === 'products') {
      initialData.price = item.price != null ? String(item.price) : '';
      initialData.barcode = item.barcode || '';
    }

    if (categorySlug === 'technicians') {
      initialData.technician_type = item.technician_type || '';
      initialData.hourly_rate = item.hourly_rate != null ? String(item.hourly_rate) : '';
      initialData.specialized_fields = Array.isArray(item.specialized_fields) 
        ? item.specialized_fields.join(', ') 
        : (item.specialized_fields || '');
      initialData.portfolio_link = item.portfolio_link || '';
      initialData.phone = item.phone || '';
      initialData.email = item.email || '';
      initialData.website = item.website || '';
    }

    if (categorySlug === 'shops') {
      initialData.shop_type = item.shop_type || '';
      initialData.payment_types = Array.isArray(item.payment_types) 
        ? item.payment_types.join(', ') 
        : (item.payment_types || '');
      initialData.does_delivery = item.does_delivery === true || item.does_delivery === 1 || item.does_delivery === '1';
      initialData.branches = Array.isArray(item.branches) 
        ? item.branches.join('\n') 
        : (item.branches || '');
      initialData.famous_for = item.famous_for || '';
      initialData.phone = item.phone || '';
      initialData.email = item.email || '';
      initialData.website = item.website || '';
    }

    if (categorySlug === 'universities') {
      initialData.help_desk_phone = item.help_desk_phone || '';
      initialData.admission_office_phone = item.admission_office_phone || '';
      initialData.courses_offered = Array.isArray(item.courses_offered) 
        ? item.courses_offered.join('\n') 
        : (item.courses_offered || '');
      initialData.famous_for_courses = Array.isArray(item.famous_for_courses) 
        ? item.famous_for_courses.join(', ') 
        : (item.famous_for_courses || '');
      initialData.university_grade = item.university_grade || '';
      initialData.organization = item.organization || '';
      initialData.total_faculty = item.total_faculty != null ? String(item.total_faculty) : '';
      initialData.vice_chancellor = item.vice_chancellor || '';
      initialData.email = item.email || '';
      initialData.website = item.website || '';
    }

    if (categorySlug === 'websites') {
      initialData.url = item.url || '';
      initialData.website_type = item.website_type || '';
      initialData.organization = item.organization || '';
      initialData.total_employees = item.total_employees != null ? String(item.total_employees) : '';
      initialData.delivery_rate = item.delivery_rate != null ? String(item.delivery_rate) : '';
      initialData.office_time = item.office_time || '';
      initialData.payment_methods = Array.isArray(item.payment_methods) 
        ? item.payment_methods.join(', ') 
        : (item.payment_methods || '');
      initialData.other_domains = Array.isArray(item.other_domains) 
        ? item.other_domains.join('\n') 
        : (item.other_domains || '');
      initialData.has_physical_store = item.has_physical_store === true || item.has_physical_store === 1 || item.has_physical_store === '1';
      initialData.phone = item.phone || '';
      initialData.email = item.email || '';
    }

    // Location fields (for most categories)
    if (categorySlug !== 'websites') {
      initialData.division = item.division || '';
      initialData.district = item.district || '';
      initialData.area = item.area || '';
      initialData.address = item.address || '';
    } else if (item.has_physical_store) {
      // Websites only show location if has_physical_store is true
      initialData.division = item.division || '';
      initialData.district = item.district || '';
      initialData.area = item.area || '';
      initialData.address = item.address || '';
    }
    
    setFormData(initialData);
  }, [item, categorySlug]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error('No authentication token available. Please login again.');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('item_type', data.item_type);
      formDataToSend.append('item_id', data.item_id);
      
      Object.keys(data.proposed_data).forEach(key => {
        const value = data.proposed_data[key];
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'boolean') {
            formDataToSend.append(`proposed_data[${key}]`, value ? '1' : '0');
          } else if (Array.isArray(value)) {
            formDataToSend.append(`proposed_data[${key}]`, JSON.stringify(value));
          } else {
            formDataToSend.append(`proposed_data[${key}]`, String(value));
          }
        }
      });

      images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-updates`, {
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
    onSuccess: (response) => {
      if (response.auto_approved) {
        alert('Item information updated successfully!');
      } else {
        alert('Update request submitted successfully! Moderators will review your changes.');
      }
      router.push(`/${categorySlug}/${itemSlug}`);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to submit update. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!item) throw new Error('Item not found');
      return items.delete(categorySlug, item.id);
    },
    onSuccess: () => {
      alert('Item deleted successfully!');
      router.push(`/${categorySlug}`);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || 'Failed to delete item. Please try again.');
    },
  });

  const handleDelete = () => {
    if (!item) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    // Process the form data exactly like submit page
    const processedData: any = { ...formData };

    // Process website-specific fields
    if (categorySlug === 'websites') {
      if (processedData.payment_methods && typeof processedData.payment_methods === 'string') {
        processedData.payment_methods = processedData.payment_methods
          .split(',')
          .map((method: string) => method.trim())
          .filter((method: string) => method.length > 0);
      }
      if (processedData.other_domains && typeof processedData.other_domains === 'string') {
        processedData.other_domains = processedData.other_domains
          .split('\n')
          .map((domain: string) => domain.trim())
          .filter((domain: string) => domain.length > 0);
      }
      processedData.has_physical_store = !!processedData.has_physical_store;
    }

    // Process technician-specific fields
    if (categorySlug === 'technicians') {
      if (processedData.specialized_fields && typeof processedData.specialized_fields === 'string') {
        processedData.specialized_fields = processedData.specialized_fields
          .split(',')
          .map((field: string) => field.trim())
          .filter((field: string) => field.length > 0);
      }
    }

    // Process shop-specific fields
    if (categorySlug === 'shops') {
      if (processedData.payment_types && typeof processedData.payment_types === 'string') {
        processedData.payment_types = processedData.payment_types
          .split(',')
          .map((type: string) => type.trim())
          .filter((type: string) => type.length > 0);
      }
      if (processedData.branches && typeof processedData.branches === 'string') {
        processedData.branches = processedData.branches
          .split('\n')
          .map((branch: string) => branch.trim())
          .filter((branch: string) => branch.length > 0);
      }
      processedData.does_delivery = !!processedData.does_delivery;
    }

    // Process university-specific fields
    if (categorySlug === 'universities') {
      if (processedData.courses_offered && typeof processedData.courses_offered === 'string') {
        processedData.courses_offered = processedData.courses_offered
          .split('\n')
          .map((course: string) => course.trim())
          .filter((course: string) => course.length > 0);
      }
      if (processedData.famous_for_courses && typeof processedData.famous_for_courses === 'string') {
        processedData.famous_for_courses = processedData.famous_for_courses
          .split(',')
          .map((course: string) => course.trim())
          .filter((course: string) => course.length > 0);
      }
    }

    mutation.mutate({
      item_type: getModelClass(categorySlug),
      item_id: item.id,
      proposed_data: processedData,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to update item information.</p>
          <Link href="/login" className="btn btn-primary mt-4">Login</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Item not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Update {item.name}</h1>
        <p className="text-gray-600 mb-6">
          {session.user.is_moderator || session.user.is_admin
            ? 'Your changes will be applied immediately.'
            : 'Your proposed changes will be reviewed by moderators before being applied.'}
        </p>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Basic Fields */}
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
              onChange={handleChange}
              name="name"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[100px]"
              placeholder="Describe the item..."
              value={formData.description || ''}
              onChange={handleChange}
              name="description"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">Images / Logo</label>
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
              Upload new images to replace existing ones (optional)
            </p>

            {/* Current Images */}
            {item && item.images && item.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {item.images.map((image: any, index: number) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Current ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">New Images (Preview):</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-primary-300"
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
              </div>
            )}
          </div>

          {/* Category-specific fields - Products */}
          {categorySlug === 'products' && (
            <>
              <div>
                <label className="label">Price (BDT)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  placeholder="0.00"
                  value={formData.price || ''}
                  onChange={handleChange}
                  name="price"
                />
              </div>
              <div>
                <label className="label">Barcode</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Product barcode"
                  value={formData.barcode || ''}
                  onChange={handleChange}
                  name="barcode"
                />
              </div>
            </>
          )}

          {/* Category-specific fields - Technicians */}
          {categorySlug === 'technicians' && (
            <>
              <div>
                <label className="label">Technician Type</label>
                <select
                  className="input"
                  value={formData.technician_type || ''}
                  onChange={handleChange}
                  name="technician_type"
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
                  onChange={handleChange}
                  name="hourly_rate"
                />
              </div>
              <div>
                <label className="label">Specialized Fields (comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., React, Node.js, Laravel, Python"
                  value={formData.specialized_fields || ''}
                  onChange={handleChange}
                  name="specialized_fields"
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
                  onChange={handleChange}
                  name="portfolio_link"
                />
              </div>
            </>
          )}

          {/* Category-specific fields - Shops */}
          {categorySlug === 'shops' && (
            <>
              <div>
                <label className="label">Shop Type</label>
                <select
                  className="input"
                  value={formData.shop_type || ''}
                  onChange={handleChange}
                  name="shop_type"
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
                  onChange={handleChange}
                  name="payment_types"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple payment types with commas</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="does_delivery"
                  checked={formData.does_delivery || false}
                  onChange={handleChange}
                  name="does_delivery"
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
                  onChange={handleChange}
                  name="branches"
                />
                <p className="text-xs text-gray-500 mt-1">Enter one branch address per line</p>
              </div>
              <div>
                <label className="label">Famous For</label>
                <textarea
                  className="input min-h-[60px]"
                  placeholder="What is this shop famous for? e.g., Best prices, Quality products, Fast delivery"
                  value={formData.famous_for || ''}
                  onChange={handleChange}
                  name="famous_for"
                />
              </div>
            </>
          )}

          {/* Category-specific fields - Universities */}
          {categorySlug === 'universities' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Help Desk / Information Desk Phone</label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="+880..."
                    value={formData.help_desk_phone || ''}
                    onChange={handleChange}
                    name="help_desk_phone"
                  />
                </div>
                <div>
                  <label className="label">Admission Office Phone</label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="+880..."
                    value={formData.admission_office_phone || ''}
                    onChange={handleChange}
                    name="admission_office_phone"
                  />
                </div>
              </div>
              <div>
                <label className="label">Courses/Programs (one per line)</label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="Computer Science&#10;Electrical Engineering&#10;Business Administration"
                  value={formData.courses_offered || ''}
                  onChange={handleChange}
                  name="courses_offered"
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
                  onChange={handleChange}
                  name="famous_for_courses"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple courses with commas</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">University Grade</label>
                  <select
                    className="input"
                    value={formData.university_grade || ''}
                    onChange={handleChange}
                    name="university_grade"
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
                    onChange={handleChange}
                    name="organization"
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
                    onChange={handleChange}
                    name="total_faculty"
                  />
                </div>
                <div>
                  <label className="label">Vice Chancellor / CEO</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Name of Vice Chancellor"
                    value={formData.vice_chancellor || ''}
                    onChange={handleChange}
                    name="vice_chancellor"
                  />
                </div>
              </div>
            </>
          )}

          {/* Category-specific fields - Websites */}
          {categorySlug === 'websites' && (
            <>
              <div>
                <label className="label">Website URL <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  required
                  className="input"
                  placeholder="https://..."
                  value={formData.url || ''}
                  onChange={handleChange}
                  name="url"
                />
              </div>
              <h3 className="font-semibold text-lg mt-6 mb-2">Website Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Website Type</label>
                  <select
                    className="input"
                    value={formData.website_type || ''}
                    onChange={handleChange}
                    name="website_type"
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
                    onChange={handleChange}
                    name="organization"
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
                    onChange={handleChange}
                    name="total_employees"
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
                    onChange={handleChange}
                    name="delivery_rate"
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
                  onChange={handleChange}
                  name="office_time"
                />
              </div>

              <div>
                <label className="label">Payment Methods (comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="bKash, Nagad, Card, Cash on Delivery"
                  value={formData.payment_methods || ''}
                  onChange={handleChange}
                  name="payment_methods"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple methods with commas</p>
              </div>

              <div>
                <label className="label">Other Domains (one per line)</label>
                <textarea
                  className="input min-h-[80px]"
                  placeholder="https://example.com&#10;https://www.example.com"
                  value={formData.other_domains || ''}
                  onChange={handleChange}
                  name="other_domains"
                />
                <p className="text-xs text-gray-500 mt-1">Enter one domain per line</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="has_physical_store"
                  checked={formData.has_physical_store || false}
                  onChange={handleChange}
                  name="has_physical_store"
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
                        onChange={handleChange}
                        name="division"
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
                        onChange={handleChange}
                        name="district"
                      />
                    </div>
                    <div>
                      <label className="label">Area</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Area/Locality"
                        value={formData.area || ''}
                        onChange={handleChange}
                        name="area"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Full Address</label>
                    <textarea
                      className="input"
                      placeholder="Complete address..."
                      value={formData.address || ''}
                      onChange={handleChange}
                      name="address"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Location fields (for most categories) */}
          {categorySlug !== 'websites' && (
            <>
              <h3 className="font-semibold text-lg mt-6 mb-2">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Division</label>
                  <select
                    className="input"
                    value={formData.division || ''}
                    onChange={handleChange}
                    name="division"
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
                    onChange={handleChange}
                    name="district"
                  />
                </div>
                <div>
                  <label className="label">Area</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Area/Locality"
                    value={formData.area || ''}
                    onChange={handleChange}
                    name="area"
                  />
                </div>
              </div>
              <div>
                <label className="label">Full Address</label>
                <textarea
                  className="input"
                  placeholder="Complete address..."
                  value={formData.address || ''}
                  onChange={handleChange}
                  name="address"
                />
              </div>
            </>
          )}

          {/* Contact fields */}
          {!['products', 'websites', 'universities'].includes(categorySlug) && (
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
                    onChange={handleChange}
                    name="phone"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="email@example.com"
                    value={formData.email || ''}
                    onChange={handleChange}
                    name="email"
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
                  onChange={handleChange}
                  name="website"
                />
              </div>
            </>
          )}

          {/* Contact fields for universities */}
          {categorySlug === 'universities' && (
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
                    onChange={handleChange}
                    name="email"
                  />
                </div>
                <div>
                  <label className="label">Website</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://..."
                    value={formData.website || ''}
                    onChange={handleChange}
                    name="website"
                  />
                </div>
              </div>
            </>
          )}

          {/* Contact fields for websites */}
          {categorySlug === 'websites' && (
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
                    onChange={handleChange}
                    name="phone"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="email@example.com"
                    value={formData.email || ''}
                    onChange={handleChange}
                    name="email"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-primary flex-1"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Update'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${categorySlug}/${itemSlug}`)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>

          {/* Delete Button - Only for Admins and Moderators */}
          {(session?.user?.is_moderator || session?.user?.is_admin) && (
            <div className="mt-8 pt-8 border-t border-red-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete an item, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteMutation.isPending ? 'Deleting...' : '🗑️ Delete Item'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
