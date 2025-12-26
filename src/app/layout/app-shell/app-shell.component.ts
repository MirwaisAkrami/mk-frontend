import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, BreadcrumbsComponent],
  templateUrl: './app-shell.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AppShellComponent {
  sidebarCollapsed = signal(false);

  constructor() {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved !== null) {
      this.sidebarCollapsed.set(saved === 'true');
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((val) => !val);
    localStorage.setItem('sidebar_collapsed', this.sidebarCollapsed().toString());
  }
}
