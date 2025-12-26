import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  Application,
  BirthApplication,
  DeathApplication,
  ApplicationStatus,
} from '../models/application.model';
import { Certificate, BirthCertificate, DeathCertificate } from '../models/certificate.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  private applications: Application[] = this.generateMockApplications();
  private certificates: Certificate[] = this.generateMockCertificates();
  private users: User[] = this.generateMockUsers();

  async getApplications(filters?: {
    status?: ApplicationStatus;
    type?: string;
    officeId?: string;
  }): Promise<Application[]> {
    await this.delay();

    let result = [...this.applications];

    if (filters?.status) {
      result = result.filter((app) => app.status === filters.status);
    }

    if (filters?.type) {
      result = result.filter((app) => app.type === filters.type);
    }

    if (filters?.officeId) {
      result = result.filter((app) => app.officeId === filters.officeId);
    }

    return result;
  }

  async getApplicationById(id: string): Promise<Application | null> {
    await this.delay();
    return this.applications.find((app) => app.id === id) || null;
  }

  async createApplication(application: Partial<Application>): Promise<Application> {
    await this.delay();

    const newApp: Application = {
      id: 'APP-' + Date.now(),
      type: application.type || 'BIRTH',
      status: 'DRAFT',
      applicantName: application.applicantName || '',
      applicantNID: application.applicantNID || '',
      submittedDate: new Date().toISOString(),
      officeId: application.officeId || 'OFF-001',
      officeName: application.officeName || 'Kabul Central Registry Office',
      ...application,
    } as Application;

    this.applications.unshift(newApp);
    return newApp;
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
    await this.delay();

    const index = this.applications.findIndex((app) => app.id === id);
    if (index === -1) {
      throw new Error('Application not found');
    }

    this.applications[index] = { ...this.applications[index], ...updates };
    return this.applications[index];
  }

  async approveApplication(id: string): Promise<Application> {
    return this.updateApplication(id, {
      status: 'APPROVED',
      approvedDate: new Date().toISOString(),
    });
  }

  async rejectApplication(id: string, notes: string): Promise<Application> {
    return this.updateApplication(id, {
      status: 'REJECTED',
      reviewedDate: new Date().toISOString(),
      notes,
    });
  }

  async getCertificates(): Promise<Certificate[]> {
    await this.delay();
    return [...this.certificates];
  }

  async getCertificateById(id: string): Promise<Certificate | null> {
    await this.delay();
    return this.certificates.find((cert) => cert.id === id) || null;
  }

  async verifyCertificate(certificateNumber: string): Promise<Certificate | null> {
    await this.delay();
    return this.certificates.find((cert) => cert.certificateNumber === certificateNumber) || null;
  }

  async issueCertificate(applicationId: string): Promise<Certificate> {
    await this.delay();

    const app = this.applications.find((a) => a.id === applicationId);
    if (!app || app.status !== 'APPROVED') {
      throw new Error('Application not approved');
    }

    const newCert: Certificate = {
      id: 'CERT-' + Date.now(),
      certificateNumber: this.generateCertificateNumber(app.type),
      type: app.type,
      applicationId: app.id,
      issuedDate: new Date().toISOString(),
      issuedBy: 'Ahmad Karimi',
      status: 'ACTIVE',
      qrCode: 'QR-' + Date.now(),
      printCount: 0,
    } as Certificate;

    this.certificates.unshift(newCert);
    return newCert;
  }

  async getUsers(): Promise<User[]> {
    await this.delay();
    return [...this.users];
  }

  async createUser(userData: Partial<User>): Promise<User> {
    await this.delay();

    const newUser: User = {
      id: 'USER-' + Date.now(),
      username: userData.username || '',
      fullName: userData.fullName || '',
      email: userData.email || '',
      role: userData.role || 'OFFICER',
      officeId: userData.officeId || '',
      officeName: userData.officeName || '',
      isActive: userData.isActive !== undefined ? userData.isActive : true,
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await this.delay();

    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  async deleteUser(id: string): Promise<void> {
    await this.delay();

    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    this.users.splice(index, 1);
  }

  async searchCitizens(query: string): Promise<any[]> {
    await this.delay();
    // Mock citizen search
    return [
      {
        nid: '1234567890',
        name: 'Ahmad Karimi',
        fatherName: 'Mohammad Karimi',
        dob: '1990-01-15',
        district: 'Kabul',
      },
    ];
  }

  async lookupByNID(nid: string): Promise<any | null> {
    await this.delay();
    
    // Mock NID database - simulate lookup for people registering birth certificates
    // This includes elderly people who are getting their birth certificate later in life
    const mockDatabase: Record<string, any> = {
      '1234567890': {
        nid: '1234567890',
        name: 'Ahmad Karimi',
        fatherName: 'Mohammad Karimi',
        motherName: 'Zainab Karimi',
        grandfatherName: 'Hassan Karimi',
        dob: '1990-01-15',
        district: 'Kabul',
        address: 'Kabul, District 1, Street 5',
        phone: '+93700123456',
      },
      '0987654321': {
        nid: '0987654321',
        name: 'Fatima Ahmadi',
        fatherName: 'Ali Ahmadi',
        motherName: 'Mariam Ahmadi',
        grandfatherName: 'Omar Ahmadi',
        dob: '1992-05-20',
        district: 'Herat',
        address: 'Herat, District 3, Street 12',
        phone: '+93700987654',
      },
      '1111111111': {
        nid: '1111111111',
        name: 'Khalid Nazari',
        fatherName: 'Mahmood Nazari',
        motherName: 'Rahima Nazari',
        grandfatherName: 'Abdul Nazari',
        dob: '1988-03-10',
        district: 'Kandahar',
        address: 'Kandahar, District 2, Street 8',
        phone: '+93700111222',
      },
      '5555555555': {
        nid: '5555555555',
        name: 'Hassan Rahimi',
        fatherName: 'Abdul Rahimi',
        motherName: 'Bibi Rahimi',
        grandfatherName: 'Ghulam Rahimi',
        dob: '1955-08-22',
        district: 'Mazar-i-Sharif',
        address: 'Mazar-i-Sharif, District 4, Street 15',
        phone: '+93700555666',
      },
    };

    return mockDatabase[nid] || null;
  }

  private generateCertificateNumber(type: string): string {
    const prefix = type === 'BIRTH' ? 'BC' : 'DC';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0');
    return `${prefix}-${year}-${random}`;
  }

  private generateMockApplications(): Application[] {
    const apps: Application[] = [];

    // Birth applications
    for (let i = 0; i < 15; i++) {
      const birthApp: BirthApplication = {
        id: `APP-BIRTH-${i + 1}`,
        type: 'BIRTH',
        status: this.getRandomStatus(),
        applicantName: `Parent ${i + 1}`,
        applicantNID: `NID${1000000 + i}`,
        submittedDate: this.getRandomDate(),
        officeId: 'OFF-001',
        officeName: 'Kabul Central Registry Office',
        childName: `Child ${i + 1}`,
        childSex: i % 2 === 0 ? 'MALE' : 'FEMALE',
        dateOfBirth: this.getRandomDate(),
        placeOfBirth: 'Kabul',
        hospital: i % 3 === 0 ? 'Kabul Hospital' : undefined,
        fatherName: `Father ${i + 1}`,
        fatherNID: `FNID${1000000 + i}`,
        motherName: `Mother ${i + 1}`,
        motherNID: `MNID${1000000 + i}`,
        parentResidence: 'Kabul, District 1',
        parentContact: '+93700000000',
        informantName: `Informant ${i + 1}`,
        informantRelation: 'Father',
        attachments: [],
      };
      apps.push(birthApp);
    }

    // Death applications
    for (let i = 0; i < 10; i++) {
      const deathApp: DeathApplication = {
        id: `APP-DEATH-${i + 1}`,
        type: 'DEATH',
        status: this.getRandomStatus(),
        applicantName: `Informant ${i + 1}`,
        applicantNID: `NID${2000000 + i}`,
        submittedDate: this.getRandomDate(),
        officeId: 'OFF-001',
        officeName: 'Kabul Central Registry Office',
        deceasedName: `Deceased ${i + 1}`,
        deceasedNID: `DNID${2000000 + i}`,
        dateOfBirth: '1950-01-01',
        dateOfDeath: this.getRandomDate(),
        placeOfDeath: 'Kabul',
        causeOfDeath: 'Natural Causes',
        certifyingFacility: 'Kabul Hospital',
        informantName: `Informant ${i + 1}`,
        informantNID: `INID${2000000 + i}`,
        informantRelation: 'Son',
        attachments: [],
      };
      apps.push(deathApp);
    }

    return apps;
  }

  private generateMockCertificates(): Certificate[] {
    const certs: Certificate[] = [];

    for (let i = 0; i < 10; i++) {
      const birthCert: BirthCertificate = {
        id: `CERT-BIRTH-${i + 1}`,
        certificateNumber: `BC-2024-${10000 + i}`,
        type: 'BIRTH',
        applicationId: `APP-BIRTH-${i + 1}`,
        issuedDate: this.getRandomDate(),
        issuedBy: 'Ahmad Karimi',
        status: 'ACTIVE',
        qrCode: `QR-BIRTH-${i + 1}`,
        printCount: Math.floor(Math.random() * 3),
        childName: `Child ${i + 1}`,
        childSex: i % 2 === 0 ? 'MALE' : 'FEMALE',
        dateOfBirth: this.getRandomDate(),
        placeOfBirth: 'Kabul',
        fatherName: `Father ${i + 1}`,
        motherName: `Mother ${i + 1}`,
        registrationNumber: `REG-BIRTH-${10000 + i}`,
      };
      certs.push(birthCert);
    }

    return certs;
  }

  private generateMockUsers(): User[] {
    return [
      {
        id: '1',
        username: 'admin',
        fullName: 'System Administrator',
        email: 'admin@gov.af',
        role: 'ADMIN',
        officeId: 'OFF-001',
        officeName: 'Kabul Central Registry Office',
        isActive: true,
      },
      {
        id: '2',
        username: 'supervisor1',
        fullName: 'Ahmad Supervisor',
        email: 'supervisor@gov.af',
        role: 'SUPERVISOR',
        officeId: 'OFF-001',
        officeName: 'Kabul Central Registry Office',
        isActive: true,
      },
      {
        id: '3',
        username: 'officer1',
        fullName: 'Karimi Officer',
        email: 'officer@gov.af',
        role: 'OFFICER',
        officeId: 'OFF-001',
        officeName: 'Kabul Central Registry Office',
        isActive: true,
      },
      {
        id: '4',
        username: 'clerk1',
        fullName: 'Fatima Clerk',
        email: 'clerk@gov.af',
        role: 'CLERK',
        officeId: 'OFF-002',
        officeName: 'Herat Registry Office',
        isActive: true,
      },
      {
        id: '5',
        username: 'officer2',
        fullName: 'Hassan Ahmadi',
        email: 'hassan@gov.af',
        role: 'OFFICER',
        officeId: 'OFF-003',
        officeName: 'Kandahar Registry Office',
        isActive: false,
      },
      {
        id: '6',
        username: 'supervisor2',
        fullName: 'Khalid Nazari',
        email: 'khalid@gov.af',
        role: 'SUPERVISOR',
        officeId: 'OFF-004',
        officeName: 'Mazar-i-Sharif Registry Office',
        isActive: true,
      },
    ];
  }

  private getRandomStatus(): ApplicationStatus {
    const statuses: ApplicationStatus[] = [
      'DRAFT',
      'SUBMITTED',
      'IN_REVIEW',
      'APPROVED',
      'REJECTED',
      'RETURNED',
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private getRandomDate(): string {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, environment.mockDelay));
  }
}
