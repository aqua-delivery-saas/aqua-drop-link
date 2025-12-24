import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'distributor' | 'customer';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  isAdmin: () => boolean;
  isDistributor: () => boolean;
  isCustomer: () => boolean;
}

const fetchUserRole = async (userId: string): Promise<AppRole | null> => {
  // Check roles in order of priority
  const roles: AppRole[] = ['admin', 'distributor', 'customer'];
  
  for (const role of roles) {
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: role,
    });
    
    if (!error && data === true) {
      return role;
    }
  }
  
  return null;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    // Set up auth state listener FIRST
    supabase.auth.onAuthStateChange(
      (event, session) => {
        // Synchronous state updates only
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
        });

        // Defer role fetching with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(async () => {
            const role = await fetchUserRole(session.user.id);
            set({ role, isLoading: false });
          }, 0);
        } else {
          set({ role: null, isLoading: false });
        }
      }
    );

    // THEN check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      set({
        session,
        user: session.user,
        isAuthenticated: true,
      });
      
      const role = await fetchUserRole(session.user.id);
      set({ role, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ isLoading: false });
      throw error;
    }

    if (data.user) {
      const role = await fetchUserRole(data.user.id);
      set({
        user: data.user,
        session: data.session,
        role,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  },

  signUp: async (email: string, password: string, fullName?: string) => {
    set({ isLoading: true });
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      set({ isLoading: false });
      throw error;
    }

    set({ isLoading: false });
    
    // Note: User may need to confirm email before being fully authenticated
    return;
  },

  logout: async () => {
    set({ isLoading: true });
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      set({ isLoading: false });
      throw error;
    }

    set({
      user: null,
      session: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  hasRole: (role: AppRole) => {
    const { role: currentRole } = get();
    return currentRole === role;
  },

  isAdmin: () => get().hasRole('admin'),
  isDistributor: () => get().hasRole('distributor'),
  isCustomer: () => get().hasRole('customer'),
}));
