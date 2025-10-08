// Lightweight fetch wrapper with JSON parsing, auth header, timeout & retries.
// Keeps a small surface (get/post/put/patch/delete) for easy use.
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Error type used by apiClient to provide status + data context.
 */
class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }

    static getMessageForStatus(status) {
        const messages = {
            400: 'Bad Request: The request was invalid',
            401: 'Unauthorized: Please log in to continue',
            403: 'Forbidden: You don\'t have permission to access this resource',
            404: 'Not Found: The requested resource was not found',
            422: 'Validation Error: Please check your input',
            429: 'Too Many Requests: Please try again later',
            500: 'Server Error: Something went wrong on our end',
            503: 'Service Unavailable: The server is temporarily down'
        };
        return messages[status] || 'An unknown error occurred';
    }
}

async function getAuthToken() {
    try {
        return await AsyncStorage.getItem('auth_token');
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
}

async function handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;

    try {
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
    } catch (error) {
        throw new ApiError(
            'Invalid response format',
            response.status,
            { originalError: error }
        );
    }

    if (!response.ok) {
        const message = (data && data.message) || ApiError.getMessageForStatus(response.status);
        throw new ApiError(message, response.status, data);
    }

    return data;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Perform a request to `${API_URL}${endpoint}`.
 * Accepts standard fetch options plus an optional `timeout` (ms).
 */
async function request(endpoint, options = {}) {
    const token = await getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    // Add timeout
    const controller = new AbortController();
    const timeout = options.timeout || DEFAULT_TIMEOUT;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            return await handleResponse(response);
        } catch (error) {
            lastError = error;

            if (error.name === 'AbortError') {
                throw new ApiError('Request timeout', 408);
            }

            // Don't retry on certain errors
            if (error instanceof ApiError) {
                const nonRetryableStatuses = [400, 401, 403, 404, 422];
                if (nonRetryableStatuses.includes(error.status)) {
                    throw error;
                }
            }

            // Last attempt, throw the error
            if (attempt === MAX_RETRIES) {
                if (error instanceof ApiError) {
                    throw error;
                }
                throw new ApiError(
                    'Network error after multiple retries',
                    0,
                    { originalError: error }
                );
            }

            // Wait before retrying
            await delay(RETRY_DELAY * attempt);
        }
    }
}

/**
 * Minimal JSON client with sensible defaults.
 */
export const apiClient = {
    get: (endpoint, options = {}) =>
        request(endpoint, { ...options, method: 'GET' }),

    post: (endpoint, data, options = {}) =>
        request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        }),

    put: (endpoint, data, options = {}) =>
        request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (endpoint, options = {}) =>
        request(endpoint, { ...options, method: 'DELETE' }),

    patch: (endpoint, data, options = {}) =>
        request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
};

export { ApiError };
