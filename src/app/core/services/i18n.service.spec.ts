import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [I18nService],
    });

    service = TestBed.inject(I18nService);
    translateService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set default language to English', () => {
    expect(service.language()).toBe('en');
  });

  it('should change language', () => {
    service.setLanguage('ps');
    expect(service.language()).toBe('ps');
  });

  it('should set RTL direction for Pashto', () => {
    service.setLanguage('ps');
    expect(service.direction()).toBe('rtl');
  });

  it('should set LTR direction for English', () => {
    service.setLanguage('en');
    expect(service.direction()).toBe('ltr');
  });

  it('should toggle RTL', () => {
    const initialDir = service.direction();
    service.toggleRTL();
    expect(service.direction()).not.toBe(initialDir);
  });

  it('should return available languages', () => {
    const languages = service.getAvailableLanguages();
    expect(languages.length).toBe(3);
    expect(languages.map((l) => l.code)).toEqual(['en', 'ps', 'fa']);
  });

  it('should persist language to localStorage', () => {
    spyOn(localStorage, 'setItem');
    service.setLanguage('fa');
    expect(localStorage.setItem).toHaveBeenCalledWith('app_language', 'fa');
  });
});
