import { User } from '@/types';
import users from '@/data/users.json';

class AuthService {
  private currentUser: User | null = null;
  private storageKey = 'currentUser';

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.currentUser = JSON.parse(stored);
        }
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    }
  }

  private saveUserToStorage(user: User | null) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (user) {
          localStorage.setItem(this.storageKey, JSON.stringify(user));
        } else {
          localStorage.removeItem(this.storageKey);
        }
      }
    } catch (error) {
      console.error('Failed to save user to storage:', error);
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        this.currentUser = user;
        this.saveUserToStorage(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  async register(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        verified: false,
      };
      this.currentUser = newUser;
      this.saveUserToStorage(newUser);
      return newUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    this.saveUserToStorage(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();