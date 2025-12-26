import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { AdminUsersService } from '../../../core/services/admin-users.service';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, TranslateModule, DataTableComponent],
  templateUrl: './admin-roles.component.html',
})
export class AdminRolesComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);

  roles = signal<any[]>([]);

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true, width: '100px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'active', label: 'Active', sortable: true, width: '110px' },
  ];

  constructor(private adminUsersService: AdminUsersService) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const roles = await this.adminUsersService.getAllRoles();
      this.roles.set(roles);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load roles');
    } finally {
      this.loading.set(false);
    }
  }
}
