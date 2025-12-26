export type ApplicationType = 'BIRTH' | 'DEATH';
export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'RETURNED';

export interface Application {
  id: string;
  type: ApplicationType;
  status: ApplicationStatus;
  applicantName: string;
  applicantNID: string;
  submittedDate: string;
  reviewedDate?: string;
  approvedDate?: string;
  assignedOfficer?: string;
  officeId: string;
  officeName: string;
  notes?: string;
}

export interface BirthApplication extends Application {
  type: 'BIRTH';
  childName: string;
  childSex: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  placeOfBirth: string;
  hospital?: string;
  fatherName: string;
  fatherNID: string;
  motherName: string;
  motherNID: string;
  parentResidence: string;
  parentContact: string;
  informantName: string;
  informantRelation: string;
  attachments: string[];
}

export interface DeathApplication extends Application {
  type: 'DEATH';
  deceasedName: string;
  deceasedNID: string;
  dateOfBirth: string;
  dateOfDeath: string;
  placeOfDeath: string;
  causeOfDeath: string;
  certifyingFacility?: string;
  informantName: string;
  informantNID: string;
  informantRelation: string;
  policeReport?: string;
  attachments: string[];
}
