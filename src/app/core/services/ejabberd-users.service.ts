import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

export interface UserRow {
  username: string;
  fullName: string | null;
  registeredAt: string | null;
  lastActivityAt: string | null;
  photoThumbBase64: string | null;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

import { environment } from '../../../environments/environment';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root',
})
export class EjabberdUsersService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async getRegisteredUsers(): Promise<string[]> {
    const res = await firstValueFrom(this.http.get<Result>(`${this.apiUrl}/ejabberd/users`));
    return res.data || [];
  }

  async getRegisteredUsersDetailed(): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/detailed`)
    );
    return res.data || [];
  }

  getUserDirectory(params: {
    host: string;
    page?: number;
    size?: number;
    q?: string;
  }): Observable<PageResponse<UserRow>> {
    const queryParams: any = { host: params.host };
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.q) queryParams.q = params.q;
    return this.http.get<PageResponse<UserRow>>(`${this.apiUrl}/ejabberd/ds/users`, { params: queryParams });
  }

  async getOnlineUsers(): Promise<string[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/online`)
    );
    return res.data || [];
  }

  async getUser(username: string): Promise<any> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}`)
    );
    return res.data;
  }

  async getUserSessions(username: string): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/sessions`)
    );
    return res.data || [];
  }

  async getUserContacts(username: string): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/contacts`)
    );
    return res.data || [];
  }

  async isUserOnline(username: string): Promise<boolean> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/online`)
    );
    return res.data === true;
  }

  async kickUser(username: string, reason?: string | null): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/kick`, {
        reason: reason || null,
      })
    );
  }

  async kickSession(username: string, resource: string, reason?: string | null): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(
        `${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/kick-session`,
        {
          resource,
          reason: reason || null,
        }
      )
    );
  }

  async banUser(username: string, reason?: string | null): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/ban`, {
        reason: reason || null,
      })
    );
  }

  async unbanUser(username: string): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/unban`, {})
    );
  }

  async deactivateUser(username: string, reason?: string | null): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/deactivate`, {
        reason: reason || null,
      })
    );
  }

  async activateUser(username: string): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/activate`, {})
    );
  }

  async getUserPresence(username: string): Promise<any> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/presence`)
    );
    return res.data;
  }

  async getOfflineMessageCount(username: string): Promise<number> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/offline-count`)
    );
    return res.data as number;
  }

  async getUserResources(username: string): Promise<string[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/resources`)
    );
    return res.data || [];
  }

  async getUserRooms(username: string): Promise<string[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/rooms`)
    );
    return res.data || [];
  }

  async getUserVCard(username: string): Promise<any> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/vcard`)
    );
    return res.data;
  }

  async getUserDetail(username: string): Promise<any> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/detail`)
    );
    return res.data;
  }

  async getConnectedUsersInfo(): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/online/info`)
    );
    return res.data || [];
  }
}
