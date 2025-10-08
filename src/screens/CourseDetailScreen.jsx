import React, { useMemo, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Pressable, TextInput, Platform } from "react-native";
import * as Notifications from 'expo-notifications';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { useTranslation } from "../i18n/i18n";

export default function CourseDetailScreen({ courseId: propCourseId, onBack, onHome, onLogin }) {
  const { colors } = useTheme();
  const { courses } = useCourses();
  const { teachers } = useTeachers();
  const navigation = useNavigation();
  const route = useRoute();
  const courseId = propCourseId || route?.params?.courseId;
  const { user } = useAuth();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const enrolledIds = useSelector((s) => selectEnrollmentsByUser(s, user?.uid));
  const enrolledCount = useSelector((s) => selectEnrolledCountForCourse(s, courseId));
  const ratingAvg = useSelector((s) => selectCourseRatingAvg(s, courseId));
  const ratingCount = useSelector((s) => selectCourseRatingCount(s, courseId));
  const ratings = useSelector((s) => (s?.ratings?.ratingsByCourse?.[String(courseId)] || []));
  const wishlist = useSelector(selectWishlist);
  const favorites = useSelector(selectFavorites);
  const course = useMemo(() => courses.find((c) => String(c.id) === String(courseId)), [courses, courseId]);
  const inWishlist = wishlist.includes(String(course?.id));
  const inFavorites = favorites.includes(String(course?.id));
  const teacher = useMemo(() => teachers.find((t) => String(t.id) === String(course?.teacherId)), [teachers, course]);

  if (!course) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}> 
        <AppHeader title="Course" onBack={onBack || navigation.goBack} showMenu />
        <Text style={[styles.title, { color: colors.text, textAlign: 'center', marginTop: 16 }]}>Course not found</Text>
      </View>
    );
  }

  const scheduleReminders = async () => {
    try {
      if (Platform.OS === 'web') return; // skip web
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
      const sessions = Array.isArray(course.sessions) ? course.sessions : [];
      const now = Date.now();
      for (const s of sessions) {
        const when = new Date(s).getTime() - 30 * 60 * 1000; // 30 min before
        if (when > now) {
          await Notifications.scheduleNotificationAsync({
            content: { title: 'Upcoming session', body: `${course.title} starts soon` },
            trigger: { date: new Date(when) }
          });
        }
      }
    } catch {}
  };

  const [reviewText, setReviewText] = useState('');
  const submitReview = () => {
    if (!user) return;
    dispatch(addOrUpdateRating({ courseId: course.id, userId: user.uid, rating: 5, comment: reviewText }));
    setReviewText('');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Breadcrumbs items={[{ label: t('nav.home','Home'), onPress: onHome || (() => navigation.navigate('Home')) }, { label: t('nav.courses','Courses'), onPress: onBack || navigation.goBack }, { label: course.title }]} />
      <AppHeader title={course.title} onBack={onBack || navigation.goBack} onHome={onHome || (() => navigation.navigate('Home'))} showMenu />
      <Image source={{ uri: course.image || course.thumbnail }} style={styles.image} />
      <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>
      <Text style={[styles.meta, { color: colors.muted }]}>{course.category || course.level || 'General'}</Text>
      <Text style={[styles.meta, { color: colors.muted }]}>Rating: {Number(ratingAvg || 0).toFixed(1)}{ratingCount ? ` (${ratingCount})` : ''}</Text>
      <Text style={[styles.meta, { color: colors.muted }]}>Enrolled: {enrolledCount}</Text>
      {typeof course.price === 'number' && <Text style={[styles.price, { color: colors.text }]}>${Number(course.price || 0).toFixed(2)}</Text>}
      {!!teacher && (
        <Pressable onPress={() => navigation.navigate('TeacherDetail', { teacherId: teacher.id })} accessibilityRole="button" style={{ alignSelf: 'center' }}>
          <Text style={[styles.meta, { color: colors.muted, marginTop: 8 }]}>By {teacher.name} • View profile</Text>
        </Pressable>
      )}
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
      {!!course.schedule && (
        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <Text style={[styles.title, { fontSize: 18, color: colors.text }]}>Schedule</Text>
          <Text style={[styles.meta, { color: colors.muted, textAlign: 'center' }]}>{String(course.schedule)}</Text>
        </View>
      )}
      {!!Array.isArray(course.sessions) && course.sessions.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={[styles.title, { fontSize: 18, color: colors.text, textAlign: 'center' }]}>Upcoming Sessions</Text>
          {course.sessions.map((s, i) => (
            <Text key={i} style={[styles.meta, { color: colors.muted, textAlign: 'center' }]}>
              {new Date(s).toLocaleString()}
            </Text>
          ))}
        </View>
      )}
      {user ? (
        enrolledIds.includes(String(course.id)) ? (
          <TouchableOpacity onPress={() => dispatch(unjoinCourse({ userId: user.uid, courseId: course.id }))} style={{ alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text }}>Unjoin</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={async () => { await dispatch(joinCourse({ userId: user.uid, courseId: course.id })); await scheduleReminders(); }} style={{ alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.text }}>
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
      {/* Reviews */}
      <Text style={[styles.title, { fontSize: 18, color: colors.text, textAlign: 'center' }]}>Reviews</Text>
      <TextInput
        placeholder="Write a comment"
        value={reviewText}
        onChangeText={setReviewText}
        style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, color: colors.text, marginTop: 8 }}
        placeholderTextColor={colors.muted}
        multiline
      />
      <TouchableOpacity disabled={!user || !reviewText.trim()} onPress={submitReview} style={{ alignSelf: 'flex-end', marginTop: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: (colors.tertiary || colors.primary) }}>
        <Text style={{ color: (colors.onTertiary || colors.bg), fontWeight: '700' }}>Submit</Text>
      </TouchableOpacity>
      {ratings.map((r, idx) => (
        <View key={idx} style={{ marginTop: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10 }}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>★ {Number(r.rating || 0).toFixed(1)}</Text>
          {!!r.comment && <Text style={{ color: colors.text, marginTop: 4 }}>{r.comment}</Text>}
          <Text style={{ color: colors.muted, marginTop: 4 }}>{new Date(r.createdAt || Date.now()).toLocaleString()}</Text>
        </View>
      ))}
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
    </ScrollView>
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
