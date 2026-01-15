import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  DateRangePreset,
  Granularity,
  MessageScope,
} from '../../../core/models/dashboard.model';

export interface DashboardFiltersValue {
  datePreset: DateRangePreset;
  from: Date;
  to: Date;
  granularity: Granularity;
  scope: MessageScope;
}

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './dashboard-filters.component.html',
})
export class DashboardFiltersComponent {
  @Output() filtersChange = new EventEmitter<DashboardFiltersValue>();

  datePreset = signal<DateRangePreset>('last7days');
  fromDate = signal<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  toDate = signal<Date>(new Date());
  granularity = signal<Granularity>('DAY');
  scope = signal<MessageScope>('ALL');

  fromDateString = () => this.formatDateForInput(this.fromDate());
  toDateString = () => this.formatDateForInput(this.toDate());

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onDatePresetChange(preset: DateRangePreset): void {
    this.datePreset.set(preset);
    const now = new Date();
    
    switch (preset) {
      case 'today':
        this.fromDate.set(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
        this.toDate.set(now);
        this.granularity.set('HOUR');
        break;
      case 'last7days':
        this.fromDate.set(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        this.toDate.set(now);
        this.granularity.set('DAY');
        break;
      case 'last30days':
        this.fromDate.set(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        this.toDate.set(now);
        this.granularity.set('DAY');
        break;
      case 'custom':
        break;
    }
  }

  onFromDateChange(dateStr: string): void {
    this.fromDate.set(new Date(dateStr));
  }

  onToDateChange(dateStr: string): void {
    this.toDate.set(new Date(dateStr));
  }

  onGranularityChange(granularity: Granularity): void {
    this.granularity.set(granularity);
  }

  onScopeChange(scope: MessageScope): void {
    this.scope.set(scope);
  }

  applyFilters(): void {
    this.filtersChange.emit({
      datePreset: this.datePreset(),
      from: this.fromDate(),
      to: this.toDate(),
      granularity: this.granularity(),
      scope: this.scope(),
    });
  }

  getCurrentFilters(): DashboardFiltersValue {
    return {
      datePreset: this.datePreset(),
      from: this.fromDate(),
      to: this.toDate(),
      granularity: this.granularity(),
      scope: this.scope(),
    };
  }
}
