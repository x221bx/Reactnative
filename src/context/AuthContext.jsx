import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../config/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const auth = getAuth(app);
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const login = useCallback(async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const userData = {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
            };
            setUser(userData);
            await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw new Error(error.message);
        }
    }, []);

    const register = useCallback(async (email, password) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const userData = {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
            };
            setUser(userData);
            await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw new Error(error.message);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            setUser(null);
            await AsyncStorage.removeItem('auth_user');
        } catch (error) {
            throw new Error(error.message);
        }
    }, []);

    const value = useMemo(
        () => ({ user, loading, login, register, logout }),
        [user, loading, login, register, logout]
    );

    if (loading) {
        return null; // Or a loading spinner
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