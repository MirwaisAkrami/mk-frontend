import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import {
  UserAnalyticsService,
  AnalyticsScope,
  PeerActivity,
  GroupActivity,
  HourlyActivity,
  DailyActivity,
  UniquePeers,
  Concentration,
  ConversationDepth,
  Burstiness,
  ActiveDays,
  DirectVsGroup,
  SpoolSummary,
  RosterSnapshot,
  LastSeenSnapshot,
  PushSession,
} from '../../../../core/services/user-analytics.service';

interface WidgetState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
  from: Date;
  to: Date;
  scope?: AnalyticsScope;
}

@Component({
  selector: 'app-user-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './user-analytics.component.html',
  styleUrls: ['./user-analytics.component.scss'],
})
export class UserAnalyticsComponent implements OnInit, OnChanges {
  @Input() username = '';

  private analyticsService = inject(UserAnalyticsService);

  globalFromStr = '';
  globalToStr = '';

  private createInitialState<T>(data: T | null = null): WidgetState<T> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      loading: false,
      error: null,
      data,
      from: thirtyDaysAgo,
      to: now,
      scope: 'ALL',
    };
  }

  uniquePeersState = signal<WidgetState<UniquePeers>>(this.createInitialState());
  activeDaysState = signal<WidgetState<ActiveDays>>(this.createInitialState());
  burstinessState = signal<WidgetState<Burstiness>>(this.createInitialState());
  concentrationState = signal<WidgetState<Concentration>>(this.createInitialState());
  hourlyState = signal<WidgetState<HourlyActivity>>(this.createInitialState());
  dailyState = signal<WidgetState<DailyActivity>>(this.createInitialState());
  directVsGroupState = signal<WidgetState<DirectVsGroup>>(this.createInitialState());
  conversationDepthState = signal<WidgetState<ConversationDepth>>(this.createInitialState());
  peersState = signal<WidgetState<PeerActivity[]>>(this.createInitialState([]));
  groupsState = signal<WidgetState<GroupActivity[]>>(this.createInitialState([]));
  spoolState = signal<WidgetState<SpoolSummary>>(this.createInitialState());
  rosterState = signal<WidgetState<RosterSnapshot>>(this.createInitialState());
  lastSeenState = signal<WidgetState<LastSeenSnapshot>>(this.createInitialState());
  pushSessionState = signal<WidgetState<PushSession>>(this.createInitialState());

  // ✅ Key performance improvement:
  // - maintainAspectRatio: false for bar/line charts
  // - disable animation to reduce lag during dashboard load
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { display: false },
    },
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { display: false },
    },
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  hourlyChartData = computed<ChartData<'bar'> | null>(() => {
    const data = this.hourlyState().data;
    if (!data?.points) return null;
    return {
      labels: data.points.map((p) => `${p.hour}h`),
      datasets: [
        {
          data: data.points.map((p) => p.messageCount),
          backgroundColor: 'rgba(30, 58, 138, 0.7)',
          borderColor: 'rgba(30, 58, 138, 1)',
          borderWidth: 1,
        },
      ],
    };
  });

  dailyChartData = computed<ChartData<'line'> | null>(() => {
    const data = this.dailyState().data;
    if (!data?.points) return null;
    return {
      labels: data.points.map((p) => p.day),
      datasets: [
        {
          data: data.points.map((p) => p.messageCount),
          fill: true,
          backgroundColor: 'rgba(30, 58, 138, 0.1)',
          borderColor: 'rgba(30, 58, 138, 1)',
          tension: 0.3,
        },
      ],
    };
  });

  directVsGroupChartData = computed<ChartData<'doughnut'> | null>(() => {
    const data = this.directVsGroupState().data;
    if (!data) return null;
    return {
      labels: ['Direct', 'Group'],
      datasets: [
        {
          data: [data.directCount, data.groupCount],
          backgroundColor: ['rgba(30, 58, 138, 0.8)', 'rgba(34, 197, 94, 0.8)'],
        },
      ],
    };
  });

  depthChartData = computed<ChartData<'bar'> | null>(() => {
    const data = this.conversationDepthState().data;
    if (!data) return null;
    return {
      labels: ['1 msg', '2-5 msgs', '6-20 msgs', '21+ msgs'],
      datasets: [
        {
          data: [data.bucket1, data.bucket2To5, data.bucket6To20, data.bucket21Plus],
          backgroundColor: [
            'rgba(239, 68, 68, 0.7)',
            'rgba(251, 146, 60, 0.7)',
            'rgba(34, 197, 94, 0.7)',
            'rgba(30, 58, 138, 0.7)',
          ],
        },
      ],
    };
  });

  ngOnInit(): void {
    this.initGlobalDates();
    if (this.username) {
      this.refreshAll();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username'] && !changes['username'].firstChange && this.username) {
      this.refreshAll();
    }
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

  onGlobalDateChange(): void {
    const from = new Date(this.globalFromStr);
    const to = new Date(this.globalToStr);

    this.uniquePeersState.update((s) => ({ ...s, from, to }));
    this.activeDaysState.update((s) => ({ ...s, from, to }));
    this.burstinessState.update((s) => ({ ...s, from, to }));
    this.concentrationState.update((s) => ({ ...s, from, to }));
    this.hourlyState.update((s) => ({ ...s, from, to }));
    this.dailyState.update((s) => ({ ...s, from, to }));
    this.directVsGroupState.update((s) => ({ ...s, from, to }));
    this.conversationDepthState.update((s) => ({ ...s, from, to }));
    this.peersState.update((s) => ({ ...s, from, to }));
    this.groupsState.update((s) => ({ ...s, from, to }));
  }

  refreshAll(): void {
    this.onGlobalDateChange();
    this.refreshUniquePeers();
    this.refreshActiveDays();
    this.refreshBurstiness();
    this.refreshConcentration();
    this.refreshHourlyActivity();
    this.refreshDailyActivity();
    this.refreshDirectVsGroup();
    this.refreshConversationDepth();
    this.refreshPeers();
    this.refreshGroups();
    this.refreshSpoolSummary();
    this.refreshRoster();
    this.refreshLastSeen();
    this.refreshPushSession();
  }

  async refreshUniquePeers(): Promise<void> {
    const state = this.uniquePeersState();
    this.uniquePeersState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getUniquePeers(
        this.username,
        state.from,
        state.to,
        state.scope || 'ALL'
      );
      this.uniquePeersState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.uniquePeersState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshActiveDays(): Promise<void> {
    const state = this.activeDaysState();
    this.activeDaysState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getActiveDays(
        this.username,
        state.from,
        state.to,
        state.scope || 'ALL'
      );
      this.activeDaysState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.activeDaysState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshBurstiness(): Promise<void> {
    const state = this.burstinessState();
    this.burstinessState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getBurstiness(
        this.username,
        state.from,
        state.to,
        state.scope || 'ALL'
      );
      this.burstinessState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.burstinessState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshConcentration(): Promise<void> {
    const state = this.concentrationState();
    this.concentrationState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getConcentration(
        this.username,
        state.from,
        state.to,
        state.scope || 'ALL'
      );
      this.concentrationState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.concentrationState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshHourlyActivity(): Promise<void> {
    const state = this.hourlyState();
    this.hourlyState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getHourlyActivity(
        this.username,
        state.from,
        state.to
      );
      this.hourlyState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.hourlyState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshDailyActivity(): Promise<void> {
    const state = this.dailyState();
    this.dailyState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getDailyActivity(
        this.username,
        state.from,
        state.to,
        state.scope || 'ALL'
      );
      this.dailyState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.dailyState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshDirectVsGroup(): Promise<void> {
    const state = this.directVsGroupState();
    this.directVsGroupState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getDirectVsGroup(
        this.username,
        state.from,
        state.to
      );
      this.directVsGroupState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.directVsGroupState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshConversationDepth(): Promise<void> {
    const state = this.conversationDepthState();
    this.conversationDepthState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getConversationDepth(
        this.username,
        state.from,
        state.to,
        state.scope || 'ALL'
      );
      this.conversationDepthState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.conversationDepthState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshPeers(): Promise<void> {
    const state = this.peersState();
    this.peersState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getPeerActivity(
        this.username,
        state.from,
        state.to,
        state.scope || 'ALL',
        0,
        10
      );
      this.peersState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.peersState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshGroups(): Promise<void> {
    const state = this.groupsState();
    this.groupsState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getGroupActivity(
        this.username,
        state.from,
        state.to,
        0,
        10
      );
      this.groupsState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.groupsState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshSpoolSummary(): Promise<void> {
    this.spoolState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getSpoolSummary(this.username);
      this.spoolState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.spoolState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshRoster(): Promise<void> {
    this.rosterState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getRosterSnapshot(this.username);
      this.rosterState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.rosterState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshLastSeen(): Promise<void> {
    this.lastSeenState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getLastSeenSnapshot(this.username);
      this.lastSeenState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.lastSeenState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  async refreshPushSession(): Promise<void> {
    this.pushSessionState.update((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await this.analyticsService.getPushSession(this.username);
      this.pushSessionState.update((s) => ({ ...s, loading: false, data }));
    } catch (e: any) {
      this.pushSessionState.update((s) => ({
        ...s,
        loading: false,
        error: e?.message || 'Failed to load',
      }));
    }
  }

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  }

  formatSecondsAgo(seconds: number | undefined): string {
    if (seconds === undefined) return '';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
}
