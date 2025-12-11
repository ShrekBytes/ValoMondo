'use client';

import { useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { userStats } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  // Fetch user statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const response = await userStats.get();
      return response.data;
    },
    enabled: status === 'authenticated' && !!session,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Redirect if not logged in (using useEffect to avoid hydration issues)
  useEffect(() => {
    // Only redirect after we've confirmed the session status
    if (status === 'unauthenticated') {
      // Small delay to ensure we're not in a loading state
      const timer = setTimeout(() => {
        router.push('/login');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (redirect is in progress)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* User Info Card */}
        <div className="card mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {session?.user?.name}
              </h2>
              <p className="text-gray-600">{session?.user?.email}</p>
              {session?.user?.is_moderator && (
                <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                  🛡️ Moderator
                </span>
              )}
            </div>
            <div className="text-right">
              <Link href="/settings" className="btn btn-secondary">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-blue-50">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {statsLoading ? '...' : stats?.submissions || 0}
            </div>
            <div className="text-sm text-gray-600">Submissions</div>
          </div>
          <div className="card bg-green-50">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {statsLoading ? '...' : stats?.items_reviewed || 0}
            </div>
            <div className="text-sm text-gray-600">Items Reviewed</div>
          </div>
          <div className="card bg-purple-50">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {statsLoading ? '...' : stats?.items_rated || 0}
            </div>
            <div className="text-sm text-gray-600">Items Rated</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/submit"
              className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <div className="font-semibold">Submit New Item</div>
                <div className="text-sm text-gray-600">Add a product, place, or service</div>
              </div>
            </Link>
            <Link
              href="/my-submissions"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <span className="text-2xl mr-3">📝</span>
              <div>
                <div className="font-semibold">My Submissions</div>
                <div className="text-sm text-gray-600">View your submitted items</div>
              </div>
            </Link>
            <Link
              href="/my-reviews"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <span className="text-2xl mr-3">💬</span>
              <div>
                <div className="font-semibold">My Reviews</div>
                <div className="text-sm text-gray-600">See all your reviews</div>
              </div>
            </Link>
            <Link
              href="/settings"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-2xl mr-3">⚙️</span>
              <div>
                <div className="font-semibold">Settings</div>
                <div className="text-sm text-gray-600">Update your preferences</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          {statsLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading...
            </div>
          ) : stats && (stats.recent_activity.reviews.length > 0 || stats.recent_activity.ratings.length > 0) ? (
            <div className="space-y-4">
              {stats.recent_activity.reviews.slice(0, 5).map((review: any) => (
                <div key={`review-${review.id}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">💬</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      Reviewed{' '}
                      {review.category_slug && review.item_slug ? (
                        <Link 
                          href={`/${review.category_slug}/${review.item_slug}`}
                          className="text-primary-600 hover:text-primary-800 hover:underline"
                        >
                          {review.item_name}
                        </Link>
                      ) : (
                        <span className="text-gray-700">{review.item_name || 'an item'}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2">{review.comment}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {stats.recent_activity.ratings.slice(0, 5).map((rating: any) => (
                <div key={`rating-${rating.id}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">⭐</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      Rated{' '}
                      {rating.category_slug && rating.item_slug ? (
                        <Link 
                          href={`/${rating.category_slug}/${rating.item_slug}`}
                          className="text-primary-600 hover:text-primary-800 hover:underline"
                        >
                          {rating.item_name}
                        </Link>
                      ) : (
                        <span className="text-gray-700">{rating.item_name || 'an item'}</span>
                      )}
                      {' '}
                      <span className="text-yellow-500">
                        {'⭐'.repeat(rating.rating)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
              <p className="text-sm mt-2">Start by submitting items or writing reviews!</p>
            </div>
          )}
        </div>

        {/* Moderator Section */}
        {session?.user?.is_moderator && (
          <div className="card mt-8 bg-primary-50 border-2 border-primary-200">
            <h3 className="text-xl font-semibold mb-4 text-primary-900">
              🛡️ Moderator Access
            </h3>
            <p className="text-gray-700 mb-4">
              You have moderator privileges. Access the admin panel to review submissions and moderate content.
            </p>
            <a
              href="http://localhost:8001"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Open Admin Panel
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

