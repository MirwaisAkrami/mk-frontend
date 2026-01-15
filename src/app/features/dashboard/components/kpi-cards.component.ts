import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardSummary } from '../../../core/models/dashboard.model';
import { LucideAngularModule, Users, UserPlus, MessageSquare, MessagesSquare, Building2, Wifi, WifiOff, Mail } from 'lucide-angular';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  templateUrl: './kpi-cards.component.html',
})
export class KpiCardsComponent {
  @Input() summary: DashboardSummary | null = null;
  @Input() loading = false;

  Users = Users;
  UserPlus = UserPlus;
  MessageSquare = MessageSquare;
  MessagesSquare = MessagesSquare;
  Building2 = Building2;
  Wifi = Wifi;
  WifiOff = WifiOff;
  Mail = Mail;

  formatNumber(value: number | undefined | null): string {
    if (value === null || value === undefined) return '0';
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toLocaleString();
  }

  getQueueColor(): string {
    const size = this.summary?.offlineQueueSize ?? 0;
    if (size > 10000) return 'text-red-600';
    if (size > 1000) return 'text-yellow-600';
    return 'text-gray-600';
  }

  getQueueBgColor(): string {
    const size = this.summary?.offlineQueueSize ?? 0;
    if (size > 10000) return 'bg-red-100';
    if (size > 1000) return 'bg-yellow-100';
    return 'bg-gray-100';
  }

  getQueueIconColor(): string {
    const size = this.summary?.offlineQueueSize ?? 0;
    if (size > 10000) return 'text-red-600';
    if (size > 1000) return 'text-yellow-600';
    return 'text-gray-600';
  }
}
