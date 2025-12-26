import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { TranslateModule } from '@ngx-translate/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'image' | 'boolean' | 'date';
}

export interface TableAction {
  label: string;
  icon?: string;
  handler: (row: any) => void;
  visible?: (row: any) => boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkTableModule, TranslateModule],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions?: TableAction[];
  @Input() showRefresh: boolean = true;
  @Input() enablePagination: boolean = true;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  @Output() rowClick = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<{ page: number; pageSize: number }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  denseMode = signal(false);
  sortKey = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  isRefreshing = signal(false);
  
  currentPage = signal(1);
  currentPageSize = signal(10);

  sortedData = signal<any[]>([]);
  
  // Computed values for pagination
  totalItems = computed(() => this.sortedData().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.currentPageSize()));
  startIndex = computed(() => (this.currentPage() - 1) * this.currentPageSize());
  endIndex = computed(() => Math.min(this.startIndex() + this.currentPageSize(), this.totalItems()));
  
  // Paginated data
  paginatedData = computed(() => {
    if (!this.enablePagination) {
      return this.sortedData();
    }
    return this.sortedData().slice(this.startIndex(), this.endIndex());
  });
  
  // Visible page numbers for pagination UI
  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | string)[] = [];
    
    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (current > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (current < total - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(total);
    }
    
    return pages;
  });

  ngOnInit(): void {
    this.sortedData.set([...this.data]);
  }

  ngOnChanges(): void {
    this.sortedData.set([...this.data]);
    if (this.sortKey()) {
      this.applySorting();
    }
  }

  sort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }

    this.applySorting();
  }

  private applySorting(): void {
    const key = this.sortKey();
    if (!key) return;

    const sorted = [...this.data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return this.sortDirection() === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection() === 'asc' ? 1 : -1;
      return 0;
    });

    this.sortedData.set(sorted);
  }

  onDenseModeChange(): void {
    localStorage.setItem('table_dense_mode', this.denseMode().toString());
  }

  onRefresh(): void {
    this.isRefreshing.set(true);
    this.refresh.emit({
      page: this.currentPage(),
      pageSize: this.currentPageSize()
    });
    
    // Reset refreshing state after a short delay
    setTimeout(() => {
      this.isRefreshing.set(false);
    }, 500);
  }

  // Pagination methods
  goToPage(page: any): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages());
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  onPageSizeChange(newSize: number): void {
    this.currentPageSize.set(newSize);
    this.currentPage.set(1); // Reset to first page when page size changes
    this.pageSizeChange.emit(newSize);
  }

  isNumber(value: number | string): boolean {
    return typeof value === 'number';
  }
}
