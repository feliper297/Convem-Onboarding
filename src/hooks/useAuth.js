import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

function getDisplayName(user) {
  if (!user) return 'Usuário';
  return user.user_metadata?.full_name
    || user.email?.split('@')[0]
    || 'Usuário';
}

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => {
      setSession(current);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const userName = getDisplayName(session?.user);
  const userInitials = getInitials(userName);

  return {
    session,
    loading,
    signIn,
    signOut,
    userName,
    userInitials,
    isAuthenticated: Boolean(session),
    isSupabaseConfigured,
  };
}
