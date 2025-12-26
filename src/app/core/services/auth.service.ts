import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, UserRole, AuthState } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = signal<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });

  user = computed(() => this.authState().user);
  isAuthenticated = computed(() => this.authState().isAuthenticated);
  userRole = computed(() => this.authState().user?.role);

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {
    this.loadFromStorage();
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<Result>(`${this.apiUrl}/auth/login`, {
          username,
          password,
        })
      );

      console.log('Login response: ', response);
      

      if (response.isSuccess && response.data) {
        const { access_token, user_type } = response.data;

        const user: User = {
          id: 'self',
          username,
          fullName: username,
          email: '',
          role: this.mapUserTypeToRole(user_type),
          officeId: '',
          officeName: '',
          isActive: true,
        };

        this.authState.set({
          user,
          isAuthenticated: true,
          token: access_token,
        });

        this.saveToStorage();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  logout(): void {
    this.authState.set({
      user: null,
      isAuthenticated: false,
      token: null,
    });
    this.clearStorage();
  }

  hasRole(role: UserRole): boolean {
    return this.authState().user?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.authState().user?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  private mapUserTypeToRole(userType: string): UserRole {
    switch (userType?.toUpperCase()) {
      case 'ADMIN':
        return 'ADMIN';
      case 'SUPERVISOR':
        return 'SUPERVISOR';
      case 'OFFICER':
        return 'OFFICER';
      default:
        return 'CLERK';
    }
  }

  getToken(): string | null {
    return this.authState().token;
  }

  private saveToStorage(): void {
    const state = this.authState();
    if (state.user && state.token) {
      localStorage.setItem('auth_user', JSON.stringify(state.user));
      localStorage.setItem('auth_token', state.token);
    }
  }

  private loadFromStorage(): void {
    const userJson = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');

    if (userJson && token) {
      try {
        const user = JSON.parse(userJson) as User;
        this.authState.set({
          user,
          isAuthenticated: true,
          token,
        });
      } catch {
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }

  async validateToken(): Promise<boolean> {
    return this.getToken() !== null;
  }
}
