'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { search } from '@/lib/api';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

// Helper function to get the correct category path
function getCategoryPath(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'product': 'products',
    'restaurant': 'restaurants',
    'shop': 'shops',
    'manufacturer': 'manufacturers',
    'school': 'schools',
    'university': 'universities',
    'hospital': 'hospitals',
    'hotel': 'hotels',
    'tourist_spot': 'tourist-spots',
    'technician': 'technicians',
    'website': 'websites',
  };
  
  return categoryMap[category] || category;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return null;
      const response = await search.global(query);
      return response.data.results;
    },
    enabled: !!query,
  });

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  // Filter results by selected category
  const filteredResults = results && selectedCategory
    ? { [selectedCategory]: results[selectedCategory] }
    : results;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Search</h1>
        <SearchBar />
      </div>

      {/* Category Filter */}
      {query && results && Object.keys(results).length > 0 && (
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === ''
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {Object.keys(results).map((categoryName) => (
            <button
              key={categoryName}
              onClick={() => setSelectedCategory(categoryName)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === categoryName
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      )}

      {/* Search Results */}
      {query && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {selectedCategory 
                ? `Results in ${selectedCategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
                : `Search results for "${query}"`
              }
            </h2>
            {results && Object.keys(results).length > 0 && (
              <span className="text-sm text-gray-500">
                {Object.values(filteredResults || {}).reduce((sum: number, items: any) => sum + items.length, 0)} results
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredResults && Object.keys(filteredResults).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(filteredResults).map(([categoryName, items]: [string, any]) => (
                <div key={categoryName}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                    {categoryName.replace('_', ' ')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item: any) => (
                      <Link
                        key={item.id}
                        href={`/${getCategoryPath(item.category)}/${item.slug}`}
                        className="card hover:shadow-lg transition-shadow"
                      >
                        {/* Image */}
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
                        
                        <h4 className="font-semibold text-lg text-gray-900 mb-2">
                          {item.name}
                        </h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <span className="inline-block mt-2 text-xs text-primary-600 font-medium capitalize">
                          {item.category.replace('_', ' ')}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No results found for "{query}"
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try different keywords or browse categories
              </p>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            Enter a search term to find products, places, and services
          </p>
        </div>
      )}
    </div>
  );
}

