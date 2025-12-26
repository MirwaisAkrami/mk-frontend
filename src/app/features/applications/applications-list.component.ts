import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MockApiService } from '../../core/services/mock-api.service';
import { Application } from '../../core/models/application.model';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, DataTableComponent, NgSelectModule],
  templateUrl: './applications-list.component.html',
})
export class ApplicationsListComponent implements OnInit {
  applications = signal<Application[]>([]);
  filteredApplications = signal<Application[]>([]);

  statusOptions = [
    { value: '', label: 'All' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'ISSUED', label: 'Issued' },
  ];

  typeOptions = [
    { value: '', label: 'All' },
    { value: 'BIRTH', label: 'Birth' },
    { value: 'DEATH', label: 'Death' },
    { value: 'MARRIAGE', label: 'Marriage' },
    { value: 'DIVORCE', label: 'Divorce' },
  ];

  filters = {
    status: '',
    type: '',
    search: '',
  };

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'applications.applicationId', sortable: true, width: '150px' },
    { key: 'type', label: 'applications.type', sortable: true, width: '100px' },
    { key: 'applicantName', label: 'applications.applicantName', sortable: true },
    { key: 'applicantNID', label: 'NID', sortable: true, width: '120px' },
    { key: 'submittedDate', label: 'applications.submittedDate', sortable: true, width: '120px' },
    { key: 'status', label: 'applications.status', width: '120px' },
  ];

  tableActions: TableAction[] = [
    {
      label: 'common.view',
      handler: (row) => this.viewApplication(row),
    },
    {
      label: 'applications.approve',
      handler: (row) => this.approveApplication(row),
      visible: (row) => row.status === 'SUBMITTED' || row.status === 'IN_REVIEW',
    },
    {
      label: 'applications.reject',
      handler: (row) => this.rejectApplication(row),
      visible: (row) => row.status === 'SUBMITTED' || row.status === 'IN_REVIEW',
    },
  ];

  constructor(private mockApi: MockApiService) {}

  async ngOnInit(): Promise<void> {
    await this.loadApplications();
  }

  async loadApplications(): Promise<void> {
    const apps = await this.mockApi.getApplications();
    this.applications.set(apps);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.applications()];

    if (this.filters.status) {
      filtered = filtered.filter((app) => app.status === this.filters.status);
    }

    if (this.filters.type) {
      filtered = filtered.filter((app) => app.type === this.filters.type);
    }

    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.id.toLowerCase().includes(search) ||
          app.applicantName.toLowerCase().includes(search) ||
          app.applicantNID.toLowerCase().includes(search)
      );
    }

    this.filteredApplications.set(filtered);
  }

  resetFilters(): void {
    this.filters = { status: '', type: '', search: '' };
    this.applyFilters();
  }

  viewApplication(app: Application): void {
    console.log('View application:', app);
  }

  async approveApplication(app: Application): Promise<void> {
    if (confirm('Are you sure you want to approve this application?')) {
      await this.mockApi.approveApplication(app.id);
      await this.loadApplications();
    }
  }

  async rejectApplication(app: Application): Promise<void> {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      await this.mockApi.rejectApplication(app.id, reason);
      await this.loadApplications();
    }
  }
}
