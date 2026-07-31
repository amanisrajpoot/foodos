import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

interface ReviewWidgetProps {
  organizationId: string;
  customerId: string;
  orderId?: string;
  onSubmitSuccess?: () => void;
}

export function ReviewWidget({ organizationId, customerId, orderId, onSubmitSuccess }: ReviewWidgetProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/customers/${customerId}/reviews?organizationId=${organizationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          orderId,
          reviewSource: 'IN_APP',
        }),
      });

      if (res.ok) {
        Alert.alert('Success', 'Thank you for your review!');
        setRating(0);
        setComment('');
        onSubmitSuccess?.();
      } else {
        Alert.alert('Error', 'Failed to submit review. Please try again.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <Text className="text-xl font-bold text-gray-900 mb-4">Leave a Review</Text>
      
      <View className="flex-row justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              rating >= star ? 'bg-yellow-400' : 'bg-gray-100'
            }`}
          >
            <Text className={`text-xl ${rating >= star ? 'text-white' : 'text-gray-400'}`}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 min-h-[100px]"
        placeholder="Share your experience (optional)..."
        multiline
        textAlignVertical="top"
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600'}`}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text className="text-white font-bold text-lg">
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
