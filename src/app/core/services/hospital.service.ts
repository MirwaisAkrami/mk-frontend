import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Hospital {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  districtId: number;
  districtName: string;
  provinceName: string;
  isActive: boolean;
  type?: string;
  hasMaternityWard?: boolean;
  hasEmergency?: boolean;
  displayOrder?: number;
}

export interface CreateHospitalDto {
  code: string;
  name: string;
  address: string;
  phone: string;
  districtId: number;
  provinceId: number;
  type?: string;
  hasMaternityWard?: boolean;
  hasEmergency?: boolean;
  displayOrder?: number;
}

export interface UpdateHospitalDto {
  code?: string;
  name?: string;
  address?: string;
  phone?: string;
  districtId?: number;
  provinceId?: number;
  type?: string;
  hasMaternityWard?: boolean;
  hasEmergency?: boolean;
  isActive?: boolean;
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
export class HospitalService {
  private http = inject(HttpClient);
  private apiUrl = '/api/hospitals';

  /**
   * Get all active hospitals (simple list)
   */
  getAllActiveHospitals(): Observable<Hospital[]> {
    return this.http
      .get<ApiResponse<Hospital[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  /**
   * Get all active hospitals with pagination
   */
  getAllActiveHospitalsPaginated(
    page: number = 0,
    size: number = 10,
    sort: string[] = ['displayOrder', 'asc']
  ): Observable<PageResponse<Hospital>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Hospital>>>(`${this.apiUrl}/paginated`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospitals by province
   */
  getHospitalsByProvince(provinceId: number): Observable<Hospital[]> {
    return this.http
      .get<ApiResponse<Hospital[]>>(`${this.apiUrl}/province/${provinceId}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get active hospitals by province
   */
  getActiveHospitalsByProvince(provinceId: number): Observable<Hospital[]> {
    return this.http
      .get<ApiResponse<Hospital[]>>(`${this.apiUrl}/province/${provinceId}/active`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospitals by province with pagination
   */
  getHospitalsByProvincePaginated(
    provinceId: number,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['displayOrder', 'asc']
  ): Observable<PageResponse<Hospital>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Hospital>>>(`${this.apiUrl}/province/${provinceId}/paginated`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get active hospitals by province with pagination
   */
  getActiveHospitalsByProvincePaginated(
    provinceId: number,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['displayOrder', 'asc']
  ): Observable<PageResponse<Hospital>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Hospital>>>(`${this.apiUrl}/province/${provinceId}/active/paginated`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospitals by district
   */
  getHospitalsByDistrict(districtId: number): Observable<Hospital[]> {
    return this.http
      .get<ApiResponse<Hospital[]>>(`${this.apiUrl}/district/${districtId}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get active hospitals by district
   */
  getActiveHospitalsByDistrict(districtId: number): Observable<Hospital[]> {
    return this.http
      .get<ApiResponse<Hospital[]>>(`${this.apiUrl}/district/${districtId}/active`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospitals by district with pagination
   */
  getHospitalsByDistrictPaginated(
    districtId: number,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['displayOrder', 'asc']
  ): Observable<PageResponse<Hospital>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Hospital>>>(`${this.apiUrl}/district/${districtId}/paginated`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get active hospitals by district with pagination
   */
  getActiveHospitalsByDistrictPaginated(
    districtId: number,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['displayOrder', 'asc']
  ): Observable<PageResponse<Hospital>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Hospital>>>(`${this.apiUrl}/district/${districtId}/active/paginated`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospital by ID
   */
  getHospitalById(id: number): Observable<Hospital> {
    return this.http
      .get<ApiResponse<Hospital>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospital by code
   */
  getHospitalByCode(code: string): Observable<Hospital> {
    return this.http
      .get<ApiResponse<Hospital>>(`${this.apiUrl}/code/${code}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospitals by type
   */
  getHospitalsByType(type: string): Observable<Hospital[]> {
    return this.http
      .get<ApiResponse<Hospital[]>>(`${this.apiUrl}/type/${type}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospitals by type with pagination
   */
  getHospitalsByTypePaginated(
    type: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['displayOrder', 'asc']
  ): Observable<PageResponse<Hospital>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Hospital>>>(`${this.apiUrl}/type/${type}/paginated`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospitals with maternity ward
   */
  getHospitalsWithMaternityWard(): Observable<Hospital[]> {
    return this.http
      .get<ApiResponse<Hospital[]>>(`${this.apiUrl}/maternity`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospitals with maternity ward by province
   */
  getHospitalsWithMaternityWardByProvince(provinceId: number): Observable<Hospital[]> {
    return this.http
      .get<ApiResponse<Hospital[]>>(`${this.apiUrl}/maternity/province/${provinceId}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get hospitals with emergency services
   */
  getHospitalsWithEmergency(): Observable<Hospital[]> {
    return this.http
      .get<ApiResponse<Hospital[]>>(`${this.apiUrl}/emergency`)
      .pipe(map((response) => response.data));
  }

  /**
   * Search hospitals by name
   */
  searchHospitals(
    keyword: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['name', 'asc']
  ): Observable<PageResponse<Hospital>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Hospital>>>(`${this.apiUrl}/search`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Search active hospitals by name
   */
  searchActiveHospitals(
    keyword: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['name', 'asc']
  ): Observable<PageResponse<Hospital>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Hospital>>>(`${this.apiUrl}/search/active`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Search hospitals in a province
   */
  searchHospitalsInProvince(
    provinceId: number,
    keyword: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['name', 'asc']
  ): Observable<PageResponse<Hospital>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Hospital>>>(`${this.apiUrl}/province/${provinceId}/search`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Search hospitals in a district
   */
  searchHospitalsInDistrict(
    districtId: number,
    keyword: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['name', 'asc']
  ): Observable<PageResponse<Hospital>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Hospital>>>(`${this.apiUrl}/district/${districtId}/search`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Create a new hospital
   */
  createHospital(dto: CreateHospitalDto): Observable<Hospital> {
    return this.http
      .post<ApiResponse<Hospital>>(this.apiUrl, dto)
      .pipe(map((response) => response.data));
  }

  /**
   * Update an existing hospital
   */
  updateHospital(id: number, dto: UpdateHospitalDto): Observable<Hospital> {
    return this.http
      .put<ApiResponse<Hospital>>(`${this.apiUrl}/${id}`, dto)
      .pipe(map((response) => response.data));
  }

  /**
   * Delete a hospital (soft delete)
   */
  deleteHospital(id: number): Observable<string> {
    return this.http
      .delete<ApiResponse<string>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Count hospitals by province
   */
  countHospitalsByProvince(provinceId: number): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.apiUrl}/province/${provinceId}/count`)
      .pipe(map((response) => response.data));
  }

  /**
   * Count active hospitals by province
   */
  countActiveHospitalsByProvince(provinceId: number): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.apiUrl}/province/${provinceId}/count/active`)
      .pipe(map((response) => response.data));
  }

  /**
   * Count hospitals by district
   */
  countHospitalsByDistrict(districtId: number): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.apiUrl}/district/${districtId}/count`)
      .pipe(map((response) => response.data));
  }

  /**
   * Count active hospitals by district
   */
  countActiveHospitalsByDistrict(districtId: number): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.apiUrl}/district/${districtId}/count/active`)
      .pipe(map((response) => response.data));
  }
}
