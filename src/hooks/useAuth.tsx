import { create } from 'zustand';

export type AppRole = 'admin' | 'distributor' | 'customer';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: AppRole) => Promise<void>;
  logout: () => void;
  hasRole: (role: AppRole) => boolean;
  isAdmin: () => boolean;
  isDistributor: () => boolean;
  isCustomer: () => boolean;
}

// Mock user for development
const mockUsers: Record<string, User> = {
  'admin@aquadelivery.com': {
    id: '1',
    email: 'admin@aquadelivery.com',
    full_name: 'Administrador',
    role: 'admin',
  },
  'distributor@aquadelivery.com': {
    id: '2',
    email: 'distributor@aquadelivery.com',
    full_name: 'Distribuidora Teste',
    role: 'distributor',
  },
  'customer@aquadelivery.com': {
    id: '3',
    email: 'customer@aquadelivery.com',
    full_name: 'João Cliente',
    role: 'customer',
  },
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string, role?: AppRole) => {
    // Mock login - aceita qualquer senha
    const user = mockUsers[email];
    if (user && (!role || user.role === role)) {
      set({ user, isAuthenticated: true });
    } else {
      throw new Error('Credenciais inválidas');
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  hasRole: (role: AppRole) => {
    const { user } = get();
    return user?.role === role;
  },
  
  isAdmin: () => {
    return get().hasRole('admin');
  },
  
  isDistributor: () => {
    return get().hasRole('distributor');
  },
  
  isCustomer: () => {
    return get().hasRole('customer');
  },
}));
