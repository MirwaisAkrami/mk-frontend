import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';
import { LucideAngularModule, Home, Users, UsersRound, BarChart3, Shield, ChevronDown, ChevronRight } from 'lucide-angular';

interface MenuItem {
  label: string;
  icon: any;
  route?: string;
  roles?: UserRole[];
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      
      /* Custom scrollbar for sidebar */
      aside::-webkit-scrollbar {
        width: 6px;
      }
      
      aside::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }
      
      aside::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
      
      aside::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    `,
  ],
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  
  // Icons
  Home = Home;
  Users = Users;
  BarChart3 = BarChart3;
  UsersRound = UsersRound;
  Shield = Shield;
  ChevronDown = ChevronDown;
  ChevronRight = ChevronRight;

  expandedGroups = signal<Record<string, boolean>>({
    'nav.system': false,
    'nav.admin': false,
  });

  get userRole() {
    return this.authService.userRole;
  }

  menuItems: MenuItem[] = [
    {
      label: 'nav.dashboard',
      icon: Home,
      route: '/dashboard',
    },
    {
      label: 'nav.users',
      icon: Users,
      route: '/users',
    },
    {
      label: 'nav.groups',
      icon: UsersRound,
      route: '/groups',
    },
    {
      label: 'nav.analytics',
      icon: BarChart3,
      route: '/analytics',
    },
    {
      label: 'nav.system',
      icon: BarChart3,
      children: [
        { label: 'nav.stats', icon: BarChart3, route: '/system/stats' },
      ],
    },
    {
      label: 'nav.admin',
      icon: Shield,
      roles: ['ADMIN'],
      children: [
        { label: 'nav.adminUsers', icon: Users, route: '/admin/users', roles: ['ADMIN'] },
        { label: 'nav.roles', icon: Shield, route: '/admin/roles', roles: ['ADMIN'] },
      ],
    },
  ];

  visibleMenuItems = computed(() => {
    return this.menuItems.filter((item) => this.canAccess(item));
  });

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Load expanded state from localStorage
    const saved = localStorage.getItem('sidebar_expanded_groups');
    if (saved) {
      try {
        this.expandedGroups.set(JSON.parse(saved));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }

  canAccess(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    const role = this.userRole();
    return role ? item.roles.includes(role) : false;
  }

  toggleGroup(item: MenuItem): void {
    this.expandedGroups.update((groups) => {
      const newGroups = { ...groups };
      newGroups[item.label] = !newGroups[item.label];
      localStorage.setItem('sidebar_expanded_groups', JSON.stringify(newGroups));
      return newGroups;
    });
  }
}
