'use client';

import { useQuery } from '@tanstack/react-query';
import { categories } from '@/lib/api';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categories.getAll();
      return response.data.categories;
    },
  });

  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover & Review Everything in Bangladesh
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            From products and services to places and professionals in Bangladesh - find authentic reviews and detailed information
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Browse Categories</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoriesData?.map((category: any) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="card hover:shadow-xl transition-shadow duration-200 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                      <span className="text-2xl">{getCategoryIcon(category.icon)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ValoMondo.info?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Verified Reviews</h3>
              <p className="text-gray-600">
                All reviews are moderated to ensure authenticity and helpfulness
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Detailed Information</h3>
              <p className="text-gray-600">
                Get comprehensive details including prices, locations, and contact info
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🇧🇩</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Made for Bangladesh</h3>
              <p className="text-gray-600">
                Your trusted source for authentic reviews and detailed information
              </p>
            </div>
          </div>
        </div>
      </section>
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

