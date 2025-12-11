'use client';

import { useQuery } from '@tanstack/react-query';
import { categories } from '@/lib/api';
import Link from 'next/link';

export default function CategoriesPage() {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categories.getAll();
      return response.data.categories;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">All Categories</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(11)].map((_, i) => (
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
                  <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <span className="text-3xl">{getCategoryIcon(category.icon)}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
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

