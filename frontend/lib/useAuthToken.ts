import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function useAuthToken() {
  const { data: session } = useSession();

  useEffect(() => {
    // Sync token to localStorage whenever session changes
    if (session?.user?.token) {
      localStorage.setItem('auth_token', session.user.token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [session]);

  return session?.user?.token || null;
}

