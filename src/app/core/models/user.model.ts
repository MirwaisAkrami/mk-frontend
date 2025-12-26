export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'OFFICER' | 'CLERK';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  officeId: string;
  officeName: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
