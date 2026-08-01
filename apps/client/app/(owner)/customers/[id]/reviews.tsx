import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '../../../../stores/auth.store';

export default function CustomerReviewsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { organizationId } = useAuthStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/customers/${id}/reviews?organizationId=${organizationId}`);
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const moderateReview = async (reviewId: string, status: string) => {
    try {
      await fetch(`http://localhost:3001/customers/${id}/reviews/${reviewId}/moderate?organizationId=${organizationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-blue-600 font-medium">← Back to Profile</Text>
      </TouchableOpacity>
      
      <Text className="text-3xl font-bold text-gray-900 mb-6">Customer Reviews</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : reviews.length === 0 ? (
        <Text className="text-gray-500">No reviews found.</Text>
      ) : (
        reviews.map(review => (
          <View key={review.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-4">
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text className="font-bold text-lg">Rating: {review.rating}/5</Text>
                <Text className="text-gray-400 text-sm">{new Date(review.submittedAt).toLocaleDateString()}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${review.status === 'PUBLISHED' ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Text className={review.status === 'PUBLISHED' ? 'text-green-700' : 'text-gray-600'}>
                  {review.status}
                </Text>
              </View>
            </View>
            
            <Text className="text-gray-800 text-base mb-4">{review.comment || 'No comment provided.'}</Text>
            
            <View className="flex-row gap-3">
              {review.status !== 'HIDDEN' && (
                <TouchableOpacity onPress={() => moderateReview(review.id, 'HIDDEN')} className="bg-orange-50 px-4 py-2 rounded-lg">
                  <Text className="text-orange-600 font-medium">Hide</Text>
                </TouchableOpacity>
              )}
              {review.status !== 'PUBLISHED' && (
                <TouchableOpacity onPress={() => moderateReview(review.id, 'PUBLISHED')} className="bg-blue-50 px-4 py-2 rounded-lg">
                  <Text className="text-blue-600 font-medium">Publish</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
