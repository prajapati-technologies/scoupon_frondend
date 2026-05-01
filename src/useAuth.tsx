import { create } from 'zustand';
import { AuthState, User } from './ProtectedRouteProps';

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true
  login: (userData: User, token: string) => {
    // Store token in localStorage for persistence
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state immediately
    set({ 
      user: userData, 
      isAuthenticated: true, 
      isLoading: false 
    });
  },
  logout: () => {
    // Clear all storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Update state immediately
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
  },
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  initialize: () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } else {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  }
}));

// Initialize auth state on app load
const initializeAuth = () => {
  const { initialize } = useAuth.getState();
  initialize();
};

// Call initialization
initializeAuth();