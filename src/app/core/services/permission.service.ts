import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Permission {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  successMessage?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private http = inject(HttpClient);
  private apiUrl = '/api/permissions';

  getAllPermissions(): Observable<Permission[]> {
    return this.http
      .get<ApiResponse<Permission[]>>(`${this.apiUrl}/all`)
      .pipe(map((response) => response.data));
  }
}
