import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BirthRegistration {
  first_name: string;
  first_name_en?: string;
  last_name: string;
  last_name_en?: string;
  gender: string;
  date_of_birth: string;
  time_of_birth?: string;
  nationality_id?: number;
  native_language?: string;
  tribe?: string;
  
  birth_type?: string;
  birth_place: string;
  hospital_id?: number;
  birth_weight?: number;
  birth_height?: number;
  birth_country_id?: number;
  birth_province_id?: number;
  birth_district?: string;
  birth_village?: string;
  birth_place_description?: string;
  
  father_name: string;
  father_name_en?: string;
  grandfather_name?: string;
  grandfather_name_en?: string;
  father_tazkira_number: string;
  father_tazkira_volume?: string;
  father_tazkira_page?: string;
  father_tazkira_reg_number?: string;
  father_tazkira_issue_date?: string;
  father_occupation?: string;
  father_age?: number;
  
  mother_name: string;
  mother_name_en?: string;
  mother_age?: number;
  mother_nationality_id?: number;
  child_number?: number;
  mother_deceased?: boolean;
  
  residence_province_id?: number;
  residence_district?: string;
  residence_village?: string;
  house_number?: string;
  address?: string;
  
  registrant_relationship: string;
  registrant_tazkira_number?: string;
  registrant_tazkira_volume?: string;
  registrant_tazkira_page?: string;
  registrant_tazkira_reg_number?: string;
  registrant_tazkira_issue_date?: string;
  
  phone_number: string;
  alternative_phone?: string;
  
  notes?: string;
}

export interface BirthResponse {
  id: number;
  certificate_number?: string;
  registration_number?: string;
  status: string;
  registration_type: string;
  registration_date: string;
  first_name: string;
  last_name: string;
  father_name: string;
  gender: string;
  date_of_birth: string;
  birth_place_description: string;
  hospital_name?: string;
  mother_name: string;
  father_tazkira_number: string;
  phone_number: string;
  address: string;
  registrant_relationship: string;
  created_at: string;
  updated_at: string;
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
  validationErrors?: Array<{
    identifier: string;
    errorMessage: string;
    errorCode: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class BirthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/birth';

  /**
   * Register a new birth
   */
  registerBirth(registration: BirthRegistration): Observable<BirthResponse> {
    return this.http
      .post<ApiResponse<BirthResponse>>(`${this.apiUrl}/register`, registration)
      .pipe(map((response) => {
        if (!response.isSuccess) {
          const errorMessage = response.errors?.join(', ') || 'Registration failed';
          throw new Error(errorMessage);
        }
        return response.data;
      }));
  }

  /**
   * Get birth registration by ID
   */
  getBirthById(id: number): Observable<BirthResponse> {
    return this.http
      .get<ApiResponse<BirthResponse>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => {
        if (!response.isSuccess) {
          const errorMessage = response.errors?.join(', ') || 'Failed to fetch birth record';
          throw new Error(errorMessage);
        }
        return response.data;
      }));
  }

  /**
   * Get all birth registrations with pagination
   */
  getAllBirths(
    page: number = 0,
    size: number = 10,
    sort: string[] = ['registrationDate', 'desc']
  ): Observable<PageResponse<BirthResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    sort.forEach(s => params = params.append('sort', s));

    return this.http
      .get<ApiResponse<PageResponse<BirthResponse>>>(this.apiUrl, { params })
      .pipe(map((response) => {
        if (!response.isSuccess) {
          const errorMessage = response.errors?.join(', ') || 'Failed to fetch birth records';
          throw new Error(errorMessage);
        }
        return response.data;
      }));
  }

  /**
   * Update birth registration status
   */
  updateBirthStatus(id: number, status: string): Observable<BirthResponse> {
    const params = new HttpParams().set('status', status);
    
    return this.http
      .put<ApiResponse<BirthResponse>>(`${this.apiUrl}/${id}/status`, null, { params })
      .pipe(map((response) => {
        if (!response.isSuccess) {
          const errorMessage = response.errors?.join(', ') || 'Failed to update status';
          throw new Error(errorMessage);
        }
        return response.data;
      }));
  }

  /**
   * Delete birth registration
   */
  deleteBirth(id: number): Observable<string> {
    return this.http
      .delete<ApiResponse<string>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => {
        if (!response.isSuccess) {
          const errorMessage = response.errors?.join(', ') || 'Failed to delete birth record';
          throw new Error(errorMessage);
        }
        return response.data;
      }));
  }
}
