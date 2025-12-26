import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table/data-table.component';
import { EjabberdUsersService, UserRow, PageResponse } from '../../../core/services/ejabberd-users.service';

@Component({
  selector: 'app-ejabberd-users-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, DataTableComponent],
  templateUrl: './users-list.component.html',
})
export class EjabberdUsersListComponent implements OnInit, OnDestroy {
  loading = signal(true);
  error = signal<string | null>(null);

  users = signal<UserRow[]>([]);
  totalUsers = signal(0);
  currentPage = signal(0);
  pageSize = signal(20);
  searchQuery = signal('');

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  tableColumns: TableColumn[] = [
    { key: 'photo', label: '', sortable: false, width: '50px', type: 'image' },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'fullName', label: 'Full Name', sortable: true },
    { key: 'registeredAt', label: 'Registered', sortable: true },
    { key: 'lastActivityAt', label: 'Last Activity', sortable: true },
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      handler: (row) => this.view(row),
    },
    {
      label: 'Kick',
      handler: (row) => this.kick(row),
    },
    {
      label: 'Ban',
      handler: (row) => this.ban(row),
    },
    {
      label: 'Unban',
      handler: (row) => this.unban(row),
    },
    {
      label: 'Deactivate',
      handler: (row) => this.deactivate(row),
    },
    {
      label: 'Activate',
      handler: (row) => this.activate(row),
    },
  ];

  Math = Math;

  constructor(
    private usersService: EjabberdUsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((query) => {
      this.searchQuery.set(query);
      this.currentPage.set(0);
      this.load();
    });

    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usersService.getUserDirectory({
      host: 'localhost',
      page: this.currentPage(),
      size: this.pageSize(),
      q: this.searchQuery() || undefined,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: PageResponse<UserRow>) => {
        const usersWithPhoto = response.items.map((user) => ({
          ...user,
          photo: user.photoThumbBase64 ? `data:image/jpeg;base64,${user.photoThumbBase64}` : null,
          registeredAt: user.registeredAt ? this.formatDate(user.registeredAt) : '-',
          lastActivityAt: user.lastActivityAt ? this.formatDate(user.lastActivityAt) : '-',
        }));
        this.users.set(usersWithPhoto as any);
        this.totalUsers.set(response.total);
        this.loading.set(false);
      },
      error: (e: any) => {
        this.error.set(e?.message || 'Failed to load users');
        this.loading.set(false);
      },
    });
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.load();
  }

  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  }

  private getUsername(row: any): string {
    return row?.username || row?.user || row?.name;
  }

  view(row: any): void {
    const username = this.getUsername(row);
    if (!username) return;
    this.router.navigate(['/users', username]);
  }

  async kick(row: any): Promise<void> {
    const username = this.getUsername(row);
    const reason = prompt('Reason (optional):');
    await this.usersService.kickUser(username, reason);
  }

  async ban(row: any): Promise<void> {
    const username = this.getUsername(row);
    const reason = prompt('Reason (optional):');
    await this.usersService.banUser(username, reason);
  }

  async unban(row: any): Promise<void> {
    const username = this.getUsername(row);
    await this.usersService.unbanUser(username);
  }

  async deactivate(row: any): Promise<void> {
    const username = this.getUsername(row);
    const reason = prompt('Reason (optional):');
    await this.usersService.deactivateUser(username, reason);
  }

  async activate(row: any): Promise<void> {
    const username = this.getUsername(row);
    await this.usersService.activateUser(username);
  }
}
