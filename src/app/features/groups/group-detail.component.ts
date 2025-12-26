import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { EjabberdRoomsService } from '../../core/services/ejabberd-rooms.service';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, DataTableComponent],
  templateUrl: './group-detail.component.html',
})
export class GroupDetailComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);

  roomName = signal<string>('');

  room = signal<any | null>(null);
  occupants = signal<any[]>([]);
  subscribers = signal<string[]>([]);
  affiliations = signal<any[]>([]);
  options = signal<any[]>([]);
  history = signal<any[]>([]);

  title = computed(() => this.roomName() || 'Group');

  occupantsColumns: TableColumn[] = [
    { key: 'nick', label: 'Nick', sortable: true },
    { key: 'jid', label: 'JID', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'affiliation', label: 'Affiliation', sortable: true },
  ];

  occupantsActions: TableAction[] = [
    {
      label: 'Kick',
      handler: (row) => this.kick(row),
    },
    {
      label: 'Ban',
      handler: (row) => this.ban(row),
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private roomsService: EjabberdRoomsService
  ) {}

  async ngOnInit(): Promise<void> {
    const roomName = this.route.snapshot.paramMap.get('roomName') || '';
    this.roomName.set(roomName);
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const roomName = this.roomName();
      const [room, occupants, subscribers, affiliations, options, history] = await Promise.all([
        this.roomsService.getRoomDetail(roomName),
        this.roomsService.getRoomOccupants(roomName),
        this.roomsService.getRoomSubscribers(roomName),
        this.roomsService.getAllRoomAffiliations(roomName).catch(() => []),
        this.roomsService.getRoomOptions(roomName).catch(() => []),
        this.roomsService.getRoomHistory(roomName).catch(() => []),
      ]);

      this.affiliations.set(affiliations || []);
      this.options.set(options || []);
      this.history.set(history || []);

      this.room.set(room);
      this.occupants.set(
        (occupants || []).map((o: any) => ({
          nick: o?.nick,
          jid: o?.jid || o?.userJid,
          role: o?.role,
          affiliation: o?.affiliation,
          _raw: o,
        }))
      );
      this.subscribers.set(subscribers || []);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load group');
    } finally {
      this.loading.set(false);
    }
  }

  async destroy(): Promise<void> {
    const reason = prompt('Reason (optional):');
    if (confirm(`Destroy group ${this.roomName()}?`)) {
      await this.roomsService.destroyRoom(this.roomName(), reason);
    }
  }

  async sendMessage(): Promise<void> {
    const body = prompt('Message body:');
    if (!body) return;
    const nick = prompt('Nick (optional):') || '';
    await this.roomsService.sendRoomMessage(this.roomName(), body, nick);
    alert('Message sent');
  }

  async setAffiliation(): Promise<void> {
    const userJid = prompt('User JID:');
    if (!userJid) return;
    const affiliation = prompt('Affiliation (owner/admin/member/outcast/none):') || '';
    if (!affiliation) return;
    await this.roomsService.setRoomAffiliation(this.roomName(), userJid, affiliation);
    await this.load();
  }

  async kick(row: any): Promise<void> {
    const nick = row?.nick;
    if (!nick) return;
    const reason = prompt('Reason (optional):') || '';
    await this.roomsService.kickFromRoom(this.roomName(), nick, reason);
    await this.load();
  }

  async ban(row: any): Promise<void> {
    const userJid = row?.jid;
    if (!userJid) return;
    await this.roomsService.banFromRoom(this.roomName(), userJid);
    await this.load();
  }

  historyColumns: TableColumn[] = [
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    { key: 'message', label: 'Message', sortable: false },
  ];

  affiliationsColumns: TableColumn[] = [
    { key: 'jid', label: 'JID', sortable: true },
    { key: 'affiliation', label: 'Affiliation', sortable: true },
    { key: 'reason', label: 'Reason', sortable: false },
  ];
}
