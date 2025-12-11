'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { products } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import ReviewSection from '@/components/ReviewSection';
import RatingDisplay from '@/components/RatingDisplay';
import RatingForm from '@/components/RatingForm';
import { useSession, getSession } from 'next-auth/react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session, status } = useSession();

  // Sync token to localStorage when session is available
  useEffect(() => {
    const syncToken = async () => {
      if (status === 'authenticated' && session?.user?.token) {
        localStorage.setItem('auth_token', session.user.token);
      } else if (status === 'loading') {
        // Try to get session if it's still loading
        const currentSession = await getSession();
        if (currentSession?.user?.token) {
          localStorage.setItem('auth_token', currentSession.user.token);
        }
      }
    };
    syncToken();
  }, [session, status]);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await products.getBySlug(slug);
      // API Resource returns data directly, not wrapped in 'product'
      return response.data.data || response.data;
    },
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors - product page should be public
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error loading product</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div>
          {product.images && product.images.length > 0 ? (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image: any, index: number) => (
                    <div key={image.id} className="relative h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition">
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            {session && (
              <Link
                href={`/products/${product.slug}/update`}
                className="btn btn-secondary text-sm"
              >
                📝 Update Info
              </Link>
            )}
          </div>
          
          {/* Rating Display */}
          <RatingDisplay
            avgRating={product.avg_user_rating || 0}
            totalRatings={product.total_ratings || 0}
            moderatorRating={product.moderator_rating}
          />

          {product.price && (
            <div className="mt-6">
              <span className="text-3xl font-bold text-primary-600">
                BDT {parseFloat(product.price).toLocaleString()}
              </span>
            </div>
          )}

          {product.manufacturer && (
            <div className="mt-4">
              <span className="text-gray-600">Manufacturer: </span>
              <span className="font-medium">{product.manufacturer.name}</span>
            </div>
          )}

          {product.description && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {product.shops && product.shops.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Available At</h3>
              <ul className="space-y-2">
                {product.shops.map((shop: any) => (
                  <li key={shop.id} className="flex justify-between items-center">
                    <span>{shop.name}</span>
                    {shop.pivot?.price_at_shop && (
                      <span className="font-medium">
                        BDT {parseFloat(shop.pivot.price_at_shop).toLocaleString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* User Rating Form */}
          {session && (
            <div className="mt-8">
              <RatingForm
                ratableType="App\Models\Product"
                ratableId={product.id}
              />
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection
        reviewableType="App\Models\Product"
        reviewableId={product.id}
      />
    </div>
  );
}

