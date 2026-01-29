import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../models/result';

// ==================== Interfaces ====================

export interface OnlineSummary {
  usersOnline: number;
  roomsOnline: number;
  totalUsersInRooms: number;
}

export interface ConnectedUser {
  username: string;
  resource: string;
  node: string;
  ip: string;
  priority: number;
}

export interface ThroughputPoint {
  timestamp: string;
  directCount: number;
  groupCount: number;
  total: number;
}

export interface MessageThroughput {
  points: ThroughputPoint[];
  totalMessages: number;
  totalDirect: number;
  totalGroup: number;
}

export interface TopActiveUser {
  username: string;
  messageCount: number;
  directCount: number;
  groupCount: number;
  spikeScore?: number;
  last24hCount?: number;
  previousPeriodAvg?: number;
}

export interface ConnectivityDistribution {
  bucket1: number;
  bucket2To5: number;
  bucket6To20: number;
  bucket21Plus: number;
  totalUsers: number;
  avgPeersPerUser: number;
}

export interface Broadcaster {
  username: string;
  distinctPeers: number;
}

export interface GroupEcosystem {
  activeRoomsInRange: number;
  totalRooms: number;
  onlineRoomsNow: number;
  totalOccupantsNow: number;
}

export interface TopActiveRoom {
  roomJid: string;
  name: string;
  host: string;
  messageCount: number;
  lastActivityAt: string;
}

export interface OnlineRoom {
  name: string;
  host: string;
  occupantCount: number;
}

export interface OccupancyDistribution {
  bucket0To1: number;
  bucket2To5: number;
  bucket6To20: number;
  bucket21Plus: number;
}

export interface DormantRoom {
  name: string;
  host: string;
  roomJid: string;
  createdAt: string;
  lastActivityAt: string;
  daysSinceLastActivity: number;
}

export interface SpoolPressure {
  totalQueuedMessages: number;
  oldestMessageAt: string;
  oldestAgeSeconds: number;
}

export interface TopSpoolUser {
  username: string;
  queuedCount: number;
  oldestMessageAt: string;
}

export interface PushHealth {
  usersWithPushSession: number;
  totalPushSessions: number;
}

export interface PushServiceBreakdown {
  service: string;
  sessionCount: number;
  percentage: number;
}

export interface StalePushSession {
  username: string;
  service: string;
  node: string;
  lastUpdatedAt: string;
  staleDays: number;
}

export interface RosterHealth {
  avgContactsPerUser: number;
  medianContactsPerUser: number;
  totalRosterLinks: number;
  bothSubscriptionCount: number;
  toSubscriptionCount: number;
  fromSubscriptionCount: number;
  noneSubscriptionCount: number;
  mutualSubscriptionRate: number;
}

export interface RosterDistribution {
  bucket0: number;
  bucket1To5: number;
  bucket6To20: number;
  bucket21Plus: number;
}

export interface RosterTrendPoint {
  timestamp: string;
  newLinksCount: number;
}

export interface ModerationSummary {
  totalBannedAccounts: number;
}

export interface BannedUser {
  jid: string;
  reason: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceAnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private formatDate(date: Date): string {
    return date.toISOString();
  }

