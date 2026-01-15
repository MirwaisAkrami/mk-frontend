import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Result } from '../models/result';
import {
  DashboardSummary,
  Timeseries,
  TopUser,
  TopConversation,
  OnlineRoom,
  SpoolSummary,
  MessageShare,
  UserDetailStats,
  Granularity,
  MessageScope,
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private buildParams(options: {
    from?: string;
    to?: string;
    granularity?: Granularity;
    scope?: MessageScope;
    host?: string;
    page?: number;
    size?: number;
  }): HttpParams {
    let params = new HttpParams();
    if (options.from) params = params.set('from', options.from);
    if (options.to) params = params.set('to', options.to);
    if (options.granularity) params = params.set('granularity', options.granularity);
    if (options.scope) params = params.set('scope', options.scope);
    if (options.host) params = params.set('host', options.host);
    if (options.page !== undefined) params = params.set('page', options.page.toString());
    if (options.size !== undefined) params = params.set('size', options.size.toString());
    return params;
  }

  async getSummary(options: {
    from?: string;
    to?: string;
    granularity?: Granularity;
    scope?: MessageScope;
    host?: string;
  } = {}): Promise<DashboardSummary> {
    const params = this.buildParams(options);
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/dashboard/summary`, { params })
    );
    return res.data as DashboardSummary;
  }

  async getMessagesTimeseries(options: {
    from?: string;
    to?: string;
    granularity?: Granularity;
    scope?: MessageScope;
    host?: string;
  } = {}): Promise<Timeseries> {
    const params = this.buildParams(options);
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/dashboard/messages/timeseries`, { params })
    );
    return res.data as Timeseries;
  }

  async getNewUsersTimeseries(options: {
    from?: string;
    to?: string;
    granularity?: Granularity;
    host?: string;
  } = {}): Promise<Timeseries> {
    const params = this.buildParams(options);
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/dashboard/users/new/timeseries`, { params })
    );
    return res.data as Timeseries;
  }

  async getActiveUsersTimeseries(options: {
    from?: string;
    to?: string;
    granularity?: Granularity;
    host?: string;
  } = {}): Promise<Timeseries> {
    const params = this.buildParams(options);
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/dashboard/users/active/timeseries`, { params })
    );
    return res.data as Timeseries;
  }

  async getTopUsers(options: {
    from?: string;
    to?: string;
    granularity?: Granularity;
    scope?: MessageScope;
    host?: string;
    page?: number;
    size?: number;
  } = {}): Promise<TopUser[]> {
    const params = this.buildParams(options);
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/dashboard/top/users`, { params })
    );
    return (res.data || []) as TopUser[];
  }

  async getTopConversations(options: {
    from?: string;
    to?: string;
    granularity?: Granularity;
    host?: string;
    page?: number;
    size?: number;
  } = {}): Promise<TopConversation[]> {
    const params = this.buildParams(options);
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/dashboard/top/conversations`, { params })
    );
    return (res.data || []) as TopConversation[];
  }

  async getOnlineRooms(options: {
    page?: number;
    size?: number;
  } = {}): Promise<OnlineRoom[]> {
    const params = this.buildParams(options);
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/dashboard/rooms/online`, { params })
    );
    return (res.data || []) as OnlineRoom[];
  }

  async getSpoolSummary(options: {
    page?: number;
    size?: number;
  } = {}): Promise<SpoolSummary[]> {
    const params = this.buildParams(options);
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/dashboard/spool/summary`, { params })
    );
    return (res.data || []) as SpoolSummary[];
  }

  async getMessageShare(options: {
    from?: string;
    to?: string;
    host?: string;
  } = {}): Promise<MessageShare> {
    const params = this.buildParams(options);
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/dashboard/messages/share`, { params })
    );
    return res.data as MessageShare;
  }

  async getUserDetailStats(
    username: string,
    options: {
      from?: string;
      to?: string;
      granularity?: Granularity;
    } = {}
  ): Promise<UserDetailStats> {
    const params = this.buildParams(options);
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/admin/dashboard/users/${username}/stats`, { params })
    );
    return res.data as UserDetailStats;
  }
}
