import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Local-storage based auth (no Firebase)
const USERS_KEY = '@users_db';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for stored auth on mount
    React.useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('auth_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const raw = await AsyncStorage.getItem(USERS_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (_) {
            return [];
        }
    };

    const saveUsers = async (users) => {
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    };

    const login = useCallback(async (email, password) => {
        setError(null);
        const users = await loadUsers();
        const found = users.find((u) => u.email === email && u.password === password);
        if (!found) {
            const err = new Error('Invalid email or password');
            setError(err.message);
            throw err;
        }
        const userData = {
            id: found.id,
            uid: found.id, // compatibility
            email: found.email,
            displayName: found.name || null,
            photoURL: found.photoURL || null,
            dob: found.dob || null,
            address: found.address || null,
            teacherId: found.teacherId || null,
            role: found.role || (email?.endsWith?.('@admin.com') ? 'admin' : 'student'),
        };
        setUser(userData);
        await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
        return userData;
    }, []);

    const register = useCallback(async (email, password, role = 'student', extra = {}) => {
        setError(null);
        const users = await loadUsers();
        const exists = users.some((u) => u.email === email);
        if (exists) {
            const err = new Error('Email already registered');
            setError(err.message);
            throw err;
        }
        const resolvedRole = (email?.endsWith?.('@admin.com') ? 'admin' : (role || 'student'));
        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            role: resolvedRole,
            name: extra.name || null,
            address: extra.address || null,
            dob: extra.dob || null,
            phone: extra.phone || null,
            photoURL: extra.photoURL || null,
        };
        users.push(newUser);
        await saveUsers(users);
        const userData = {
            id: newUser.id,
            uid: newUser.id, // compatibility
            email: newUser.email,
            displayName: newUser.name,
            dob: newUser.dob,
            address: newUser.address,
            role: newUser.role,
            teacherId: newUser.teacherId || null,
            photoURL: newUser.photoURL || null,
        };
        setUser(userData);
        await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
        return userData;
    }, []);

    const logout = useCallback(async () => {
        setUser(null);
        await AsyncStorage.removeItem('auth_user');
    }, []);

    const clearError = useCallback(() => setError(null), []);

    const value = useMemo(
        () => ({ user, loading, error, clearError, login, register, logout, isAdmin: (user?.role === 'admin') }),
        [user, loading, error, clearError, login, register, logout]
    );

    if (loading) {
        return null;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

