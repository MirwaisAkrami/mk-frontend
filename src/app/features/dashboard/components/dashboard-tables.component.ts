import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  TopUser,
  TopConversation,
  OnlineRoom,
  SpoolSummary,
} from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard-tables',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './dashboard-tables.component.html',
})
export class DashboardTablesComponent {
  @Input() topUsers: TopUser[] = [];
  @Input() topConversations: TopConversation[] = [];
  @Input() onlineRooms: OnlineRoom[] = [];
  @Input() spoolSummary: SpoolSummary[] = [];
  
  @Input() loadingTopUsers = false;
  @Input() loadingTopConversations = false;
  @Input() loadingOnlineRooms = false;
  @Input() loadingSpoolSummary = false;

  @Output() exportTopUsers = new EventEmitter<void>();
  @Output() exportTopConversations = new EventEmitter<void>();

  formatNumber(value: number | undefined | null): string {
    if (value === null || value === undefined) return '0';
    return value.toLocaleString();
  }
}
