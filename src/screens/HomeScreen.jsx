import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../i18n/i18n';
import useAuth from '../hooks/useAuth';
import useCourses from '../hooks/useCourses';
import useTeachers from '../hooks/useTeachers';
import AppHeader from '../components/ui/AppHeader';
import ProductCard from '../components/ui/ProductCard';
import StatsStrip from '../components/home/StatsStrip';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { courses } = useCourses();
  const { teachers } = useTeachers();
  const { user } = useAuth();

  const featuredCourses = useMemo(() => courses.slice(0, 6), [courses]);
  const topTeachers = useMemo(() => teachers.slice(0, 6), [teachers]);
  const categories = useMemo(
    () =>
      Array.from(new Set(courses.map((c) => c.category || c.level || (Array.isArray(c.topics) ? c.topics[0] : null))))
        .filter(Boolean)
        .slice(0, 8),
    [courses]
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    scrollContent: { paddingBottom: 120 },
    hero: { height: 300, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', padding: 20, justifyContent: 'center', alignItems: 'center' },
    heroTitle: { color: '#fff', fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
    heroSubtitle: { color: '#fff', fontSize: 18, textAlign: 'center', opacity: 0.9, marginBottom: 10 },
    section: { padding: 20 },
    sectionTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 15 },
    sectionSubtitle: { fontSize: 16, color: colors.muted, marginBottom: 20 },
    courseCard: { width: 280, marginRight: 15 },
    teacherCard: { width: 240, marginRight: 15 },
    button: { backgroundColor: colors.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, marginTop: 20 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    categoriesContainer: { paddingHorizontal: 20, marginVertical: 20 },
    categoryChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.primary, marginRight: 10 },
    categoryText: { color: '#fff', fontWeight: 'bold' },
  });

  return (
    <View style={styles.container}>
      <AppHeader title={t('home.title')} showMenu />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={require('../../assets/imported/images/hero.jpg')} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{t('home.heroTitle', 'تعلم مع الخبراء')}</Text>
            <Text style={styles.heroSubtitle}>{t('home.heroSubtitle', 'اكتشف دورات عالية الجودة مع أفضل المدربين')}</Text>
            {!user && (
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Auth', { screen: 'Register' })}>
                <Text style={styles.buttonText}>{t('auth.startLearning', 'ابدأ التعلم الآن')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <StatsStrip />

        {/* Subjects (4 areas) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lessons revolve around 4 areas</Text>
          <Text style={styles.sectionSubtitle}>Diverse lessons around Math, Literature, English, Art</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Math', 'Literature', 'English', 'Art'].map((label) => (
              <TouchableOpacity
                key={label}
                style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, margin: 6 }}
                onPress={() => navigation.navigate('Courses', { category: label })}
              >
                <Text style={{ color: colors.text, fontWeight: '700' }}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity key={category} style={styles.categoryChip} onPress={() => navigation.navigate('Courses', { category })}>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('courses.featured', 'دورات مميزة')}</Text>
          <Text style={styles.sectionSubtitle}>{t('courses.featuredSubtitle', 'اكتشف أحدث الدورات المميزة في مجالك')}</Text>
          <FlatList
            data={featuredCourses}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.courseCard}>
                <ProductCard
                  image={item.image}
                  title={item.title}
                  subtitle={item.category || item.level || (Array.isArray(item.topics) ? item.topics[0] : 'General')}
                  price={item.price}
                  rating={item.rating}
                  onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
                />
              </View>
            )}
          />
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What will your child get after studying at Edudu?</Text>
          <View style={{ marginTop: 8 }}>
            {[
              'Master program knowledge at school',
              'The ability to criticize knowledge increases',
              'Respond confidently when encountering difficult situations',
            ].map((line) => (
              <View key={line} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>✅</Text>
                <Text style={{ color: colors.text }}>{line}</Text>
              </View>
            ))}
          </View>
        </View>

        <HowItWorks />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('teachers.top', 'أفضل المدربين')}</Text>
          <Text style={styles.sectionSubtitle}>{t('teachers.topSubtitle', 'تعلم من خبراء المجال')}</Text>
          <FlatList
            data={topTeachers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.teacherCard}>
                <ProductCard
                  image={item.image}
                  title={item.name}
                  subtitle={item.title || item.specialization || item.subject || '-'}
                  rating={item.rating}
                  onPress={() => navigation.navigate('TeacherDetail', { teacherId: item.id })}
                />
              </View>
            )}
          />
        </View>

        {/* What's in the class at Edudu? */}
        <View style={[styles.section, { paddingTop: 0 }]}>
          <Text style={styles.sectionTitle}>What's in the class at Edudu?</Text>
          <Text style={styles.sectionSubtitle}>Online classes with teachers, Q&A during class, and recorded sessions for review.</Text>
          <Image source={{ uri: 'https://picsum.photos/seed/class/900/500' }} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Audio Classes', 'Live Classes', 'Recorded Classes'].map((label) => (
              <TouchableOpacity key={label} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, margin: 6 }}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Testimonials />
      </ScrollView>
    </View>
  );
}




