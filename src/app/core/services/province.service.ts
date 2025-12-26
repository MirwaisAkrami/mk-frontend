import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Province {
  id: number;
  code: string;
  name: string;
  countryId?: number;
  isActive?: boolean;
}

interface ApiResponse<T> {
  data: T;
  status: {
    code: number;
    message: string;
  };
  isSuccess: boolean;
  successMessage?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  private http = inject(HttpClient);
  private apiUrl = '/api/provinces';

  /**
   * Get all active provinces (simple list)
   */
  getAllActiveProvinces(): Observable<Province[]> {
    return this.http
      .get<ApiResponse<Province[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  /**
   * Get province by ID
   */
  getProvinceById(id: number): Observable<Province> {
    return this.http
      .get<ApiResponse<Province>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Search provinces by name
   */
  searchProvinces(name: string): Observable<Province[]> {
    const params = new HttpParams().set('name', name);
    return this.http
      .get<ApiResponse<Province[]>>(`${this.apiUrl}/search`, { params })
      .pipe(map((response) => response.data));
  }
}
