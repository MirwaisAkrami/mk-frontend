import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { EjabberdAnalyticsService } from '../../core/services/ejabberd-analytics.service';
import { EjabberdStatsService } from '../../core/services/ejabberd-stats.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);

  dashboardStats = signal<any | null>(null);
  systemHealth = signal<any | null>(null);
  registeredUsers = signal<number | null>(null);
  onlineUsers = signal<number | null>(null);
  onlineRooms = signal<number | null>(null);

  constructor(
    private analyticsService: EjabberdAnalyticsService,
    private statsService: EjabberdStatsService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const [dashboardStats, systemHealth, registeredUsers, onlineUsers, onlineRooms] =
        await Promise.all([
          this.analyticsService.getDashboardStats(),
          this.analyticsService.getSystemHealth(),
          this.statsService.getRegisteredUsersCount(),
          this.statsService.getOnlineUsersCount(),
          this.statsService.getOnlineRoomsCount(),
        ]);

      this.dashboardStats.set(dashboardStats);
      this.systemHealth.set(systemHealth);
      this.registeredUsers.set(registeredUsers);
      this.onlineUsers.set(onlineUsers);
      this.onlineRooms.set(onlineRooms);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load dashboard');
    } finally {
      this.loading.set(false);
    }
  }
}
