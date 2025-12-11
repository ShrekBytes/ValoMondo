'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviews } from '@/lib/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface ReviewSectionProps {
  reviewableType: string;
  reviewableId: number;
}

export default function ReviewSection({ reviewableType, reviewableId }: ReviewSectionProps) {
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyComment, setReplyComment] = useState('');
  const [reportingReview, setReportingReview] = useState<number | null>(null);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Helper function to render stars
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return (
      <span className="inline-flex text-sm ml-2">
        {stars}
      </span>
    );
  };

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['reviews', reviewableType, reviewableId],
    queryFn: async () => {
      const response = await reviews.getAll({
        reviewable_type: reviewableType,
        reviewable_id: reviewableId,
      });
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => reviews.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setComment('');
      setReplyComment('');
      setReplyingTo(null);
      if (response.data.auto_approved) {
        alert('Review published successfully!');
      } else {
        alert('Review submitted for approval!');
      }
    },
    onError: () => {
      alert('Failed to submit review. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    mutation.mutate({
      reviewable_type: reviewableType,
      reviewable_id: reviewableId,
      comment,
    });
  };

  const handleReply = (reviewId: number) => {
    if (!replyComment.trim()) return;

    mutation.mutate({
      reviewable_type: reviewableType,
      reviewable_id: reviewableId,
      comment: replyComment,
      parent_id: reviewId,
    });
  };

  const handleReport = async (reviewId: number) => {
    if (!confirm('Are you sure you want to report this review? Moderators will be notified.')) {
      return;
    }

    try {
      // We'll implement this API endpoint
      await reviews.report(reviewId);
      alert('Review reported successfully. Thank you for helping maintain our community standards.');
      setReportingReview(null);
    } catch (error) {
      alert('Failed to report review. Please try again.');
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">Reviews</h2>

      {/* Review Form */}
      {session ? (
        <div className="card mb-8">
          <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="input min-h-[120px] mb-4"
              required
            />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-primary"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      ) : (
        <div className="card mb-8 text-center">
          <p className="text-gray-600">
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Login
            </Link>
            {' '}to write a review
          </p>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : reviewsData?.data?.length > 0 ? (
        <div className="space-y-6">
          {reviewsData.data.map((review: any, index: number) => (
            <div key={review.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-semibold">{review.user.name}</span>
                    {review.user_rating && (
                      <span className="flex items-center">
                        {renderStars(review.user_rating)}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                
                {session && (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                      className="text-primary-600 text-sm hover:text-primary-700"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => handleReport(review.id)}
                      className="text-red-600 text-sm hover:text-red-700"
                    >
                      🚩 Report
                    </button>
                  </div>
                )}

              {/* Reply Form */}
              {replyingTo === review.id && (
                <div className="mt-4 pl-6 border-l-2 border-primary-200">
                  <textarea
                    value={replyComment}
                    onChange={(e) => setReplyComment(e.target.value)}
                    placeholder="Write a reply..."
                    className="input min-h-[80px] mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={mutation.isPending}
                      className="btn btn-primary btn-sm"
                    >
                      Submit Reply
                    </button>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {review.replies && review.replies.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="pl-6 border-l-2 border-gray-200 space-y-4">
                    {review.replies.map((reply: any, replyIndex: number) => (
                      <div key={reply.id}>
                        {replyIndex > 0 && <div className="border-t border-gray-100 -ml-6 mb-4"></div>}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-semibold text-sm">{reply.user.name}</span>
                            {reply.user_rating && (
                              <span className="flex items-center text-xs">
                                {renderStars(reply.user_rating)}
                              </span>
                            )}
                          </div>
                          <span className="text-gray-500 text-xs">
                            {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{reply.comment}</p>
                        {session && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleReport(reply.id)}
                              className="text-red-500 text-xs hover:text-red-600"
                            >
                              🚩 Report
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">
          No reviews yet. Be the first to review!
        </div>
      )}
    </div>
  );
}

