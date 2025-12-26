import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { EjabberdUsersService } from '../../core/services/ejabberd-users.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, DataTableComponent],
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);

  username = signal<string>('');

  user = signal<any | null>(null);
  online = signal<boolean | null>(null);
  sessions = signal<any[]>([]);
  contacts = signal<any[]>([]);
  presence = signal<any | null>(null);
  vcard = signal<any | null>(null);
  offlineCount = signal<number>(0);
  rooms = signal<string[]>([]);
  resources = signal<string[]>([]);

  title = computed(() => this.username() || 'User');

  sessionsColumns: TableColumn[] = [
    { key: 'resource', label: 'Resource', sortable: true },
    { key: 'ip', label: 'IP', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'connectedAt', label: 'Connected At', sortable: true },
  ];

  contactsColumns: TableColumn[] = [
    { key: 'jid', label: 'JID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'subscription', label: 'Subscription', sortable: true },
    { key: 'ask', label: 'Ask', sortable: true },
  ];

  sessionsActions: TableAction[] = [
    {
      label: 'Kick Session',
      handler: (row) => this.kickSession(row),
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private usersService: EjabberdUsersService
  ) {}

  async ngOnInit(): Promise<void> {
    const username = this.route.snapshot.paramMap.get('username') || '';
    this.username.set(username);
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const username = this.username();

      const [user, sessions, contacts, presence, vcard, rooms, resources] = await Promise.all([
        this.usersService.getUserDetail(username),
        this.usersService.getUserSessions(username),
        this.usersService.getUserContacts(username),
        this.usersService.getUserPresence(username).catch(() => null),
        this.usersService.getUserVCard(username).catch(() => null),
        this.usersService.getUserRooms(username).catch(() => []),
        this.usersService.getUserResources(username).catch(() => []),
      ]);

      this.presence.set(presence);
      this.vcard.set(vcard);
      this.rooms.set(rooms || []);
      this.resources.set(resources || []);

      try {
        const offlineCount = await this.usersService.getOfflineMessageCount(username);
        this.offlineCount.set(offlineCount || 0);
      } catch {
        this.offlineCount.set(0);
      }

      this.user.set(user);
      this.sessions.set((sessions || []).map((s: any) => ({
        resource: s?.resource,
        ip: s?.ip,
        status: s?.status,
        connectedAt: s?.connectedAt || s?.connected_at,
        _raw: s,
      })));

      this.contacts.set((contacts || []).map((c: any) => ({
        jid: c?.jid || c?.userJid || c?.user,
        name: c?.name,
        subscription: c?.subscription,
        ask: c?.ask,
        _raw: c,
      })));

      try {
        const onlineRes = await this.usersService.isUserOnline(username);
        this.online.set(onlineRes);
      } catch {
        this.online.set(null);
      }
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load user');
    } finally {
      this.loading.set(false);
    }
  }

  async kick(): Promise<void> {
    const reason = prompt('Reason (optional):');
    await this.usersService.kickUser(this.username(), reason);
    await this.load();
  }

  async ban(): Promise<void> {
    const reason = prompt('Reason (optional):');
    await this.usersService.banUser(this.username(), reason);
    await this.load();
  }

  async unban(): Promise<void> {
    await this.usersService.unbanUser(this.username());
    await this.load();
  }

  async deactivate(): Promise<void> {
    const reason = prompt('Reason (optional):');
    await this.usersService.deactivateUser(this.username(), reason);
    await this.load();
  }

  async activate(): Promise<void> {
    await this.usersService.activateUser(this.username());
    await this.load();
  }

  async kickSession(row: any): Promise<void> {
    const resource = row?.resource;
    if (!resource) return;
    const reason = prompt('Reason (optional):') || '';
    await this.usersService.kickSession(this.username(), resource, reason);
    await this.load();
  }
}
