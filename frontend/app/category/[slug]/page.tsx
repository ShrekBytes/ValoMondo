'use client';

import { useQuery } from '@tanstack/react-query';
import { products, categories } from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import RatingDisplay from '@/components/RatingDisplay';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Categories that have physical locations
  const locationBasedCategories = [
    'restaurants',
    'shops', 
    'schools',
    'universities',
    'hospitals',
    'hotels',
    'tourist-spots',
    'technicians'
  ];

  const hasLocationFilter = locationBasedCategories.includes(slug);

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await categories.getBySlug(slug);
      return response.data.category;
    },
  });

  const { data: itemsData, isLoading } = useQuery({
    queryKey: ['categoryItems', slug],
    queryFn: async () => {
      const response = await categories.getItems(slug);
      return response.data;
    },
  });

  const items = itemsData?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {category?.name || 'Loading...'}
          </h1>
          <p className="text-gray-600">{category?.description}</p>
        </div>
        <Link href="/submit" className="btn btn-primary">
          + Submit Item
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        {hasLocationFilter && (
          <>
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors">
              <option value="">All Divisions</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
              <option value="Barisal">Barisal</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors">
              <option value="">All Districts</option>
            </select>
          </>
        )}
        <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors">
          <option value="name">Sort: Name</option>
          <option value="rating">Sort: Rating</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <Link
              key={item.id}
              href={`/${slug}/${item.slug}`}
              className="card hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {item.description || 'No description available'}
              </p>
              {item.price && (
                <p className="text-primary-600 font-semibold mb-2">
                  BDT {parseFloat(item.price).toLocaleString()}
                </p>
              )}
              <div className="mt-2">
                <RatingDisplay 
                  avgRating={item.avg_user_rating || 0}
                  totalRatings={item.total_ratings || 0}
                  moderatorRating={item.moderator_rating}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No items found in this category.</p>
        </div>
      )}
    </div>
  );
}

