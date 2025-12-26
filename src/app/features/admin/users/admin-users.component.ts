import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table/data-table.component';
import { AdminUsersService } from '../../../core/services/admin-users.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, TranslateModule, DataTableComponent],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);

  users = signal<any[]>([]);

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true, width: '100px' },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phoneNo', label: 'Phone', sortable: true },
    { key: 'userType', label: 'Type', sortable: true, width: '140px' },
    { key: 'active', label: 'Active', sortable: true, width: '110px' },
  ];

  tableActions: TableAction[] = [
    {
      label: 'Roles',
      handler: (row) => this.manageRoles(row),
    },
    {
      label: 'Activate',
      handler: (row) => this.activate(row),
    },
    {
      label: 'Deactivate',
      handler: (row) => this.deactivate(row),
    },
    {
      label: 'Reset Password',
      handler: (row) => this.resetPassword(row),
    },
  ];

  constructor(
    private adminUsersService: AdminUsersService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const users = await this.adminUsersService.getAllUsers();
      this.users.set(users);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load admin users');
    } finally {
      this.loading.set(false);
    }
  }

  async activate(row: any): Promise<void> {
    const id = Number(row?.id);
    if (!id) return;
    await this.adminUsersService.activateUser(id);
    await this.load();
  }

  async deactivate(row: any): Promise<void> {
    const id = Number(row?.id);
    if (!id) return;
    await this.adminUsersService.deactivateUser(id);
    await this.load();
  }

  async resetPassword(row: any): Promise<void> {
    const id = Number(row?.id);
    if (!id) return;
    const tempPassword = await this.adminUsersService.resetPassword(id);
    alert(`Temporary password: ${tempPassword}`);
  }

  manageRoles(row: any): void {
    const id = Number(row?.id);
    if (!id) return;
    this.router.navigate(['/admin/users', id, 'roles']);
  }
}
