import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@api_cache_';
const DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes

/**
 * Cache manager for API responses
 */
class CacheManager {
    static async get(key) {
        try {
            const cached = await AsyncStorage.getItem(CACHE_PREFIX + key);

            if (!cached) return null;

            const { value, expiry } = JSON.parse(cached);

            if (expiry && Date.now() > expiry) {
                await this.remove(key);
                return null;
            }

            return value;
        } catch (error) {
            console.error('Cache read error:', error);
            return null;
        }
    }

    static async set(key, value, ttl = DEFAULT_EXPIRY) {
        try {
            const expiry = Date.now() + ttl;

            await AsyncStorage.setItem(
                CACHE_PREFIX + key,
                JSON.stringify({
                    value,
                    expiry,
                })
            );
        } catch (error) {
            console.error('Cache write error:', error);
        }
    }

    static async remove(key) {
        try {
            await AsyncStorage.removeItem(CACHE_PREFIX + key);
        } catch (error) {
            console.error('Cache remove error:', error);
        }
    }

    static async clear() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
            await AsyncStorage.multiRemove(cacheKeys);
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }
}

/**
 * Custom hook for data fetching with caching
 */
export function useCachedData(key, fetcher, options = {}) {
    const {
        ttl = DEFAULT_EXPIRY,
        enabled = true,
        onSuccess,
        onError,
    } = options;

    const [data, setData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const fetchData = React.useCallback(async (forceFetch = false) => {
        try {
            setIsLoading(true);
            setError(null);

            // Try to get from cache first
            if (!forceFetch) {
                const cached = await CacheManager.get(key);
                if (cached) {
                    setData(cached);
                    onSuccess?.(cached);
                    return;
                }
            }

            // Fetch fresh data
            const fresh = await fetcher();

            // Cache the response
            await CacheManager.set(key, fresh, ttl);

            setData(fresh);
            onSuccess?.(fresh);
        } catch (err) {
            setError(err);
            onError?.(err);
        } finally {
            setIsLoading(false);
        }
    }, [key, fetcher, ttl, onSuccess, onError]);

    React.useEffect(() => {
        if (enabled) {
            fetchData();
        }
    }, [enabled, fetchData]);

    return {
        data,
        isLoading,
        error,
        refetch: () => fetchData(true),
    };
}

export default CacheManager;