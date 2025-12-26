import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { EjabberdStatsService } from '../../../core/services/ejabberd-stats.service';

@Component({
  selector: 'app-ejabberd-stats',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './stats.component.html',
})
export class EjabberdStatsComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);

  registeredUsers = signal<number | null>(null);
  onlineUsers = signal<number | null>(null);
  onlineRooms = signal<number | null>(null);
  uptime = signal<number | null>(null);
  processes = signal<number | null>(null);
  s2sIn = signal<number | null>(null);
  s2sOut = signal<number | null>(null);
  status = signal<string | null>(null);
  vhosts = signal<string[]>([]);
  clusterNodes = signal<string[]>([]);

  constructor(private statsService: EjabberdStatsService) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const [registeredUsers, onlineUsers, onlineRooms, uptime, processes, s2sIn, s2sOut, status, vhosts, clusterNodes] = await Promise.all([
        this.statsService.getRegisteredUsersCount(),
        this.statsService.getOnlineUsersCount(),
        this.statsService.getOnlineRoomsCount(),
        this.statsService.getUptime().catch(() => null),
        this.statsService.getProcessesCount().catch(() => null),
        this.statsService.getS2sConnectionsIn().catch(() => null),
        this.statsService.getS2sConnectionsOut().catch(() => null),
        this.statsService.getStatus().catch(() => null),
        this.statsService.getRegisteredVhosts().catch(() => []),
        this.statsService.getClusterNodes().catch(() => []),
      ]);

      this.registeredUsers.set(registeredUsers);
      this.onlineUsers.set(onlineUsers);
      this.onlineRooms.set(onlineRooms);
      this.uptime.set(uptime);
      this.processes.set(processes);
      this.s2sIn.set(s2sIn);
      this.s2sOut.set(s2sOut);
      this.status.set(status);
      this.vhosts.set(vhosts || []);
      this.clusterNodes.set(clusterNodes || []);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load stats');
    } finally {
      this.loading.set(false);
    }
  }

  formatUptime(seconds: number | null): string {
    if (!seconds) return '-';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  }

  async clearCache(): Promise<void> {
    if (!confirm('Clear server cache?')) return;
    try {
      await this.statsService.clearCache();
      alert('Cache cleared');
    } catch (e: any) {
      alert('Failed to clear cache: ' + (e?.message || 'Unknown error'));
    }
  }

  async reloadConfig(): Promise<void> {
    if (!confirm('Reload server configuration?')) return;
    try {
      await this.statsService.reloadConfig();
      alert('Configuration reloaded');
    } catch (e: any) {
      alert('Failed to reload config: ' + (e?.message || 'Unknown error'));
    }
  }
}
