import { Component, Input, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { UserDetailStats } from '../../../core/models/dashboard.model';
import { SimpleChartComponent, ChartDataset } from '../../dashboard/components/simple-chart.component';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, SimpleChartComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Message Statistics</h2>
        <select
          class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          [value]="selectedRange()"
          (change)="onRangeChange($event)"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      @if (loading()) {
        <div class="bg-white rounded-lg shadow p-6 text-center text-gray-400">
          Loading statistics...
        </div>
      } @else if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {{ error() }}
        </div>
      } @else if (stats()) {
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow p-4">
            <div class="text-xs font-medium text-gray-500 uppercase">Total Messages</div>
            <div class="text-2xl font-bold text-gray-900 mt-1">{{ formatNumber(stats()?.totalMessageCount) }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <div class="text-xs font-medium text-gray-500 uppercase">Direct Messages</div>
            <div class="text-2xl font-bold text-blue-600 mt-1">{{ formatNumber(stats()?.directMessageCount) }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <div class="text-xs font-medium text-gray-500 uppercase">Group Messages</div>
            <div class="text-2xl font-bold text-purple-600 mt-1">{{ formatNumber(stats()?.groupMessageCount) }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <div class="text-xs font-medium text-gray-500 uppercase">Last Seen</div>
            <div class="text-lg font-bold text-gray-900 mt-1">{{ formatLastSeen(stats()?.lastSeenSecondsAgo) }}</div>
          </div>
        </div>

        <!-- Message Volume Chart -->
        <app-simple-chart
          title="Message Volume Over Time"
          type="line"
          [labels]="getChartLabels()"
          [datasets]="getChartData()"
          [loading]="false"
        ></app-simple-chart>

        <!-- Top Peers Table -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-4 py-3 border-b border-gray-200">
            <h3 class="text-sm font-semibold text-gray-700">Top Contacts (by message volume)</h3>
          </div>
          @if (stats()?.topPeers && stats()!.topPeers.length > 0) {
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peer</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Messages</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  @for (peer of stats()?.topPeers; track peer.peer; let i = $index) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-4 py-2 text-sm text-gray-500">{{ i + 1 }}</td>
                      <td class="px-4 py-2 text-sm">
                        <a [routerLink]="['/users', extractUsername(peer.peer)]" class="text-blue-600 hover:underline">
                          {{ peer.peer }}
                        </a>
                      </td>
                      <td class="px-4 py-2 text-sm text-gray-900 text-right">{{ formatNumber(peer.messageCount) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="p-8 text-center text-gray-400">No contacts found in this period</div>
          }
        </div>
      }
    </div>
  `,
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
