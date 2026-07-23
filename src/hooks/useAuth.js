import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchUserProfile } from '../services/userService';

function getDisplayName(email, profile) {
  if (profile?.fullName) return profile.fullName;
  if (!email) return 'Usuário';
  return email.split('@')[0] || 'Usuário';
}

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function syncAuthState(session) {
  return {
    userId: session?.user?.id ?? null,
    userEmail: session?.user?.email ?? '',
    isAuthenticated: Boolean(session),
  };
}

export default function useAuth() {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRecovery, setPendingRecovery] = useState(false);

  const applySession = useCallback((session) => {
    const next = syncAuthState(session);
    setUserId(next.userId);
    setUserEmail(next.userEmail);
    setIsAuthenticated(next.isAuthenticated);
    return next.userId;
  }, []);

  const loadProfile = useCallback(async (id) => {
    if (!id || !isSupabaseConfigured) {
      setProfile(null);
      return null;
    }
    try {
      const data = await fetchUserProfile(id);
      if (data.isActive === false) {
        await supabase.auth.signOut();
        setProfile(null);
        setUserId(null);
        setUserEmail('');
        setIsAuthenticated(false);
        return null;
      }
      setProfile(data);
      return data;
    } catch {
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
      const id = applySession(current);
      if (id) {
        loadProfile(id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, current) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPendingRecovery(true);
      }
      const id = applySession(current);
      if (id && event !== 'PASSWORD_RECOVERY') {
        loadProfile(id);
      } else if (!current) {
        setProfile(null);
        setPendingRecovery(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [applySession, loadProfile]);

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
      if (userId) {
        await loadProfile(userId);
      }
    }
    return error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setUserEmail('');
    setIsAuthenticated(false);
    setProfile(null);
  };

  const userName = getDisplayName(userEmail, profile);
  const userInitials = getInitials(userName);

  return {
    userId,
    userEmail,
    profile,
    loading,
    signIn,
    signUp,
    resendConfirmation,
    requestPasswordReset,
    completePasswordRecovery,
    pendingRecovery,
    signOut,
    refreshProfile: () => loadProfile(userId),
    userName,
    userInitials,
    isAuthenticated,
    isSupabaseConfigured,
  };
}
