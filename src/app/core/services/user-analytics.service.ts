import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../models/result';

export type AnalyticsScope = 'ALL' | 'DIRECT' | 'GROUP';

export interface PeerActivity {
  peerJid: string;
  messageCount: number;
  firstActivityAt: string;
  lastActivityAt: string;
}

export interface GroupActivity {
  roomJid: string;
  messageCount: number;
  lastActivityAt: string;
  roomCreatedAt: string | null;
  opts: string | null;
}

export interface HourlyPoint {
  hour: number;
  messageCount: number;
}

export interface HourlyActivity {
  points: HourlyPoint[];
  totalMessages: number;
  peakHour: number | null;
  peakCount: number;
}

export interface DailyPoint {
  day: string;
  messageCount: number;
}

export interface DailyActivity {
  points: DailyPoint[];
  totalMessages: number;
  avgPerDay: number;
}

export interface UniquePeers {
  uniquePeers: number;
  scope: string;
}

export interface Concentration {
  topPeerJid: string | null;
  topPeerCount: number;
  top1SharePercent: number;
  top3SharePercent: number;
  totalMessages: number;
}

export interface ConversationDepth {
  bucket1: number;
  bucket2To5: number;
  bucket6To20: number;
  bucket21Plus: number;
  totalConversations: number;
}

export interface Burstiness {
  peakMessagesPerHour: number;
  avgMessagesPerHour: number;
  burstScore: number;
  peakHourTimestamp: string | null;
}

export interface ActiveDays {
  activeDays: number;
  totalDaysInRange: number;
  activityRate: number;
}

export interface DirectVsGroup {
  directCount: number;
  groupCount: number;
  distinctGroups: number;
  dominantGroupJid: string | null;
  dominantGroupCount: number;
  directPercentage: number;
  groupPercentage: number;
}

export interface SpoolSummary {
  supported: boolean;
  reason?: string;
  queuedMessages?: number;
  oldestMessageAt?: string;
  newestMessageAt?: string;
}

export interface RosterSnapshot {
  supported: boolean;
  reason?: string;
  totalContacts?: number;
  bothSubscription?: number;
  toSubscription?: number;
  fromSubscription?: number;
  noneSubscription?: number;
}

export interface LastSeenSnapshot {
  supported: boolean;
  reason?: string;
  secondsAgo?: number;
  lastSeenAt?: string;
  state?: string;
}

export interface PushSessionEntry {
  service: string;
  node: string;
  timestamp: number;
}

export interface PushSession {
  supported: boolean;
  reason?: string;
  sessionCount?: number;
  sessions?: PushSessionEntry[];
}

export interface AnalyticsDateRange {
  from: Date;
  to: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UserAnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private formatDate(date: Date): string {
    return date.toISOString();
  }

  private buildParams(from: Date, to: Date, extras?: Record<string, string | number>): HttpParams {
    let params = new HttpParams()
      .set('from', this.formatDate(from))
      .set('to', this.formatDate(to));
    
    if (extras) {
      Object.entries(extras).forEach(([key, value]) => {
        params = params.set(key, String(value));
      });
    }
    return params;
  }

  async getPeerActivity(
    username: string,
    from: Date,
    to: Date,
    scope: AnalyticsScope = 'ALL',
    page = 0,
    size = 20
  ): Promise<PeerActivity[]> {
    const params = this.buildParams(from, to, { scope, page, size });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/peers`, { params })
    );
    return res.data || [];
  }

  async getGroupActivity(
    username: string,
    from: Date,
    to: Date,
    page = 0,
    size = 20
  ): Promise<GroupActivity[]> {
    const params = this.buildParams(from, to, { page, size });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/groups`, { params })
    );
    return res.data || [];
  }

  async getHourlyActivity(
    username: string,
    from: Date,
    to: Date,
    tz = 'Asia/Kabul'
  ): Promise<HourlyActivity> {
    const params = this.buildParams(from, to, { tz });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/activity/hourly`, { params })
    );
    return res.data;
  }

  async getDailyActivity(
    username: string,
    from: Date,
    to: Date,
    scope: AnalyticsScope = 'ALL',
    tz = 'Asia/Kabul'
  ): Promise<DailyActivity> {
    const params = this.buildParams(from, to, { scope, tz });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/activity/daily`, { params })
    );
    return res.data;
  }

  async getUniquePeers(
    username: string,
    from: Date,
    to: Date,
    scope: AnalyticsScope = 'ALL'
  ): Promise<UniquePeers> {
    const params = this.buildParams(from, to, { scope });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/unique-peers`, { params })
    );
    return res.data;
  }

  async getConcentration(
    username: string,
    from: Date,
    to: Date,
    scope: AnalyticsScope = 'ALL'
  ): Promise<Concentration> {
    const params = this.buildParams(from, to, { scope });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/concentration`, { params })
    );
    return res.data;
  }

  async getConversationDepth(
    username: string,
    from: Date,
    to: Date,
    scope: AnalyticsScope = 'ALL'
  ): Promise<ConversationDepth> {
    const params = this.buildParams(from, to, { scope });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/conversation-depth`, { params })
    );
    return res.data;
  }

  async getBurstiness(
    username: string,
    from: Date,
    to: Date,
    scope: AnalyticsScope = 'ALL',
    tz = 'Asia/Kabul'
  ): Promise<Burstiness> {
    const params = this.buildParams(from, to, { scope, tz });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/burstiness`, { params })
    );
    return res.data;
  }

  async getActiveDays(
    username: string,
    from: Date,
    to: Date,
    scope: AnalyticsScope = 'ALL',
    tz = 'Asia/Kabul'
  ): Promise<ActiveDays> {
    const params = this.buildParams(from, to, { scope, tz });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/active-days`, { params })
    );
    return res.data;
  }

  async getDirectVsGroup(
    username: string,
    from: Date,
    to: Date,
    tz = 'Asia/Kabul'
  ): Promise<DirectVsGroup> {
    const params = this.buildParams(from, to, { tz });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/direct-vs-group`, { params })
    );
    return res.data;
  }

  async getSpoolSummary(username: string): Promise<SpoolSummary> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/spool-summary`)
    );
    return res.data;
  }

  async getRosterSnapshot(username: string): Promise<RosterSnapshot> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/roster`)
    );
    return res.data;
  }

  async getLastSeenSnapshot(username: string): Promise<LastSeenSnapshot> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/last-seen`)
    );
    return res.data;
  }

  async getPushSession(username: string): Promise<PushSession> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/users/${encodeURIComponent(username)}/analytics/push-session`)
    );
    return res.data;
  }
}
