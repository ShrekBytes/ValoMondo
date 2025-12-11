'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { userStats } from '@/lib/api';
import Link from 'next/link';

export default function MyReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['myReviews'],
    queryFn: async () => {
      const response = await userStats.getReviews();
      return response.data;
    },
    enabled: !!session,
  });

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const reviews = reviewsData?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Reviews</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link
                      href={`/${review.category_slug}/${review.item_slug}`}
                      className="font-semibold text-lg text-primary-600 hover:text-primary-700"
                    >
                      {review.item_name}
                    </Link>
                    <span className="text-gray-500 text-sm ml-2">
                      ({review.item_type})
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                {review.parent_id && (
                  <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Reply
                  </span>
                )}
              </div>
            ))}
            
            {/* Pagination info */}
            {reviewsData?.total > reviews.length && (
              <div className="text-center text-gray-600 mt-6">
                Showing {reviews.length} of {reviewsData.total} reviews
              </div>
            )}
          </div>
        ) : (
          <div className="card">
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No reviews yet</p>
              <p className="text-sm">
                Start exploring items and share your experiences
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

