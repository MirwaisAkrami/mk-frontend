import { Injectable } from '@angular/core';
import {
  District,
  Province,
  Hospital,
  CauseOfDeath,
  Office,
} from '../models/reference-data.model';

@Injectable({
  providedIn: 'root',
})
export class ReferenceDataService {
  private provinces: Province[] = this.generateProvinces();
  private districts: District[] = this.generateDistricts();
  private hospitals: Hospital[] = this.generateHospitals();
  private causesOfDeath: CauseOfDeath[] = this.generateCausesOfDeath();
  private offices: Office[] = this.generateOffices();

  async getProvinces(): Promise<Province[]> {
    await this.delay(200);
    return [...this.provinces];
  }

  async getDistricts(provinceId?: string): Promise<District[]> {
    await this.delay(200);
    if (provinceId) {
      return this.districts.filter((d) => d.provinceId === provinceId);
    }
    return [...this.districts];
  }

  async getHospitals(districtId?: string): Promise<Hospital[]> {
    await this.delay(200);
    if (districtId) {
      return this.hospitals.filter((h) => h.districtId === districtId);
    }
    return [...this.hospitals];
  }

  async getCausesOfDeath(): Promise<CauseOfDeath[]> {
    await this.delay(200);
    return [...this.causesOfDeath];
  }

  async getOffices(): Promise<Office[]> {
    await this.delay(200);
    return [...this.offices];
  }

  private generateProvinces(): Province[] {
    return [
      {
        id: 'PROV-001',
        code: 'KBL',
        nameEn: 'Kabul',
        namePs: 'کابل',
        nameFa: 'کابل',
        isActive: true,
      },
      {
        id: 'PROV-002',
        code: 'HRT',
        nameEn: 'Herat',
        namePs: 'هرات',
        nameFa: 'هرات',
        isActive: true,
      },
      {
        id: 'PROV-003',
        code: 'KDH',
        nameEn: 'Kandahar',
        namePs: 'کندهار',
        nameFa: 'قندهار',
        isActive: true,
      },
    ];
  }

  private generateDistricts(): District[] {
    return [
      {
        id: 'DIST-001',
        code: 'KBL-01',
        nameEn: 'District 1',
        namePs: 'لومړۍ ناحیه',
        nameFa: 'ناحیه اول',
        provinceId: 'PROV-001',
        isActive: true,
      },
      {
        id: 'DIST-002',
        code: 'KBL-02',
        nameEn: 'District 2',
        namePs: 'دویمه ناحیه',
        nameFa: 'ناحیه دوم',
        provinceId: 'PROV-001',
        isActive: true,
      },
      {
        id: 'DIST-003',
        code: 'HRT-01',
        nameEn: 'Herat City',
        namePs: 'د هرات ښار',
        nameFa: 'شهر هرات',
        provinceId: 'PROV-002',
        isActive: true,
      },
    ];
  }

  private generateHospitals(): Hospital[] {
    return [
      {
        id: 'HOSP-001',
        code: 'KBL-H-001',
        nameEn: 'Kabul Central Hospital',
        namePs: 'د کابل مرکزي روغتون',
        nameFa: 'شفاخانه مرکزی کابل',
        districtId: 'DIST-001',
        isActive: true,
      },
      {
        id: 'HOSP-002',
        code: 'KBL-H-002',
        nameEn: 'Jamhuriat Hospital',
        namePs: 'جمهوریت روغتون',
        nameFa: 'شفاخانه جمهوریت',
        districtId: 'DIST-001',
        isActive: true,
      },
    ];
  }

  private generateCausesOfDeath(): CauseOfDeath[] {
    return [
      {
        id: 'COD-001',
        code: 'NAT',
        nameEn: 'Natural Causes',
        namePs: 'طبیعي لاملونه',
        nameFa: 'علل طبیعی',
        category: 'Natural',
        isActive: true,
      },
      {
        id: 'COD-002',
        code: 'ACC',
        nameEn: 'Accident',
        namePs: 'پیښه',
        nameFa: 'حادثه',
        category: 'Accidental',
        isActive: true,
      },
      {
        id: 'COD-003',
        code: 'ILL',
        nameEn: 'Illness',
        namePs: 'ناروغي',
        nameFa: 'بیماری',
        category: 'Medical',
        isActive: true,
      },
    ];
  }

  private generateOffices(): Office[] {
    return [
      {
        id: 'OFF-001',
        code: 'KBL-OFF-001',
        nameEn: 'Kabul Central Registry Office',
        namePs: 'د کابل مرکزي راجستري دفتر',
        nameFa: 'دفتر ثبت احوال مرکزی کابل',
        districtId: 'DIST-001',
        address: 'Kabul, District 1, Main Street',
        contact: '+93700000000',
        isActive: true,
      },
    ];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
