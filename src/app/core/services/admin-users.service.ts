import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async getAllUsers(): Promise<any[]> {
    const res = await firstValueFrom(this.http.get<Result>(`${this.apiUrl}/admin/users`));
    return res.data || [];
  }

  async createUser(request: any): Promise<any> {
    const res = await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/admin/users`, request)
    );
    return res.data;
  }

  async deactivateUser(userId: number): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/admin/users/${userId}/deactivate`, {})
    );
  }

  async activateUser(userId: number): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/admin/users/${userId}/activate`, {})
    );
  }

  async resetPassword(userId: number): Promise<string> {
    const res = await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/admin/users/${userId}/reset-password`, {})
    );
    return res.data as string;
  }

  async getAllRoles(): Promise<any[]> {
    const res = await firstValueFrom(this.http.get<Result>(`${this.apiUrl}/admin/users/roles`));
    return res.data || [];
  }

  async getUserRoles(userId: number): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/users/${userId}/roles`)
    );
    return res.data || [];
  }

  async assignRoles(userId: number, roleIds: number[]): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/admin/users/${userId}/roles`, {
        roleIds,
      })
    );
  }
}
