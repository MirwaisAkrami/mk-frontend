import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardApiService } from '../../core/services/dashboard-api.service';
import {
  DashboardSummary,
  Timeseries,
  TopUser,
  TopConversation,
  OnlineRoom,
  SpoolSummary,
  MessageShare,
  Granularity,
  MessageScope,
} from '../../core/models/dashboard.model';
import { DashboardFiltersComponent, DashboardFiltersValue } from './components/dashboard-filters.component';
import { KpiCardsComponent } from './components/kpi-cards.component';
import { SimpleChartComponent, ChartDataset } from './components/simple-chart.component';
import { DashboardTablesComponent } from './components/dashboard-tables.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DashboardFiltersComponent,
    KpiCardsComponent,
    SimpleChartComponent,
    DashboardTablesComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  @ViewChild(DashboardFiltersComponent) filtersComponent!: DashboardFiltersComponent;

  loading = signal(true);
  error = signal<string | null>(null);

  summary = signal<DashboardSummary | null>(null);
  messagesTimeseries = signal<Timeseries | null>(null);
  newUsersTimeseries = signal<Timeseries | null>(null);
  activeUsersTimeseries = signal<Timeseries | null>(null);
  messageShare = signal<MessageShare | null>(null);
  topUsers = signal<TopUser[]>([]);
  topConversations = signal<TopConversation[]>([]);
  onlineRooms = signal<OnlineRoom[]>([]);
  spoolSummary = signal<SpoolSummary[]>([]);

  loadingSummary = signal(false);
  loadingMessagesChart = signal(false);
  loadingNewUsersChart = signal(false);
  loadingActiveUsersChart = signal(false);
  loadingMessageShare = signal(false);
  loadingTopUsers = signal(false);
  loadingTopConversations = signal(false);
  loadingOnlineRooms = signal(false);
  loadingSpoolSummary = signal(false);

  currentFilters: DashboardFiltersValue = {
    datePreset: 'last7days',
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
    granularity: 'DAY',
    scope: 'ALL',
  };

  constructor(private dashboardApi: DashboardApiService) {}

  async ngOnInit(): Promise<void> {
    await this.loadAll();
  }

  onFiltersChange(filters: DashboardFiltersValue): void {
    this.currentFilters = filters;
    this.loadAll();
  }

  async loadAll(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    const params = this.getApiParams();

    await Promise.all([
      this.loadSummary(params),
      this.loadMessagesTimeseries(params),
      this.loadNewUsersTimeseries(params),
      this.loadActiveUsersTimeseries(params),
      this.loadMessageShare(params),
      this.loadTopUsers(params),
      this.loadTopConversations(params),
      this.loadOnlineRooms(),
      this.loadSpoolSummary(),
    ]);

    this.loading.set(false);
  }

  private getApiParams(): { from: string; to: string; granularity: Granularity; scope: MessageScope } {
    return {
      from: this.currentFilters.from.toISOString(),
      to: this.currentFilters.to.toISOString(),
      granularity: this.currentFilters.granularity,
      scope: this.currentFilters.scope,
    };
  }

  private async loadSummary(params: { from: string; to: string; granularity: Granularity; scope: MessageScope }): Promise<void> {
    this.loadingSummary.set(true);
    try {
      const data = await this.dashboardApi.getSummary(params);
      this.summary.set(data);
    } catch (e: any) {
      console.error('Failed to load summary', e);
    } finally {
      this.loadingSummary.set(false);
    }
  }

  private async loadMessagesTimeseries(params: { from: string; to: string; granularity: Granularity; scope: MessageScope }): Promise<void> {
    this.loadingMessagesChart.set(true);
    try {
      const data = await this.dashboardApi.getMessagesTimeseries(params);
      this.messagesTimeseries.set(data);
    } catch (e: any) {
      console.error('Failed to load messages timeseries', e);
    } finally {
      this.loadingMessagesChart.set(false);
    }
  }

  private async loadNewUsersTimeseries(params: { from: string; to: string; granularity: Granularity }): Promise<void> {
    this.loadingNewUsersChart.set(true);
    try {
      const data = await this.dashboardApi.getNewUsersTimeseries(params);
      this.newUsersTimeseries.set(data);
    } catch (e: any) {
      console.error('Failed to load new users timeseries', e);
    } finally {
      this.loadingNewUsersChart.set(false);
    }
  }

  private async loadActiveUsersTimeseries(params: { from: string; to: string; granularity: Granularity }): Promise<void> {
    this.loadingActiveUsersChart.set(true);
    try {
      const data = await this.dashboardApi.getActiveUsersTimeseries(params);
      this.activeUsersTimeseries.set(data);
    } catch (e: any) {
      console.error('Failed to load active users timeseries', e);
    } finally {
      this.loadingActiveUsersChart.set(false);
    }
  }

  private async loadMessageShare(params: { from: string; to: string }): Promise<void> {
    this.loadingMessageShare.set(true);
    try {
      const data = await this.dashboardApi.getMessageShare(params);
      this.messageShare.set(data);
    } catch (e: any) {
      console.error('Failed to load message share', e);
    } finally {
      this.loadingMessageShare.set(false);
    }
  }

  private async loadTopUsers(params: { from: string; to: string; granularity: Granularity; scope: MessageScope }): Promise<void> {
    this.loadingTopUsers.set(true);
    try {
      const data = await this.dashboardApi.getTopUsers({ ...params, size: 10 });
      this.topUsers.set(data);
    } catch (e: any) {
      console.error('Failed to load top users', e);
    } finally {
      this.loadingTopUsers.set(false);
    }
  }

  private async loadTopConversations(params: { from: string; to: string; granularity: Granularity }): Promise<void> {
    this.loadingTopConversations.set(true);
    try {
      const data = await this.dashboardApi.getTopConversations({ ...params, size: 10 });
      this.topConversations.set(data);
    } catch (e: any) {
      console.error('Failed to load top conversations', e);
    } finally {
      this.loadingTopConversations.set(false);
    }
  }

  private async loadOnlineRooms(): Promise<void> {
    this.loadingOnlineRooms.set(true);
    try {
      const data = await this.dashboardApi.getOnlineRooms({ size: 10 });
      this.onlineRooms.set(data);
    } catch (e: any) {
      console.error('Failed to load online rooms', e);
    } finally {
      this.loadingOnlineRooms.set(false);
    }
  }

  private async loadSpoolSummary(): Promise<void> {
    this.loadingSpoolSummary.set(true);
    try {
      const data = await this.dashboardApi.getSpoolSummary({ size: 10 });
      this.spoolSummary.set(data);
    } catch (e: any) {
      console.error('Failed to load spool summary', e);
    } finally {
      this.loadingSpoolSummary.set(false);
    }
  }

  getMessagesChartLabels(): string[] {
    return this.messagesTimeseries()?.data.map(p => this.formatTimestamp(p.timestamp)) || [];
  }

  getMessagesChartData(): ChartDataset[] {
    const data = this.messagesTimeseries()?.data.map(p => p.value) || [];
    return data.length > 0 ? [{ label: 'Messages', data, color: '#3B82F6' }] : [];
  }

  getNewUsersChartLabels(): string[] {
    return this.newUsersTimeseries()?.data.map(p => this.formatTimestamp(p.timestamp)) || [];
  }

  getNewUsersChartData(): ChartDataset[] {
    const data = this.newUsersTimeseries()?.data.map(p => p.value) || [];
    return data.length > 0 ? [{ label: 'New Users', data, color: '#10B981' }] : [];
  }

  getActiveUsersChartLabels(): string[] {
    return this.activeUsersTimeseries()?.data.map(p => this.formatTimestamp(p.timestamp)) || [];
  }

  getActiveUsersChartData(): ChartDataset[] {
    const data = this.activeUsersTimeseries()?.data.map(p => p.value) || [];
    return data.length > 0 ? [{ label: 'Active Users', data, color: '#8B5CF6' }] : [];
  }

  getMessageShareLabels(): string[] {
    return ['Direct', 'Group'];
  }

  getMessageShareData(): ChartDataset[] {
    const share = this.messageShare();
    if (!share) return [];
    return [{ label: 'Share', data: [share.directMessages, share.groupMessages] }];
  }

  getTopUsersChartLabels(): string[] {
    return this.topUsers().slice(0, 10).map(u => u.username);
  }

  getTopUsersChartData(): ChartDataset[] {
    const data = this.topUsers().slice(0, 10).map(u => u.messageCount);
    return data.length > 0 ? [{ label: 'Messages', data, color: '#F59E0B' }] : [];
  }

  private formatTimestamp(ts: string | null): string {
    if (!ts) return '';
    const date = new Date(ts);
    if (this.currentFilters.granularity === 'HOUR') {
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  exportTopUsers(): void {
    const data = this.topUsers();
    if (data.length === 0) return;
    
    const csv = [
      'Username,Total Messages,Direct Messages,Group Messages',
      ...data.map(u => `${u.username},${u.messageCount},${u.directMessageCount},${u.groupMessageCount}`)
    ].join('\n');
    
    this.downloadCsv(csv, 'top-users.csv');
  }

  exportTopConversations(): void {
    const data = this.topConversations();
    if (data.length === 0) return;
    
    const csv = [
      'User 1,User 2,Messages',
      ...data.map(c => `${c.user1},${c.user2},${c.messageCount}`)
    ].join('\n');
    
    this.downloadCsv(csv, 'top-conversations.csv');
  }

  private downloadCsv(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}
