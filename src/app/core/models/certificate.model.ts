export type CertificateType = 'BIRTH' | 'DEATH';
export type CertificateStatus = 'ACTIVE' | 'REVOKED' | 'REISSUED';

export interface Certificate {
  id: string;
  certificateNumber: string;
  type: CertificateType;
  applicationId: string;
  issuedDate: string;
  issuedBy: string;
  status: CertificateStatus;
  qrCode: string;
  printCount: number;
  lastPrintDate?: string;
}

export interface BirthCertificate extends Certificate {
  type: 'BIRTH';
  childName: string;
  childSex: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  placeOfBirth: string;
  fatherName: string;
  motherName: string;
  registrationNumber: string;
}

export interface DeathCertificate extends Certificate {
  type: 'DEATH';
  deceasedName: string;
  deceasedNID: string;
  dateOfBirth: string;
  dateOfDeath: string;
  placeOfDeath: string;
  causeOfDeath: string;
  registrationNumber: string;
}
