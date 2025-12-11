'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ratings } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

interface RatingFormProps {
  ratableType: string;
  ratableId: number;
}

export default function RatingForm({ ratableType, ratableId }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const params = useParams();

  // Fetch user's existing rating
  const { data: userRatingData } = useQuery({
    queryKey: ['userRating', ratableType, ratableId],
    queryFn: async () => {
      const response = await ratings.getUserRating({
        ratable_type: ratableType,
        ratable_id: ratableId,
      });
      return response.data;
    },
    enabled: !!session,
  });

  // Set rating from fetched data
  useEffect(() => {
    if (userRatingData?.rating) {
      setRating(userRatingData.rating);
    }
  }, [userRatingData]);

  const mutation = useMutation({
    mutationFn: (data: any) => ratings.create(data),
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
      queryClient.invalidateQueries({ queryKey: ['userRating'] });
      queryClient.invalidateQueries({ queryKey: ['product', params.slug] });
      alert('Rating submitted successfully!');
    },
    onError: () => {
      alert('Failed to submit rating. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    mutation.mutate({
      ratable_type: ratableType,
      ratable_id: ratableId,
      rating,
    });
  };

  if (!session) {
    return null;
  }

  return (
    <div className="border-t pt-6">
      <h3 className="font-semibold text-lg mb-3">
        {rating > 0 ? 'Your Rating' : 'Rate this item'}
      </h3>
      <div className="flex items-center gap-4">
        <div className="flex gap-1 text-3xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="hover:scale-110 transition-transform"
            >
              <span className={
                star <= (hoveredRating || rating)
                  ? 'text-yellow-500'
                  : 'text-gray-300'
              }>
                ★
              </span>
            </button>
          ))}
        </div>
        {rating > 0 && (
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="btn btn-primary"
          >
            {mutation.isPending ? 'Updating...' : (userRatingData?.rating ? 'Update Rating' : 'Submit Rating')}
          </button>
        )}
      </div>
      {rating > 0 && (
        <p className="text-sm text-gray-600 mt-2">
          {userRatingData?.rating ? 'You can update your rating anytime' : 'You can only rate once, but you can update it later'}
        </p>
      )}
    </div>
  );
}

