import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root',
})
export class EjabberdAnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async getDashboardStats(): Promise<any> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/dashboard`)
    );
    return res.data;
  }

  async getSystemHealth(): Promise<any> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/system-health`)
    );
    return res.data;
  }

  async getAllSuspiciousActivities(): Promise<any[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/suspicious-activities`)
    );
    return res.data || [];
  }
}
