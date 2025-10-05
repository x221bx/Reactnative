/**
 * @typedef {Object} Review
 * @property {string} id - Review unique identifier
 * @property {string} userId - ID of the user who left the review
 * @property {string} userName - Name of the user who left the review
 * @property {string} userImage - Profile image URL of the user
 * @property {number} rating - Rating given (1-5)
 * @property {string} comment - Review text
 * @property {string} date - Review date
 * @property {string} courseId - Course ID (for course reviews)
 * @property {string} teacherId - Teacher ID (for teacher reviews)
 * @property {boolean} verified - Whether the review is from a verified purchase
 */

// Examples of reviews
export const reviews = [
    {
        id: 'r1',
        userId: 'u1',
        userName: 'John Doe',
        userImage: 'https://picsum.photos/seed/user1/100/100',
        rating: 5,
        comment: 'Excellent course! The instructor explained everything clearly.',
        date: '2025-10-01',
        courseId: 'c1',
        teacherId: 't1',
        verified: true
    },
    {
        id: 'r2',
        userId: 'u2',
        userName: 'Jane Smith',
        userImage: 'https://picsum.photos/seed/user2/100/100',
        rating: 4,
        comment: 'Very helpful content, but could use more examples.',
        date: '2025-09-28',
        courseId: 'c1',
        teacherId: 't1',
        verified: true
    }
];