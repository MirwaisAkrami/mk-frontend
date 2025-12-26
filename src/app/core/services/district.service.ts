import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface District {
  id: number;
  code: string;
  name: string;
  provinceId: number;
  provinceName: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateDistrictDto {
  code: string;
  name: string;
  provinceId: number;
  displayOrder?: number;
}

export interface UpdateDistrictDto {
  code?: string;
  name?: string;
  provinceId?: number;
  displayOrder?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
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
export class DistrictService {
  private http = inject(HttpClient);
  private apiUrl = '/api/districts';

  /**
   * Get all active districts (simple list)
   */
  getAllActiveDistricts(): Observable<District[]> {
    return this.http
      .get<ApiResponse<District[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  /**
   * Get all active districts with pagination
   */
  getAllActiveDistrictsPaginated(
    page: number = 0,
    size: number = 10,
    sort: string[] = ['displayOrder', 'asc']
  ): Observable<PageResponse<District>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<District>>>(`${this.apiUrl}/paginated`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get districts by province
   */
  getDistrictsByProvince(provinceId: number): Observable<District[]> {
    return this.http
      .get<ApiResponse<District[]>>(`${this.apiUrl}/province/${provinceId}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get active districts by province
   */
  getActiveDistrictsByProvince(provinceId: number): Observable<District[]> {
    return this.http
      .get<ApiResponse<District[]>>(`${this.apiUrl}/province/${provinceId}/active`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get districts by province with pagination
   */
  getDistrictsByProvincePaginated(
    provinceId: number,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['displayOrder', 'asc']
  ): Observable<PageResponse<District>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<District>>>(`${this.apiUrl}/province/${provinceId}/paginated`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get active districts by province with pagination
   */
  getActiveDistrictsByProvincePaginated(
    provinceId: number,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['displayOrder', 'asc']
  ): Observable<PageResponse<District>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<District>>>(`${this.apiUrl}/province/${provinceId}/active/paginated`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get district by ID
   */
  getDistrictById(id: number): Observable<District> {
    return this.http
      .get<ApiResponse<District>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get district by code
   */
  getDistrictByCode(code: string): Observable<District> {
    return this.http
      .get<ApiResponse<District>>(`${this.apiUrl}/code/${code}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Search districts by name
   */
  searchDistricts(
    keyword: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['name', 'asc']
  ): Observable<PageResponse<District>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<District>>>(`${this.apiUrl}/search`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Search active districts by name
   */
  searchActiveDistricts(
    keyword: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['name', 'asc']
  ): Observable<PageResponse<District>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<District>>>(`${this.apiUrl}/search/active`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Search districts in a province
   */
  searchDistrictsInProvince(
    provinceId: number,
    keyword: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['name', 'asc']
  ): Observable<PageResponse<District>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<District>>>(`${this.apiUrl}/province/${provinceId}/search`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Create a new district
   */
  createDistrict(dto: CreateDistrictDto): Observable<District> {
    return this.http
      .post<ApiResponse<District>>(this.apiUrl, dto)
      .pipe(map((response) => response.data));
  }

  /**
   * Update an existing district
   */
  updateDistrict(id: number, dto: UpdateDistrictDto): Observable<District> {
    return this.http
      .put<ApiResponse<District>>(`${this.apiUrl}/${id}`, dto)
      .pipe(map((response) => response.data));
  }

  /**
   * Delete a district (soft delete)
   */
  deleteDistrict(id: number): Observable<string> {
    return this.http
      .delete<ApiResponse<string>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Count districts by province
   */
  countDistrictsByProvince(provinceId: number): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.apiUrl}/province/${provinceId}/count`)
      .pipe(map((response) => response.data));
  }

  /**
   * Count active districts by province
   */
  countActiveDistrictsByProvince(provinceId: number): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.apiUrl}/province/${provinceId}/count/active`)
      .pipe(map((response) => response.data));
  }
}
