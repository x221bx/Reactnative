import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

    // Optimized data processing
    const featuredCourses = useMemo(() => courses.slice(0, 6), [courses]);
    const topTeachers = useMemo(() => teachers.slice(0, 6), [teachers]);

    // Main categories with icons
    const mainCategories = [
        { id: 'math', label: t('categories.math', 'Math'), icon: '📐' },
        { id: 'literature', label: t('categories.literature', 'Literature'), icon: '📚' },
        { id: 'english', label: t('categories.english', 'English'), icon: '🗣️' },
        { id: 'art', label: t('categories.art', 'Art'), icon: '🎨' },
    ];

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg
        },
        scrollContent: {
            paddingBottom: 80
        },

        // Hero Section - Improved
        hero: {
            height: 250,
            position: 'relative'
        },
        heroImage: {
            width: '100%',
            height: '100%'
        },
        heroOverlay: {
            ...StyleSheet.absoluteFillObject,
            padding: 24,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        heroTitle: {
            color: '#fff',
            fontSize: 32,
            fontWeight: '700',
            marginBottom: 8,
            lineHeight: 38,
        },
        heroSubtitle: {
            color: '#fff',
            fontSize: 16,
            opacity: 0.95,
            marginBottom: 20,
            lineHeight: 22,
        },
        heroCTA: {
            backgroundColor: colors.primary,
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 25,
            ...(Platform.OS === 'web'
                ? { boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }
                : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }
            ),
        },
        heroCTAText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '700'
        },

        // Stats Strip - Improved positioning
        statsContainer: {
            marginTop: -40,
            marginHorizontal: 20,
            marginBottom: 32,
        },

        // Section Styles - Consistent spacing
        section: {
            paddingHorizontal: 20,
            marginBottom: 32,
        },
        sectionHeader: {
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 24,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 6,
            lineHeight: 32,
        },
        sectionSubtitle: {
            fontSize: 14,
            color: colors.muted,
            lineHeight: 20,
        },
        viewAllButton: {
            position: 'absolute',
            right: 0,
            top: 4,
        },
        viewAllText: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: '600',
        },

        // Categories Grid - No horizontal scroll!
        categoriesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: 14,
            justifyContent: 'space-between',
        },
        categoryCard: {
            width: '48%',
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            marginBottom: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            ...(Platform.OS === 'web'
                ? { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
                : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }
            ),
        },
        categoryIcon: {
            fontSize: 32,
            marginBottom: 8,
        },
        categoryLabel: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
        },

        // Course Cards - Better spacing
        coursesContainer: {
            paddingLeft: 20,
        },
        courseCard: {
            width: 280,
            marginRight: 16,
        },

        // Benefits Section
        benefitsList: {
            marginTop: 12,
        },
        benefitItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 12,
            paddingRight: 20,
        },
        benefitIcon: {
            fontSize: 20,
            marginRight: 12,
            marginTop: 2,
        },
        benefitText: {
            flex: 1,
            fontSize: 15,
            color: colors.text,
            lineHeight: 22,
        },

        // Teachers Section
        teachersContainer: {
            paddingLeft: 20,
        },
        teacherCard: {
            width: 240,
            marginRight: 16,
        },

        // Class Features
        classImage: {
            width: '100%',
            height: 200,
            borderRadius: 16,
            marginBottom: 16,
        },
        featuresGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
        },
        featureChip: {
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            marginRight: 8,
            marginBottom: 8,
        },
        featureText: {
            color: colors.text,
            fontWeight: '600',
            fontSize: 14,
        },

        // Final CTA Section
        ctaSection: {
            backgroundColor: colors.primary,
            marginHorizontal: 20,
            marginBottom: 32,
            padding: 32,
            borderRadius: 20,
            alignItems: 'center',
        },
        ctaTitle: {
            color: '#fff',
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 8,
            textAlign: 'center',
        },
        ctaSubtitle: {
            color: '#fff',
            fontSize: 16,
            opacity: 0.9,
            marginBottom: 20,
            textAlign: 'center',
        },
        ctaButton: {
            backgroundColor: '#fff',
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 25,
        },
        ctaButtonText: {
            color: colors.primary,
            fontSize: 16,
            fontWeight: '700',
        },
    });

    // Render section header with optional "View All"
    const SectionHeader = ({ title, subtitle, onViewAll }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
            {onViewAll && (
                <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
                    <Text style={styles.viewAllText}>{t('common.viewAll', 'View All')}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader title={t('home.title')} showMenu />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Section */}
                  <View style={styles.hero}>
                      <Image
                          source={{ uri: 'https://picsum.photos/seed/hero/1200/600' }}
                          style={styles.heroImage}
                          resizeMode="cover"
                      />
                      <LinearGradient
                          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                          style={styles.heroOverlay}
                      >
                        <Text style={styles.heroTitle}>
                            {t('home.heroTitle', 'Learn with Experts')}
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            {t('home.heroSubtitle', 'Discover high-quality courses with top mentors')}
                        </Text>
                        <TouchableOpacity
                            style={styles.heroCTA}
                            onPress={() => user
                                ? navigation.navigate('Courses')
                                : navigation.navigate('Auth', { screen: 'Register' })
                            }
                        >
                            <Text style={styles.heroCTAText}>
                                {user
                                    ? t('home.exploreCourses', 'Explore Courses')
                                    : t('auth.startLearning', 'Start Learning Now')
                                }
                            </Text>
                        </TouchableOpacity>
                      </LinearGradient>
                  </View>

                {/* Stats Strip - Floating effect */}
                <View style={styles.statsContainer}>
                    <StatsStrip />
                </View>

                {/* Categories - Grid Layout (No Horizontal Scroll!) */}
                <View style={styles.section}>
                    <SectionHeader
                        title={t('home.categoriesTitle', 'Explore by Subject')}
                        subtitle={t('home.categoriesSubtitle', 'Choose your area of interest')}
                    />
                    <View style={styles.categoriesGrid}>
                        {mainCategories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.categoryCard}
                                onPress={() => navigation.navigate('Courses', { category: category.label })}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.categoryIcon}>{category.icon}</Text>
                                <Text style={styles.categoryLabel}>{category.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Featured Courses */}
                <View style={styles.section}>
                    <SectionHeader
                        title={t('courses.featured', 'Featured Courses')}
                        subtitle={t('courses.featuredSubtitle', 'Top-rated courses chosen for you')}
                        onViewAll={() => navigation.navigate('Courses')}
                    />
                    <FlatList
                        data={featuredCourses}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.coursesContainer}
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

                {/* How It Works */}
                <HowItWorks />

                {/* Benefits Section */}
                <View style={styles.section}>
                    <SectionHeader
                        title={t('home.benefitsTitle', 'Why Choose Our Platform?')}
                        subtitle={t('home.benefitsSubtitle', 'Transform your learning experience')}
                    />
                    <View style={styles.benefitsList}>
                        {[
                            t('home.benefit1', 'Master program knowledge at school'),
                            t('home.benefit2', 'Develop critical thinking skills'),
                            t('home.benefit3', 'Gain confidence in challenging situations'),
                            t('home.benefit4', 'Learn at your own pace with flexible schedules'),
                        ].map((benefit, index) => (
                            <View key={index} style={styles.benefitItem}>
                                <Text style={styles.benefitIcon}>✅</Text>
                                <Text style={styles.benefitText}>{benefit}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Top Teachers */}
                <View style={styles.section}>
                    <SectionHeader
                        title={t('teachers.top', 'Top Teachers')}
                        subtitle={t('teachers.topSubtitle', 'Learn from industry experts')}
                        onViewAll={() => navigation.navigate('Teachers')}
                    />
                    <FlatList
                        data={topTeachers}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.teachersContainer}
                        renderItem={({ item }) => (
                            <View style={styles.teacherCard}>
                                <ProductCard
                                    image={item.image}
                                    title={item.name}
                                    subtitle={item.title || item.specialization || item.subject || 'Instructor'}
                                    rating={item.rating}
                                    onPress={() => navigation.navigate('TeacherDetail', { teacherId: item.id })}
                                />
                            </View>
                        )}
                    />
                </View>

                {/* Class Features */}
                <View style={styles.section}>
                    <SectionHeader
                        title={t('home.classFeatures', 'What\'s in Our Classes?')}
                        subtitle={t('home.classFeaturesSubtitle', 'Interactive learning experience')}
                    />
                    <Image
                        source={{ uri: 'https://picsum.photos/seed/class/900/500' }}
                        style={styles.classImage}
                        resizeMode="cover"
                    />
                    <View style={styles.featuresGrid}>
                        {[
                            t('home.feature1', 'Live Classes'),
                            t('home.feature2', 'Q&A Sessions'),
                            t('home.feature3', 'Recorded Lessons'),
                            t('home.feature4', 'Interactive Exercises'),
                        ].map((feature, index) => (
                            <View key={index} style={styles.featureChip}>
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Testimonials */}
                <Testimonials />

                {/* Final CTA */}
                {!user && (
                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaTitle}>
                            {t('home.ctaTitle', 'Ready to Start Learning?')}
                        </Text>
                        <Text style={styles.ctaSubtitle}>
                            {t('home.ctaSubtitle', 'Join thousands of students already learning')}
                        </Text>
                        <TouchableOpacity
                            style={styles.ctaButton}
                            onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
                        >
                            <Text style={styles.ctaButtonText}>
                                {t('auth.getStarted', 'Get Started Free')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
