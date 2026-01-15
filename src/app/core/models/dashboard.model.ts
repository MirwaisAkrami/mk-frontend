export type Granularity = 'HOUR' | 'DAY' | 'WEEK';
export type MessageScope = 'ALL' | 'DIRECT' | 'GROUP';

export interface DashboardFilter {
  from: string;
  to: string;
  granularity: Granularity;
  scope: MessageScope;
  host?: string;
}

export interface DashboardSummary {
  totalRegisteredUsers: number;
  newUsersInRange: number;
  activeUsersByLastSeen: number;
  activeUsersByMessages: number;
  messagesInRange: number;
  directConversationsCount: number;
  totalGroupRooms: number;
  onlineGroupRoomsNow: number;
  onlineUsersInRoomsNow: number;
  offlineQueueSize: number;
  connectedUsersNow: number;
  directMessagesInRange: number;
  groupMessagesInRange: number;
}

export interface TimeseriesPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface Timeseries {
  name: string;
  data: TimeseriesPoint[];
}

export interface TopUser {
  username: string;
  messageCount: number;
  directMessageCount: number;
  groupMessageCount: number;
}

export interface TopConversation {
  user1: string;
  user2: string;
  messageCount: number;
}

export interface OnlineRoom {
  name: string;
  host: string;
  participantCount: number;
}

export interface SpoolSummary {
  username: string;
  messageCount: number;
}

export interface MessageShare {
  directMessages: number;
  groupMessages: number;
  directPercentage: number;
  groupPercentage: number;
}

export interface TopPeer {
  peer: string;
  messageCount: number;
}

export interface UserDetailStats {
  username: string;
  lastSeen: string | null;
  lastSeenSecondsAgo: number | null;
  totalMessageCount: number;
  directMessageCount: number;
  groupMessageCount: number;
  messageVolume: TimeseriesPoint[];
  topPeers: TopPeer[];
}

export type DateRangePreset = 'today' | 'last7days' | 'last30days' | 'custom';

export interface DateRange {
  preset: DateRangePreset;
  from: Date;
  to: Date;
}
