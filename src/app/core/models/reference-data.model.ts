export interface District {
  id: string;
  code: string;
  nameEn: string;
  namePs: string;
  nameFa: string;
  provinceId: string;
  isActive: boolean;
}

export interface Province {
  id: string;
  code: string;
  nameEn: string;
  namePs: string;
  nameFa: string;
  isActive: boolean;
}

export interface Hospital {
  id: string;
  code: string;
  nameEn: string;
  namePs: string;
  nameFa: string;
  districtId: string;
  isActive: boolean;
}

export interface CauseOfDeath {
  id: string;
  code: string;
  nameEn: string;
  namePs: string;
  nameFa: string;
  category: string;
  isActive: boolean;
}

export interface Office {
  id: string;
  code: string;
  nameEn: string;
  namePs: string;
  nameFa: string;
  districtId: string;
  address: string;
  contact: string;
  isActive: boolean;
}
