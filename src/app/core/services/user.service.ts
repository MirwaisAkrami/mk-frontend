import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserRole {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNo?: string;
  active: boolean;
  verified: boolean;
  userType?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  registrationDate?: string;
  lastLoginDate?: string;
  roles: UserRole[];
  statusName?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNo?: string;
  password: string;
  active?: boolean;
  verified?: boolean;
  userType?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  roleIds: number[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNo?: string;
  password?: string;
  active?: boolean;
  verified?: boolean;
  userType?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  roleIds?: number[];
}

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  successMessage?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getUserById(id: string): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createUser(request: CreateUserRequest): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(this.apiUrl, request)
      .pipe(map((response) => response.data));
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.apiUrl}/${id}`, request)
      .pipe(map((response) => response.data));
  }

  deleteUser(id: string): Observable<string> {
    return this.http
      .delete<ApiResponse<string>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  toggleUserStatus(id: string): Observable<User> {
    return this.http
      .patch<ApiResponse<User>>(`${this.apiUrl}/${id}/toggle-status`, {})
      .pipe(map((response) => response.data));
  }
}
