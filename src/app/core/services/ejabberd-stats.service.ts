import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root',
})
export class EjabberdStatsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async getRegisteredUsersCount(): Promise<number> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/registered-users`)
    );
    return res.data as number;
  }

  async getOnlineUsersCount(): Promise<number> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/online-users`)
    );
    return res.data as number;
  }

  async getOnlineRoomsCount(): Promise<number> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/online-rooms`)
    );
    return res.data as number;
  }

  async getUptime(): Promise<number> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/uptime`)
    );
    return res.data as number;
  }

  async getProcessesCount(): Promise<number> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/processes`)
    );
    return res.data as number;
  }

  async getS2sConnectionsIn(): Promise<number> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/s2s/in`)
    );
    return res.data as number;
  }

  async getS2sConnectionsOut(): Promise<number> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/s2s/out`)
    );
    return res.data as number;
  }

  async getStatus(): Promise<string> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/status`)
    );
    return res.data as string;
  }

  async getStats(): Promise<any> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats`)
    );
    return res.data;
  }

  async getDetailedStats(): Promise<any> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/detailed`)
    );
    return res.data;
  }

  async getRegisteredVhosts(): Promise<string[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/vhosts`)
    );
    return res.data || [];
  }

  async getClusterNodes(): Promise<string[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/cluster`)
    );
    return res.data || [];
  }

  async getClusterNodesDetailed(): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/stats/cluster/detailed`)
    );
    return res.data || [];
  }

  async clearCache(): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/stats/clear-cache`, {})
    );
  }

  async reloadConfig(): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/stats/reload-config`, {})
    );
  }

  async reopenLog(): Promise<void> {
    await firstValueFrom(
      this.http.post<Result>(`${this.apiUrl}/ejabberd/stats/reopen-log`, {})
    );
  }
}
