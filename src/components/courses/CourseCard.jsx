// Deprecated implementation kept for compatibility; delegates to unified UI CourseCard.
import React from 'react';
import UICourseCard from '../ui/CourseCard';

export default function CourseCard({ course, onPress, onAddToWishlist, onAddToCart, style }) {
  return (
    <UICourseCard
      course={course}
      style={style}
      onPress={onPress}
      onToggleWishlist={onAddToWishlist}
      onAddToCart={onAddToCart}
    />
  );
}
