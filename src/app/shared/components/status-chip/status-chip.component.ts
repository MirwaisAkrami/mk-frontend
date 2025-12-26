import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-chip.component.html',
})
export class StatusChipComponent {
  @Input() status!: ApplicationStatus | string;

  getStatusClass(): string {
    const baseClass = 'status-chip';

    const statusClasses: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SUBMITTED: 'bg-blue-100 text-blue-800',
      IN_REVIEW: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      RETURNED: 'bg-orange-100 text-orange-800',
      ACTIVE: 'bg-green-100 text-green-800',
      REVOKED: 'bg-red-100 text-red-800',
      REISSUED: 'bg-blue-100 text-blue-800',
    };

    return statusClasses[this.status] || 'bg-gray-100 text-gray-800';
  }
}
