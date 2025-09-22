// src/hooks/use-user.ts
'use client';

import { useState, useEffect } from 'react';

// Mock user data. In a real application, you would get this
// from your authentication provider (e.g., Firebase Auth, NextAuth).
const mockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
};

type User = {
    id: string;
    name: string;
    email: string;
} | null;

/**
 * A simple hook to simulate fetching the current user.
 * @returns An object containing the current user's data.
 */
export function useUser() {
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        // Simulate an asynchronous call to an authentication service.
        const timer = setTimeout(() => {
            setUser(mockUser);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return { user };
}
