export const mockCourses = [
    {
        id: 1,
        title: 'Complete React Native Development',
        description: 'Learn React Native by building real-world mobile applications',
        thumbnail: 'https://example.com/images/react-native.jpg',
        price: 49.99,
        originalPrice: 99.99,
        rating: 4.7,
        ratingCount: 2843,
        category: 'Development',
        instructor: {
            id: 1,
            name: 'John Smith',
            avatar: 'https://example.com/avatars/john.jpg',
            title: 'Senior Mobile Developer'
        },
        enrolledCount: 12500,
        createdAt: '2023-01-15'
    },
    {
        id: 2,
        title: 'UI/UX Design Fundamentals',
        description: 'Master the principles of user interface and experience design',
        thumbnail: 'https://example.com/images/ui-ux.jpg',
        price: 39.99,
        originalPrice: 79.99,
        rating: 4.8,
        ratingCount: 1567,
        category: 'Design',
        instructor: {
            id: 2,
            name: 'Sarah Johnson',
            avatar: 'https://example.com/avatars/sarah.jpg',
            title: 'UX Design Lead'
        },
        enrolledCount: 8750,
        createdAt: '2023-02-20'
    }
];

export const mockTeachers = [
    {
        id: 1,
        name: 'John Smith',
        avatar: 'https://example.com/avatars/john.jpg',
        title: 'Senior Mobile Developer',
        bio: '10+ years of experience in mobile development',
        rating: 4.7,
        ratingCount: 3245,
        coursesCount: 12,
        studentsCount: 25000,
        specialties: ['React Native', 'iOS', 'Android']
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        avatar: 'https://example.com/avatars/sarah.jpg',
        title: 'UX Design Lead',
        bio: 'Design leader with focus on user experience',
        rating: 4.8,
        ratingCount: 2156,
        coursesCount: 8,
        studentsCount: 15000,
        specialties: ['UI Design', 'UX Research', 'Design Systems']
    }
];

export const mockCategories = [
    'Development',
    'Design',
    'Business',
    'Marketing',
    'Photography',
    'Music'
];