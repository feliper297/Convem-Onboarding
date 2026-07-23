import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchUserProfile } from '../services/userService';

function getDisplayName(user, profile) {
  if (profile?.fullName) return profile.fullName;
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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRecovery, setPendingRecovery] = useState(false);

  const loadProfile = useCallback(async (userId) => {
    if (!userId || !isSupabaseConfigured) {
      setProfile(null);
      return null;
    }
    try {
      const data = await fetchUserProfile(userId);
      if (data.isActive === false) {
        await supabase.auth.signOut();
        setProfile(null);
        setSession(null);
        return null;
      }
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    if (window.location.hash.includes('type=recovery')) {
      setPendingRecovery(true);
    }

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      if (current?.user?.id) {
        loadProfile(current.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, current) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPendingRecovery(true);
      }
      setSession(current);
      if (current?.user?.id && event !== 'PASSWORD_RECOVERY') {
        loadProfile(current.user.id);
      } else if (!current) {
        setProfile(null);
        setPendingRecovery(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error;

    const userProfile = await fetchUserProfile(data.user.id);
    if (userProfile?.isActive === false) {
      await supabase.auth.signOut();
      return { message: 'Sua conta foi desativada. Entre em contato com o administrador.' };
    }
    return null;
  };

  const signUp = async ({ email, password, fullName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'colaborador',
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  };

  const resendConfirmation = async (email) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return error;
  };

  const requestPasswordReset = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    return error;
  };

  const completePasswordRecovery = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) {
      setPendingRecovery(false);
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      if (session?.user?.id) {
        await loadProfile(session.user.id);
      }
    }
    return error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const userName = getDisplayName(session?.user, profile);
  const userInitials = getInitials(userName);

  return {
    session,
    profile,
    loading,
    signIn,
    signUp,
    resendConfirmation,
    requestPasswordReset,
    completePasswordRecovery,
    pendingRecovery,
    signOut,
    refreshProfile: () => loadProfile(session?.user?.id),
    userName,
    userInitials,
    isAuthenticated: Boolean(session),
    isSupabaseConfigured,
  };
}
