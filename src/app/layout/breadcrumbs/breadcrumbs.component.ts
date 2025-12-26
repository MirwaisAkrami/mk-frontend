import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs = signal<Breadcrumb[]>([]);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs.set(this.createBreadcrumbs());
      });

    this.breadcrumbs.set(this.createBreadcrumbs());
  }

  private createBreadcrumbs(): Breadcrumb[] {
    const url = this.router.url;
    const segments = url.split('/').filter((s) => s);

    if (segments.length === 0) {
      return [{ label: 'nav.dashboard', url: '/dashboard' }];
    }

    const breadcrumbs: Breadcrumb[] = [{ label: 'nav.home', url: '/' }];

    let currentUrl = '';
    segments.forEach((segment) => {
      currentUrl += `/${segment}`;
      breadcrumbs.push({
        label: this.getLabelForSegment(segment),
        url: currentUrl,
      });
    });

    return breadcrumbs;
  }

  private getLabelForSegment(segment: string): string {
    const labels: Record<string, string> = {
      dashboard: 'nav.dashboard',
      birth: 'nav.birthRegistration',
      death: 'nav.deathRegistration',
      applications: 'nav.applications',
      certificates: 'nav.certificates',
      search: 'nav.search',
      reports: 'nav.reports',
      admin: 'nav.administration',
      settings: 'nav.settings',
      help: 'nav.help',
      new: 'nav.new',
      verify: 'nav.verify',
      issue: 'nav.issue',
    };

    return labels[segment] || segment;
  }
}
