import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Device {
  id: number;
  deviceName: string;
  activationKey: string;
  hospitalId: number;
  hospitalName: string;
  districtName: string;
  provinceName: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  ipAddress?: string;
  activatedAt?: string;
  lastSyncAt?: string;
  registrationDate: string;
  expirationDate: string;
  suspensionReason?: string;
  revocationReason?: string;
  createdAt: string,
  expiresAt: string
}

export interface RegisterDeviceDto {
  deviceName: string;
  deviceType: string;
  deviceImei?: string;
  provinceId: number;
  districtId?: number;
  hospitalId?: number;
  expiryDate?: string;
  notes?: string;
}

export interface UpdateDeviceDto {
  deviceName?: string;
  deviceType?: string;
  deviceImei?: string;
  provinceId?: number;
  districtId?: number;
  hospitalId?: number;
  expiryDate?: string;
  notes?: string;
}

export interface ActivateDeviceDto {
  activationKey: string;
  deviceModel: string;
  osVersion: string;
  appVersion: string;
}

export interface DeviceConfigurationDto {
  deviceId: number;
  hospitalId: number;
  hospitalName: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  serverUrl: string;
  syncInterval: number;
  expirationDate: string;
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
export class DeviceService {
  private http = inject(HttpClient);
  private apiUrl = '/api/devices';

  /**
   * Register a new device (Admin only)
   * POST /api/devices/register
   */
  registerDevice(dto: RegisterDeviceDto): Observable<Device> {
    return this.http
      .post<ApiResponse<Device>>(`${this.apiUrl}/register`, dto)
      .pipe(map((response) => response.data));
  }

  /**
   * Activate device (Mobile app - no authentication required initially)
   * POST /api/devices/activate
   */
  activateDevice(dto: ActivateDeviceDto): Observable<DeviceConfigurationDto> {
    return this.http
      .post<ApiResponse<DeviceConfigurationDto>>(`${this.apiUrl}/activate`, dto)
      .pipe(map((response) => response.data));
  }

  /**
   * Get all devices with pagination (Admin only)
   * GET /api/devices?page=0&size=10&sort=registrationDate,desc
   */
  getAllDevices(
    page: number = 0,
    size: number = 10,
    sort: string[] = ['registrationDate', 'desc']
  ): Observable<PageResponse<Device>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Device>>>(this.apiUrl, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get devices by status (Admin only)
   * GET /api/devices/status/{status}?page=0&size=10
   */
  getDevicesByStatus(
    status: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['registrationDate', 'desc']
  ): Observable<PageResponse<Device>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Device>>>(`${this.apiUrl}/status/${status}`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get device by ID (Admin only)
   * GET /api/devices/{id}
   */
  getDeviceById(id: number): Observable<Device> {
    return this.http
      .get<ApiResponse<Device>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get devices by hospital (Admin only)
   * GET /api/devices/hospital/{hospitalId}?page=0&size=10
   */
  getDevicesByHospital(
    hospitalId: number,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['registrationDate', 'desc']
  ): Observable<PageResponse<Device>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Device>>>(`${this.apiUrl}/hospital/${hospitalId}`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Get devices by province (Admin only)
   * GET /api/devices/province/{provinceId}?page=0&size=10
   */
  getDevicesByProvince(
    provinceId: number,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['registrationDate', 'desc']
  ): Observable<PageResponse<Device>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Device>>>(`${this.apiUrl}/province/${provinceId}`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Search devices (Admin only)
   * GET /api/devices/search?keyword=tablet&page=0&size=10
   */
  searchDevices(
    keyword: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ['registrationDate', 'desc']
  ): Observable<PageResponse<Device>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<Device>>>(`${this.apiUrl}/search`, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Update device (Admin only)
   * PUT /api/devices/{id}
   */
  updateDevice(id: number, dto: UpdateDeviceDto): Observable<Device> {
    return this.http
      .put<ApiResponse<Device>>(`${this.apiUrl}/${id}`, dto)
      .pipe(map((response) => response.data));
  }

  /**
   * Suspend device (Admin only)
   * PUT /api/devices/{id}/suspend
   */
  suspendDevice(id: number, reason: string): Observable<string> {
    const params = new HttpParams().set('reason', reason);
    return this.http
      .put<ApiResponse<string>>(`${this.apiUrl}/${id}/suspend`, null, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Revoke device (Admin only)
   * PUT /api/devices/{id}/revoke
   */
  revokeDevice(id: number, reason: string): Observable<string> {
    const params = new HttpParams().set('reason', reason);
    return this.http
      .put<ApiResponse<string>>(`${this.apiUrl}/${id}/revoke`, null, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * Reactivate device (Admin only)
   * PUT /api/devices/{id}/reactivate
   */
  reactivateDevice(id: number): Observable<string> {
    return this.http
      .put<ApiResponse<string>>(`${this.apiUrl}/${id}/reactivate`, null)
      .pipe(map((response) => response.data));
  }

  /**
   * Delete device (Admin only)
   * DELETE /api/devices/{id}
   */
  deleteDevice(id: number): Observable<string> {
    return this.http
      .delete<ApiResponse<string>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }
}
