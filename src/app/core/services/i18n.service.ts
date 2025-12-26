import { Injectable, signal, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

export type Language = 'en' | 'ps' | 'fa';
export type Direction = 'ltr' | 'rtl';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private currentLanguage = signal<Language>('en');
  private currentDirection = signal<Direction>('ltr');

  language = this.currentLanguage.asReadonly();
  direction = this.currentDirection.asReadonly();

  constructor(
    private translate: TranslateService,
    private http: HttpClient
  ) {
    this.translate.setDefaultLang('en');
    this.loadFromStorage();

    effect(() => {
      const lang = this.currentLanguage();
      const dir = this.currentDirection();
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', dir);
    });
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    this.translate.use(lang);

    // Automatically set direction based on language
    const dir: Direction = lang === 'en' ? 'ltr' : 'rtl';
    this.currentDirection.set(dir);

    this.saveToStorage();
    this.saveToBackend(lang, dir);
  }

  setDirection(dir: Direction): void {
    this.currentDirection.set(dir);
    this.saveToStorage();
    this.saveToBackend(this.currentLanguage(), dir);
  }

  toggleRTL(): void {
    const newDir: Direction = this.currentDirection() === 'ltr' ? 'rtl' : 'ltr';
    this.setDirection(newDir);
  }

  isRTL(): boolean {
    return this.currentDirection() === 'rtl';
  }

  getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
      { code: 'fa', name: 'Dari', nativeName: 'دری' },
    ];
  }

  private saveToStorage(): void {
    localStorage.setItem('app_language', this.currentLanguage());
    localStorage.setItem('app_direction', this.currentDirection());
  }

  private saveToBackend(language: Language, direction: Direction): void {
    // TODO: Replace with actual API endpoint
    // This will save user preferences to the backend
    this.http.post('/api/user/preferences', {
      language,
      direction,
    }).pipe(
      catchError(error => {
        console.error('Failed to save language preferences to backend:', error);
        return of(null);
      })
    ).subscribe();
  }

  private loadFromStorage(): void {
    const savedLang = localStorage.getItem('app_language') as Language;
    const savedDir = localStorage.getItem('app_direction') as Direction;

    if (savedLang && ['en', 'ps', 'fa'].includes(savedLang)) {
      this.currentLanguage.set(savedLang);
      this.translate.use(savedLang);
    }

    if (savedDir && ['ltr', 'rtl'].includes(savedDir)) {
      this.currentDirection.set(savedDir);
    }
  }

  // Load preferences from backend (call this after user login)
  loadFromBackend(): void {
    // TODO: Replace with actual API endpoint
    this.http.get<{ language: Language; direction: Direction }>('/api/user/preferences')
      .pipe(
        catchError(error => {
          console.error('Failed to load language preferences from backend:', error);
          return of(null);
        })
      )
      .subscribe(preferences => {
        if (preferences) {
          this.setLanguage(preferences.language);
          if (preferences.direction) {
            this.setDirection(preferences.direction);
          }
        }
      });
  }
}
