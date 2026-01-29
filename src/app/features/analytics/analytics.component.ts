import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { EjabberdAnalyticsService } from '../../core/services/ejabberd-analytics.service';
import {
  ServiceAnalyticsService,
  OnlineSummary,
  ConnectedUser,
  MessageThroughput,
  TopActiveUser,
  ConnectivityDistribution,
  Broadcaster,
  GroupEcosystem,
  TopActiveRoom,
  OnlineRoom,
  OccupancyDistribution,
  DormantRoom,
  SpoolPressure,
  TopSpoolUser,
  PushHealth,
  PushServiceBreakdown,
  RosterHealth,
  RosterDistribution,
} from '../../core/services/service-analytics.service';

interface WidgetState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, BaseChartDirective],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(EjabberdAnalyticsService);
  private serviceAnalytics = inject(ServiceAnalyticsService);

  loading = signal(true);
  error = signal<string | null>(null);

  systemHealth = signal<any | null>(null);
  suspiciousActivities = signal<any[]>([]);

  // Global date range
  globalFromStr = '';
  globalToStr = '';

  // Service Analytics States
  onlineSummary = signal<WidgetState<OnlineSummary>>({ loading: false, error: null, data: null });
  connectedUsers = signal<WidgetState<ConnectedUser[]>>({ loading: false, error: null, data: [] });
  throughput = signal<WidgetState<MessageThroughput>>({ loading: false, error: null, data: null });
  topActiveUsers = signal<WidgetState<TopActiveUser[]>>({ loading: false, error: null, data: [] });
  connectivity = signal<WidgetState<ConnectivityDistribution>>({ loading: false, error: null, data: null });
  broadcasters = signal<WidgetState<Broadcaster[]>>({ loading: false, error: null, data: [] });
  groupEcosystem = signal<WidgetState<GroupEcosystem>>({ loading: false, error: null, data: null });
  topActiveRooms = signal<WidgetState<TopActiveRoom[]>>({ loading: false, error: null, data: [] });
  onlineRooms = signal<WidgetState<OnlineRoom[]>>({ loading: false, error: null, data: [] });
  occupancyDist = signal<WidgetState<OccupancyDistribution>>({ loading: false, error: null, data: null });
  dormantRooms = signal<WidgetState<DormantRoom[]>>({ loading: false, error: null, data: [] });
  spoolPressure = signal<WidgetState<SpoolPressure>>({ loading: false, error: null, data: null });
  topSpoolUsers = signal<WidgetState<TopSpoolUser[]>>({ loading: false, error: null, data: [] });
  pushHealth = signal<WidgetState<PushHealth>>({ loading: false, error: null, data: null });
  pushByService = signal<WidgetState<PushServiceBreakdown[]>>({ loading: false, error: null, data: [] });
  rosterHealth = signal<WidgetState<RosterHealth>>({ loading: false, error: null, data: null });
  rosterDist = signal<WidgetState<RosterDistribution>>({ loading: false, error: null, data: null });

  // Chart options
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: false } },
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: true, position: 'top' } },
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    plugins: { legend: { position: 'right' } },
  };

  // Computed chart data
  throughputChartData = computed<ChartData<'line'> | null>(() => {
    const data = this.throughput().data;
    if (!data?.points?.length) return null;
    return {
      labels: data.points.map((p) => this.formatTimestamp(p.timestamp)),
      datasets: [
        {
          label: 'Direct',
          data: data.points.map((p) => p.directCount),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
        },
        {
          label: 'Group',
          data: data.points.map((p) => p.groupCount),
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
        },
      ],
    };
  });

  connectivityChartData = computed<ChartData<'bar'> | null>(() => {
    const data = this.connectivity().data;
    if (!data) return null;
    return {
      labels: ['1 peer', '2-5 peers', '6-20 peers', '21+ peers'],
      datasets: [
        {
          data: [data.bucket1, data.bucket2To5, data.bucket6To20, data.bucket21Plus],
          backgroundColor: ['#ef4444', '#f97316', '#22c55e', '#3b82f6'],
        },
      ],
    };
  });

  occupancyChartData = computed<ChartData<'bar'> | null>(() => {
    const data = this.occupancyDist().data;
    if (!data) return null;
    return {
      labels: ['0-1', '2-5', '6-20', '21+'],
      datasets: [
        {
          data: [data.bucket0To1, data.bucket2To5, data.bucket6To20, data.bucket21Plus],
          backgroundColor: ['#94a3b8', '#f97316', '#22c55e', '#3b82f6'],
        },
      ],
    };
  });

  pushServiceChartData = computed<ChartData<'doughnut'> | null>(() => {
    const data = this.pushByService().data;
    if (!data?.length) return null;
    return {
      labels: data.map((d) => d.service),
      datasets: [
        {
          data: data.map((d) => d.sessionCount),
          backgroundColor: ['#3b82f6', '#22c55e', '#f97316', '#ef4444', '#8b5cf6'],
        },
      ],
    };
  });

  rosterDistChartData = computed<ChartData<'bar'> | null>(() => {
    const data = this.rosterDist().data;
    if (!data) return null;
    return {
      labels: ['0', '1-5', '6-20', '21+'],
      datasets: [
        {
          data: [data.bucket0, data.bucket1To5, data.bucket6To20, data.bucket21Plus],
          backgroundColor: ['#ef4444', '#f97316', '#22c55e', '#3b82f6'],
        },
      ],
    };
  });

  async ngOnInit(): Promise<void> {
    this.initGlobalDates();
    await this.load();
    await this.loadServiceAnalytics();
  }

  private initGlobalDates(): void {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    this.globalFromStr = this.toLocalDateTimeString(thirtyDaysAgo);
    this.globalToStr = this.toLocalDateTimeString(now);
  }

  private toLocalDateTimeString(date: Date): string {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  private getFromDate(): Date {
    return new Date(this.globalFromStr);
  }

  private getToDate(): Date {
    return new Date(this.globalToStr);
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const [health, suspicious] = await Promise.all([
        this.analyticsService.getSystemHealth(),
        this.analyticsService.getAllSuspiciousActivities(),
      ]);

      this.systemHealth.set(health);
      this.suspiciousActivities.set(suspicious);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load analytics');
    } finally {
      this.loading.set(false);
    }
  }

  async loadServiceAnalytics(): Promise<void> {
    await Promise.all([
      this.refreshOnlineSummary(),
      this.refreshThroughput(),
      this.refreshTopActiveUsers(),
      this.refreshConnectivity(),
      this.refreshGroupEcosystem(),
      this.refreshTopActiveRooms(),
      this.refreshOnlineRooms(),
      this.refreshOccupancyDist(),
      this.refreshSpoolPressure(),
      this.refreshTopSpoolUsers(),
      this.refreshPushHealth(),
      this.refreshPushByService(),
      this.refreshRosterHealth(),
      this.refreshRosterDist(),
    ]);
  }

  async refreshAll(): Promise<void> {
    await this.load();
    await this.loadServiceAnalytics();
  }

  // ==================== Refresh Methods ====================

  async refreshOnlineSummary(): Promise<void> {
    this.onlineSummary.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getOnlineSummary();
      this.onlineSummary.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.onlineSummary.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshConnectedUsers(): Promise<void> {
    this.connectedUsers.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getConnectedUsers(0, 20);
      this.connectedUsers.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.connectedUsers.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshThroughput(): Promise<void> {
    this.throughput.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getMessageThroughput(this.getFromDate(), this.getToDate());
      this.throughput.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.throughput.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshTopActiveUsers(): Promise<void> {
    this.topActiveUsers.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getTopActiveUsers(this.getFromDate(), this.getToDate(), 10);
      this.topActiveUsers.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.topActiveUsers.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshConnectivity(): Promise<void> {
    this.connectivity.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getConnectivityDistribution(this.getFromDate(), this.getToDate());
      this.connectivity.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.connectivity.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshBroadcasters(): Promise<void> {
    this.broadcasters.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getTopBroadcasters(this.getFromDate(), this.getToDate(), 10);
      this.broadcasters.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.broadcasters.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshGroupEcosystem(): Promise<void> {
    this.groupEcosystem.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getGroupEcosystemSummary(this.getFromDate(), this.getToDate());
      this.groupEcosystem.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.groupEcosystem.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshTopActiveRooms(): Promise<void> {
    this.topActiveRooms.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getTopActiveRooms(this.getFromDate(), this.getToDate(), 10);
      this.topActiveRooms.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.topActiveRooms.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshOnlineRooms(): Promise<void> {
    this.onlineRooms.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getOnlineRoomsWithOccupancy(10);
      this.onlineRooms.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.onlineRooms.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshOccupancyDist(): Promise<void> {
    this.occupancyDist.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getOccupancyDistribution();
      this.occupancyDist.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.occupancyDist.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshDormantRooms(): Promise<void> {
    this.dormantRooms.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getDormantRooms(30, 20);
      this.dormantRooms.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.dormantRooms.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshSpoolPressure(): Promise<void> {
    this.spoolPressure.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getSpoolSummary();
      this.spoolPressure.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.spoolPressure.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshTopSpoolUsers(): Promise<void> {
    this.topSpoolUsers.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getTopSpoolUsers(10);
      this.topSpoolUsers.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.topSpoolUsers.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshPushHealth(): Promise<void> {
    this.pushHealth.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getPushSummary();
      this.pushHealth.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.pushHealth.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshPushByService(): Promise<void> {
    this.pushByService.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getPushByService();
      this.pushByService.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.pushByService.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshRosterHealth(): Promise<void> {
    this.rosterHealth.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getRosterSummary();
      this.rosterHealth.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.rosterHealth.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  async refreshRosterDist(): Promise<void> {
    this.rosterDist.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.serviceAnalytics.getRosterDistribution();
      this.rosterDist.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.rosterDist.update((s) => ({ ...s, loading: false, error: e?.message }));
    }
  }

  // ==================== Utility Methods ====================

  formatTimestamp(ts: string): string {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatNumber(n: number | undefined | null): string {
    if (n === null || n === undefined) return '0';
    return n.toLocaleString();
  }

  formatAge(seconds: number | undefined | null): string {
    if (!seconds) return '-';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  }
}
