import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table/data-table.component';
import { EjabberdRoomsService } from '../../../core/services/ejabberd-rooms.service';

@Component({
  selector: 'app-ejabberd-rooms-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, DataTableComponent],
  templateUrl: './rooms-list.component.html',
})
export class EjabberdRoomsListComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);

  rooms = signal<any[]>([]);

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Room', sortable: true },
    { key: 'host', label: 'Host', sortable: true },
    { key: 'occupantsCount', label: 'Occupants', sortable: true, width: '120px' },
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      handler: (row) => this.view(row),
    },
    {
      label: 'Destroy',
      handler: (row) => this.destroy(row),
    },
  ];

  constructor(
    private roomsService: EjabberdRoomsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const onlineRooms = await this.roomsService.getOnlineRooms();
      const normalized = (onlineRooms || []).map((r: any) => ({
        name: r?.name || r?.room || r?.roomName,
        host: r?.host || r?.mucHost,
        occupantsCount: r?.occupantsCount ?? r?.occupants?.length,
        _raw: r,
      }));
      this.rooms.set(normalized);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load rooms');
    } finally {
      this.loading.set(false);
    }
  }

  async destroy(row: any): Promise<void> {
    const roomName = row?.name;
    if (!roomName) return;
    const reason = prompt('Reason (optional):');
    if (confirm(`Destroy room ${roomName}?`)) {
      await this.roomsService.destroyRoom(roomName, reason);
      await this.load();
    }
  }

  view(row: any): void {
    const roomName = row?.name;
    if (!roomName) return;
    this.router.navigate(['/groups', roomName]);
  }
}
