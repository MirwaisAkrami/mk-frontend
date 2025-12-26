import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminUsersService } from '../../../core/services/admin-users.service';

@Component({
  selector: 'app-admin-user-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink],
  templateUrl: './admin-user-roles.component.html',
})
export class AdminUserRolesComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);

  userId = signal<number>(0);

  roles = signal<any[]>([]);
  selectedRoleIds = signal<number[]>([]);

  title = computed(() => `Assign Roles (User #${this.userId()})`);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminUsersService: AdminUsersService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('userId'));
    this.userId.set(id);
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const [roles, userRoles] = await Promise.all([
        this.adminUsersService.getAllRoles(),
        this.adminUsersService.getUserRoles(this.userId()),
      ]);

      this.roles.set(roles);
      this.selectedRoleIds.set((userRoles || []).map((r: any) => Number(r.id)).filter(Boolean));
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to load user roles');
    } finally {
      this.loading.set(false);
    }
  }

  toggle(roleId: number, checked: boolean): void {
    const current = new Set(this.selectedRoleIds());
    if (checked) {
      current.add(roleId);
    } else {
      current.delete(roleId);
    }
    this.selectedRoleIds.set([...current]);
  }

  async save(): Promise<void> {
    try {
      await this.adminUsersService.assignRoles(this.userId(), this.selectedRoleIds());
      this.router.navigate(['/admin/users']);
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to assign roles');
    }
  }
}