  private buildParams(extras?: Record<string, string | number | undefined>): HttpParams {
    let params = new HttpParams();
    if (extras) {
      Object.entries(extras).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, String(value));
        }
      });
    }
    return params;
  }

  // ==================== A) Live Concurrency ====================

  async getOnlineSummary(): Promise<OnlineSummary> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/online/summary`)
    );
    return res.data;
  }

  async getConnectedUsers(page = 0, size = 20): Promise<ConnectedUser[]> {
    const params = this.buildParams({ page, size });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/online/users`, { params })
    );
    return res.data || [];
  }

  // ==================== B) Message Throughput ====================

  async getMessageThroughput(from?: Date, to?: Date, bucket?: string): Promise<MessageThroughput> {
    const params = this.buildParams({
      from: from ? this.formatDate(from) : undefined,
      to: to ? this.formatDate(to) : undefined,
      bucket,
    });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/messages/throughput`, { params })
    );
    return res.data;
  }

  // ==================== C) Top Active Users ====================

  async getTopActiveUsers(from?: Date, to?: Date, limit = 20, offset = 0): Promise<TopActiveUser[]> {
    const params = this.buildParams({
      from: from ? this.formatDate(from) : undefined,
      to: to ? this.formatDate(to) : undefined,
      limit,
      offset,
    });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/users/top-active`, { params })
    );
    return res.data || [];
  }

  async getTopActiveUsersWithSpikes(from?: Date, to?: Date, limit = 20): Promise<TopActiveUser[]> {
    const params = this.buildParams({
      from: from ? this.formatDate(from) : undefined,
      to: to ? this.formatDate(to) : undefined,
      limit,
    });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/users/top-active/spikes`, { params })
    );
    return res.data || [];
  }

  // ==================== D) Connectivity Distribution ====================

  async getConnectivityDistribution(from?: Date, to?: Date): Promise<ConnectivityDistribution> {
    const params = this.buildParams({
      from: from ? this.formatDate(from) : undefined,
      to: to ? this.formatDate(to) : undefined,
    });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/connectivity/distribution`, { params })
    );
    return res.data;
  }

  async getTopBroadcasters(from?: Date, to?: Date, limit = 20): Promise<Broadcaster[]> {
    const params = this.buildParams({
      from: from ? this.formatDate(from) : undefined,
      to: to ? this.formatDate(to) : undefined,
      limit,
    });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/connectivity/top-broadcasters`, { params })
    );
    return res.data || [];
  }

  // ==================== E) Group Ecosystem Health ====================

  async getGroupEcosystemSummary(from?: Date, to?: Date): Promise<GroupEcosystem> {
    const params = this.buildParams({
      from: from ? this.formatDate(from) : undefined,
      to: to ? this.formatDate(to) : undefined,
    });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/groups/summary`, { params })
    );
    return res.data;
  }

  async getTopActiveRooms(from?: Date, to?: Date, limit = 20): Promise<TopActiveRoom[]> {
    const params = this.buildParams({
      from: from ? this.formatDate(from) : undefined,
      to: to ? this.formatDate(to) : undefined,
      limit,
    });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/groups/top-active`, { params })
    );
    return res.data || [];
  }

  async getOnlineRoomsWithOccupancy(limit = 20): Promise<OnlineRoom[]> {
    const params = this.buildParams({ limit });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/groups/online/occupancy`, { params })
    );
    return res.data || [];
  }

  async getOccupancyDistribution(): Promise<OccupancyDistribution> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/groups/occupancy-distribution`)
    );
    return res.data;
  }

  // ==================== F) Dormant/Empty Rooms ====================

  async getDormantRooms(days = 30, limit = 50): Promise<DormantRoom[]> {
    const params = this.buildParams({ days, limit });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/groups/dormant`, { params })
    );
    return res.data || [];
  }

  async getEmptyRooms(limit = 50): Promise<DormantRoom[]> {
    const params = this.buildParams({ limit });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/groups/empty`, { params })
    );
    return res.data || [];
  }

  // ==================== G) Spool Pressure ====================

  async getSpoolSummary(): Promise<SpoolPressure> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/spool/summary`)
    );
    return res.data;
  }

  async getTopSpoolUsers(limit = 20): Promise<TopSpoolUser[]> {
    const params = this.buildParams({ limit });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/spool/top-users`, { params })
    );
    return res.data || [];
  }

  // ==================== H) Push Notification Health ====================

  async getPushSummary(): Promise<PushHealth> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/push/summary`)
    );
    return res.data;
  }

  async getPushByService(): Promise<PushServiceBreakdown[]> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/push/by-service`)
    );
    return res.data || [];
  }

  async getStalePushSessions(olderThanDays = 7, limit = 20): Promise<StalePushSession[]> {
    const params = this.buildParams({ olderThanDays, limit });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/push/stale`, { params })
    );
    return res.data || [];
  }

  // ==================== I) Roster Health ====================

  async getRosterSummary(): Promise<RosterHealth> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/roster/summary`)
    );
    return res.data;
  }

  async getRosterDistribution(): Promise<RosterDistribution> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/roster/distribution`)
    );
    return res.data;
  }

  async getRosterTrend(from?: Date, to?: Date, bucket?: string): Promise<RosterTrendPoint[]> {
    const params = this.buildParams({
      from: from ? this.formatDate(from) : undefined,
      to: to ? this.formatDate(to) : undefined,
      bucket,
    });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/roster/trend`, { params })
    );
    return res.data || [];
  }

  // ==================== J) Moderation / Bans ====================

  async getBansSummary(): Promise<ModerationSummary> {
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/moderation/bans/summary`)
    );
    return res.data;
  }

  async getBannedList(limit = 20, offset = 0): Promise<BannedUser[]> {
    const params = this.buildParams({ limit, offset });
    const res = await firstValueFrom(
      this.http.get<Result>(`${this.apiUrl}/ejabberd/analytics/service/moderation/bans/list`, { params })
    );
    return res.data || [];
  }
}
