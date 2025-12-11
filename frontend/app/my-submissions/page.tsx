'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { userStats } from '@/lib/api';
import Link from 'next/link';

export default function MySubmissionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['mySubmissions'],
    queryFn: async () => {
      const response = await userStats.getSubmissions();
      return response.data;
    },
    enabled: !!session,
  });

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const submissions = submissionsData?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Submissions</h1>
          <Link href="/submit" className="btn btn-primary">
            + Submit New Item
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : submissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((item: any) => (
              <Link
                key={item.id}
                href={`/${item.category_slug}/${item.slug}`}
                className="card hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                  {item.images && Array.isArray(item.images) && item.images.length > 0 && item.images[0]?.url ? (
                    <img
                      src={item.images[0].url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent && !parent.querySelector('.no-image-fallback')) {
                          const fallback = document.createElement('span');
                          fallback.className = 'text-gray-400 no-image-fallback';
                          fallback.textContent = 'No image';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {item.description || 'No description'}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{item.category_name}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </Link>
            ))}
            
            {/* Pagination info */}
            {submissionsData?.total > submissions.length && (
              <div className="col-span-full text-center text-gray-600 mt-6">
                Showing {submissions.length} of {submissionsData.total} submissions
              </div>
            )}
          </div>
        ) : (
          <div className="card">
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No submissions yet</p>
              <p className="text-sm">
                Start by submitting products, places, or services for review
              </p>
              <Link href="/submit" className="btn btn-primary mt-4">
                Submit Your First Item
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

