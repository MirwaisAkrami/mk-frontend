import { Component, Input, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardApiService } from '../../../../core/services/dashboard-api.service';
import { UserDetailStats } from '../../../../core/models/dashboard.model';
import { SimpleChartComponent, ChartDataset } from '../../../dashboard/components/simple-chart.component';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, SimpleChartComponent],
  templateUrl: './user-stats.component.html',
})
export class UserStatsComponent implements OnInit, OnChanges {
  @Input() username!: string;

  loading = signal(false);
  error = signal<string | null>(null);
  stats = signal<UserDetailStats | null>(null);
  selectedRange = signal(30);

  constructor(private dashboardApi: DashboardApiService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username'] && !changes['username'].firstChange) {
      this.loadStats();
    }
  }

  onRangeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedRange.set(parseInt(select.value, 10));
    this.loadStats();
  }

  async loadStats(): Promise<void> {
    if (!this.username) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const days = this.selectedRange();
      const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const to = new Date().toISOString();
      
      const data = await this.dashboardApi.getUserDetailStats(this.username, {
        from,
        to,
        granularity: days <= 7 ? 'HOUR' : 'DAY',
      });
      this.stats.set(data);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load user statistics');
    } finally {
      this.loading.set(false);
    }
  }

  formatNumber(value: number | undefined | null): string {
    if (value === null || value === undefined) return '0';
    return value.toLocaleString();
  }

  formatLastSeen(seconds: number | undefined | null): string {
    if (seconds === null || seconds === undefined) return 'Unknown';
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  getChartLabels(): string[] {
    return this.stats()?.messageVolume?.map(p => this.formatTimestamp(p.timestamp)) || [];
  }

  getChartData(): ChartDataset[] {
    const data = this.stats()?.messageVolume?.map(p => p.value) || [];
    return data.length > 0 ? [{ label: 'Messages', data, color: '#3B82F6' }] : [];
  }

  private formatTimestamp(ts: string | null): string {
    if (!ts) return '';
    const date = new Date(ts);
    const days = this.selectedRange();
    if (days <= 7) {
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  extractUsername(jid: string): string {
    return jid.split('@')[0];
  }
}
