import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for an active session on page load
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      handleSession(data.session);
      setLoading(false);
    };
    
    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSession = (session: Session | null) => {
    if (session && session.user) {
      setUserFromSupabase(session.user);
    } else {
      setUser(null);
    }
  };

  const setUserFromSupabase = (supabaseUser: SupabaseUser) => {
    setUser({
      id: supabaseUser.id,
      email: supabaseUser.email || undefined,
      avatar_url: supabaseUser.user_metadata?.avatar_url,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};