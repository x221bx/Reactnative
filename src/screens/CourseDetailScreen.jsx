import React, { useMemo, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import useCourses from "../hooks/useCourses";
import useTeachers from "../hooks/useTeachers";
import useAuth from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { selectWishlist, addToWishlist, removeFromWishlist } from "../redux/slices/wishlistSlice";
import { selectFavorites, addFavorite, removeFavorite } from "../redux/slices/favoritesSlice";
import { selectEnrollmentsByUser, joinCourse, unjoinCourse, selectEnrolledCountForCourse } from "../redux/slices/enrollmentSlice";
import { selectCourseRatingAvg, selectCourseRatingCount, addOrUpdateRating } from "../redux/slices/ratingsSlice";
import { useTheme } from "../hooks/useTheme";
import AppHeader from "../components/ui/AppHeader";
import Breadcrumbs from "../components/ui/Breadcrumbs";

export default function CourseDetailScreen({ courseId, onBack, onHome, onLogin }) {
  const { colors } = useTheme();
  const { courses } = useCourses();
  const { teachers } = useTeachers();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const enrolledIds = useSelector((s) => selectEnrollmentsByUser(s, user?.uid));
  const enrolledCount = useSelector((s) => selectEnrolledCountForCourse(s, courseId));
  const ratingAvg = useSelector((s) => selectCourseRatingAvg(s, courseId));
  const ratingCount = useSelector((s) => selectCourseRatingCount(s, courseId));
  const wishlist = useSelector(selectWishlist);
  const favorites = useSelector(selectFavorites);
  const course = useMemo(() => courses.find((c) => String(c.id) === String(courseId)), [courses, courseId]);
  const inWishlist = wishlist.includes(String(course?.id));
  const inFavorites = favorites.includes(String(course?.id));
  const teacher = useMemo(() => teachers.find((t) => String(t.id) === String(course?.teacherId)), [teachers, course]);

  if (!course) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}> 
        <AppHeader title="Course" onBack={onBack} />
        <Text style={[styles.title, { color: colors.text, textAlign: 'center', marginTop: 16 }]}>Course not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Breadcrumbs items={[{ label: 'Home', onPress: onHome }, { label: 'Courses', onPress: onBack }, { label: course.title }]} />
      <AppHeader title={course.title} onBack={onBack} onHome={onHome} />
      <Image source={{ uri: course.image }} style={styles.image} />
      <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>
      <Text style={[styles.meta, { color: colors.muted }]}>{course.category || 'General'}</Text>
      <Text style={[styles.meta, { color: colors.muted }]}>Rating: {Number(ratingAvg || 0).toFixed(1)}{ratingCount ? ` (${ratingCount})` : ''}</Text>
      <Text style={[styles.meta, { color: colors.muted }]}>Enrolled: {enrolledCount}</Text>
      {typeof course.price === 'number' && <Text style={[styles.price, { color: colors.text }]}>${Number(course.price || 0).toFixed(2)}</Text>}
      {!!teacher && <Text style={[styles.meta, { color: colors.muted, marginTop: 8 }]}>By {teacher.name}</Text>}
      {!!course.description && <Text style={[styles.desc, { color: colors.text }]}>{course.description}</Text>}
      {user && enrolledIds.includes(String(course.id)) && (
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <StarRating
            value={0}
            onSelect={(v) => dispatch(addOrUpdateRating({ courseId: course.id, userId: user.uid, rating: v }))}
          />
          <Text style={[styles.meta, { color: colors.muted, marginTop: 6 }]}>Tap to rate</Text>
        </View>
      )}
      <View style={{ height: 12 }} />
      {user ? (
        enrolledIds.includes(String(course.id)) ? (
          <TouchableOpacity onPress={() => dispatch(unjoinCourse({ userId: user.uid, courseId: course.id }))} style={{ alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text }}>Unjoin</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => dispatch(joinCourse({ userId: user.uid, courseId: course.id }))} style={{ alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.text }}>
            <Text style={{ color: colors.bg }}>Join</Text>
          </TouchableOpacity>
        )
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.meta, { color: colors.muted, textAlign: 'center', marginBottom: 8 }]}>Login to join this course</Text>
          <TouchableOpacity onPress={onLogin} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text }}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ height: 12 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => dispatch(inWishlist ? removeFromWishlist(course.id) : addToWishlist(course.id))}
          style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginRight: 8 }}
        >
          <Text style={{ color: colors.text }}>{inWishlist ? 'Remove Wishlist' : 'Add Wishlist'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => dispatch(inFavorites ? removeFavorite(course.id) : addFavorite(course.id))}
          style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}
        >
          <Text style={{ color: colors.text }}>{inFavorites ? 'Remove Favorite' : 'Add Favorite'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  meta: { fontSize: 13, textAlign: 'center', marginTop: 4 },
  price: { fontWeight: '800', textAlign: 'center', marginTop: 8 },
  desc: { fontSize: 14, textAlign: 'center', marginTop: 10 },
});

function Star({ filled, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={{ fontSize: 24 }}>{filled ? '★' : '☆'}</Text>
    </TouchableOpacity>
  );
}

function StarRating({ value = 0, onSelect }) {
  const [v, setV] = useState(value);
  const stars = [1,2,3,4,5];
  return (
    <View style={{ flexDirection: 'row' }}>
      {stars.map((s) => (
        <Star key={s} filled={s <= v} onPress={() => { setV(s); onSelect?.(s); }} />
      ))}
    </View>
  );
}
