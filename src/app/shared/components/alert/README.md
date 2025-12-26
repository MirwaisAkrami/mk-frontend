# Alert Component

A flexible and reusable alert/notification system for displaying messages to users throughout the application.

## Features

- **Multiple alert types**: Success, Error, Warning, and Info
- **Auto-dismiss**: Configurable auto-dismiss duration
- **Manual dismiss**: Optional close button
- **Animations**: Smooth slide-in and slide-out animations
- **Service-based**: Show alerts from anywhere in the app via the `AlertService`
- **Customizable**: Support for titles and custom durations
- **Accessible**: Proper ARIA attributes for screen readers

## Usage

### Basic Usage

Inject the `AlertService` into your component and call the appropriate method:

```typescript
import { Component } from '@angular/core';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-example',
  // ...
})
export class ExampleComponent {
  constructor(private alertService: AlertService) {}

  showSuccess() {
    this.alertService.success('Operation completed successfully!');
  }

  showError() {
    this.alertService.error('An error occurred!');
  }

  showWarning() {
    this.alertService.warning('Please review your input.');
  }

  showInfo() {
    this.alertService.info('New features are available!');
  }
}
```

### With Title

```typescript
this.alertService.success(
  'Your profile has been updated successfully.',
  'Profile Updated'
);
```

### Custom Duration

```typescript
// Auto-dismiss after 10 seconds
this.alertService.info('This message will disappear in 10 seconds.', undefined, 10000);

// Never auto-dismiss (duration = 0)
this.alertService.error('Critical error - please contact support.', 'Error', 0);
```

### Advanced Configuration

For more control, use the `show()` method with a full configuration object:

```typescript
this.alertService.show({
  message: 'Your changes have been saved.',
  type: 'success',
  title: 'Success',
  duration: 5000,
  dismissible: true
});
```

### Dismissing Alerts

```typescript
// Dismiss a specific alert (returns alert ID)
const alertId = this.alertService.success('Message');
this.alertService.dismiss(alertId);

// Dismiss all alerts
this.alertService.dismissAll();
```

## API Reference

### AlertService Methods

#### `success(message: string, title?: string, duration?: number): string`
Shows a success alert (green).

#### `error(message: string, title?: string, duration?: number): string`
Shows an error alert (red). Defaults to no auto-dismiss.

#### `warning(message: string, title?: string, duration?: number): string`
Shows a warning alert (yellow).

#### `info(message: string, title?: string, duration?: number): string`
Shows an info alert (blue).

#### `show(config: AlertConfig): string`
Shows an alert with custom configuration.

#### `dismiss(id: string): void`
Dismisses a specific alert by ID.

#### `dismissAll(): void`
Dismisses all active alerts.

### AlertConfig Interface

```typescript
interface AlertConfig {
  message: string;           // The alert message
  type: AlertType;           // 'success' | 'error' | 'warning' | 'info'
  duration?: number;         // Auto-dismiss duration in ms (0 = no auto-dismiss)
  dismissible?: boolean;     // Show close button (default: true)
  title?: string;            // Optional title
}
```

## Styling

The alert component uses Tailwind CSS classes and follows the application's design system:

- **Success**: Green color scheme (`bg-green-50`, `border-green-500`)
- **Error**: Red color scheme (`bg-red-50`, `border-red-500`)
- **Warning**: Yellow color scheme (`bg-yellow-50`, `border-yellow-500`)
- **Info**: Blue color scheme (`bg-blue-50`, `border-blue-500`)

## Position

Alerts appear in the **top-right corner** of the screen with a fixed position and high z-index (50) to ensure they appear above other content.

## Examples

### Form Submission

```typescript
submitForm() {
  this.userService.updateUser(this.userData).subscribe({
    next: () => {
      this.alertService.success('User updated successfully!', 'Success');
    },
    error: (err) => {
      this.alertService.error(
        err.message || 'Failed to update user.',
        'Error',
        0 // Don't auto-dismiss errors
      );
    }
  });
}
```

### Multiple Alerts

```typescript
processItems() {
  this.alertService.info('Processing items...', 'Please Wait');
  
  this.service.process().subscribe({
    next: (result) => {
      this.alertService.success(`Processed ${result.count} items.`, 'Complete');
    },
    error: () => {
      this.alertService.error('Processing failed.', 'Error');
    }
  });
}
```

### Temporary Notification

```typescript
copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  this.alertService.success('Copied to clipboard!', undefined, 2000);
}
```
