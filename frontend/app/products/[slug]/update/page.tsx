'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { products, itemUpdates } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function UpdateProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    barcode: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await products.getBySlug(slug);
      const productData = response.data.data || response.data;
      
      // Set initial form data
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || '',
        barcode: productData.barcode || '',
      });
      
      return productData;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Get token from localStorage
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error('No authentication token available. Please login again.');
      }

      // Create form data for file upload
      const formDataToSend = new FormData();
      
      // Add metadata
      formDataToSend.append('item_type', data.item_type);
      formDataToSend.append('item_id', data.item_id);
      
      // Add proposed data
      Object.keys(data.proposed_data).forEach(key => {
        if (data.proposed_data[key] !== null && data.proposed_data[key] !== undefined && data.proposed_data[key] !== '') {
          formDataToSend.append(`proposed_data[${key}]`, data.proposed_data[key]);
        }
      });

      // Add images if any
      images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      // Make API call with token
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
        alert('Product information updated successfully!');
      } else {
        alert('Update request submitted successfully! Moderators will review your changes.');
      }
      router.push(`/products/${slug}`);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to submit update. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    mutation.mutate({
      item_type: 'Product',
      item_id: product.id,
      proposed_data: {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        barcode: formData.barcode,
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to update product information.</p>
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Product Information</h1>
        <p className="text-gray-600 mb-6">
          {session.user.is_moderator 
            ? 'Your changes will be applied immediately.'
            : 'Your proposed changes will be reviewed by moderators before being applied.'}
        </p>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label htmlFor="name" className="label">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input min-h-[150px]"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="label">Price (BDT)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="barcode" className="label">Barcode</label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              className="input"
              placeholder="Product barcode (optional)"
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
              Upload new images to replace existing ones (optional, max 5 images)
            </p>

            {/* Current Images */}
            {product && product.images && product.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {product.images.map((image: any, index: number) => (
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

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-primary"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Update'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

