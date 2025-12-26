import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Permission {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  active: boolean;
  permissions: Permission[];
  userCount: number;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  active?: boolean;
  permissionIds: number[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  active?: boolean;
  permissionIds?: number[];
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
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = '/api/roles';

  getAllRoles(): Observable<Role[]> {
    return this.http
      .get<ApiResponse<Role[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getRoleById(id: number): Observable<Role> {
    return this.http
      .get<ApiResponse<Role>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createRole(request: CreateRoleRequest): Observable<Role> {
    return this.http
      .post<ApiResponse<Role>>(this.apiUrl, request)
      .pipe(map((response) => response.data));
  }

  updateRole(id: number, request: UpdateRoleRequest): Observable<Role> {
    return this.http
      .put<ApiResponse<Role>>(`${this.apiUrl}/${id}`, request)
      .pipe(map((response) => response.data));
  }

  deleteRole(id: number): Observable<string> {
    return this.http
      .delete<ApiResponse<string>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  toggleRoleStatus(id: number): Observable<Role> {
    return this.http
      .patch<ApiResponse<Role>>(`${this.apiUrl}/${id}/toggle-status`, {})
      .pipe(map((response) => response.data));
  }
}
