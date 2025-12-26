import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertConfig {
  message: string;
  type: AlertType;
  duration?: number; // Duration in milliseconds, 0 or undefined means no auto-dismiss
  dismissible?: boolean; // Whether the alert can be manually dismissed
  title?: string; // Optional title for the alert
}

export interface Alert extends AlertConfig {
  id: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$: Observable<Alert[]> = this.alertsSubject.asObservable();

  private idCounter = 0;

  /**
   * Show an alert with the specified configuration
   */
  show(config: AlertConfig): string {
    const alert: Alert = {
      ...config,
      id: `alert-${++this.idCounter}-${Date.now()}`,
      timestamp: Date.now(),
      dismissible: config.dismissible !== undefined ? config.dismissible : true,
      duration: config.duration !== undefined ? config.duration : 5000,
    };

    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([...currentAlerts, alert]);

    // Auto-dismiss if duration is set
    if (alert.duration && alert.duration > 0) {
      setTimeout(() => {
        this.dismiss(alert.id);
      }, alert.duration);
    }

    return alert.id;
  }

  /**
   * Show a success alert
   */
  success(message: string, title?: string, duration?: number): string {
    return this.show({
      message,
      type: 'success',
      title,
      duration,
    });
  }

  /**
   * Show an error alert
   */
  error(message: string, title?: string, duration?: number): string {
    return this.show({
      message,
      type: 'error',
      title,
      duration: duration !== undefined ? duration : 0, // Errors don't auto-dismiss by default
    });
  }

  /**
   * Show a warning alert
   */
  warning(message: string, title?: string, duration?: number): string {
    return this.show({
      message,
      type: 'warning',
      title,
      duration,
    });
  }

  /**
   * Show an info alert
   */
  info(message: string, title?: string, duration?: number): string {
    return this.show({
      message,
      type: 'info',
      title,
      duration,
    });
  }

  /**
   * Dismiss a specific alert by ID
   */
  dismiss(id: string): void {
    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next(currentAlerts.filter(alert => alert.id !== id));
  }

  /**
   * Dismiss all alerts
   */
  dismissAll(): void {
    this.alertsSubject.next([]);
  }
}
