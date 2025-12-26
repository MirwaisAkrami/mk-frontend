import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { EjabberdAnalyticsService } from '../../core/services/ejabberd-analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);

  systemHealth = signal<any | null>(null);
  suspiciousActivities = signal<any[]>([]);

  constructor(private analyticsService: EjabberdAnalyticsService) {}

  async ngOnInit(): Promise<void> {
    await this.load();
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
}
