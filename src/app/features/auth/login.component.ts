import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async login(): Promise<void> {
    if (!this.username || !this.password) {
      this.error.set('Please enter username and password');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const success = await this.authService.login(this.username, this.password);

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Invalid username or password. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err?.error?.message || err?.message || 'An error occurred during login. Please try again.';
      this.error.set(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }
}
