import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/ejabberd/users/users-list.component').then(
            (m) => m.EjabberdUsersListComponent
          ),
      },
      {
        path: 'users/:username',
        loadComponent: () =>
          import('./features/users/user-detail.component').then(
            (m) => m.UserDetailComponent
          ),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./features/ejabberd/rooms/rooms-list.component').then(
            (m) => m.EjabberdRoomsListComponent
          ),
      },
      {
        path: 'groups/:roomName',
        loadComponent: () =>
          import('./features/groups/group-detail.component').then(
            (m) => m.GroupDetailComponent
          ),
      },
      {
        path: 'system/stats',
        loadComponent: () =>
          import('./features/ejabberd/stats/stats.component').then(
            (m) => m.EjabberdStatsComponent
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/analytics.component').then(
            (m) => m.AnalyticsComponent
          ),
      },
      {
        path: 'admin/users',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/admin/users/admin-users.component').then(
            (m) => m.AdminUsersComponent
          ),
      },
      {
        path: 'admin/users/:userId/roles',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/admin/users/admin-user-roles.component').then(
            (m) => m.AdminUserRolesComponent
          ),
      },
      {
        path: 'admin/roles',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/admin/roles/admin-roles.component').then(
            (m) => m.AdminRolesComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
