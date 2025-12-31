# Civil Registry System (mk)

A government-grade, fast, accessible civil registration system for issuing Birth and Death certificates. Built with Angular 18+ using standalone components, signals, and modern best practices.

## Features

- **Multi-language Support**: English, Pashto (پښتو), and Dari (دری) with runtime language switching
- **RTL/LTR Support**: Full bidirectional text support with runtime direction toggle
- **Role-Based Access Control**: ADMIN, SUPERVISOR, OFFICER, and CLERK roles
- **Birth & Death Registration**: Complete workflows with multi-step forms
- **Certificate Management**: Issue, verify, and reprint certificates with QR codes
- **Search & Reports**: Citizen registry search and statistical reports
- **Print-Friendly**: A4 certificate templates with watermarks and official seals
- **Accessibility**: WCAG 2.2 AA compliant with keyboard navigation
- **Performance**: Route-level code splitting, lazy loading, instant navigation (no animations)

## Tech Stack

- **Angular 18+** with standalone components and signals
- **Tailwind CSS** for styling (no animations)
- **@ngx-translate/core** for i18n
- **Angular CDK** for data tables
- **Zod** for schema-based validation
- **RxJS** for reactive programming

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 18+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200/`

### Default Login Credentials

- **Admin**: `admin` / `password`
- **Supervisor**: `supervisor1` / `password`
- **Officer**: `officer1` / `password`

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core services, guards, interceptors
│   │   ├── guards/              # Auth and role guards
│   │   ├── interceptors/        # HTTP interceptors
│   │   ├── models/              # Data models and interfaces
│   │   └── services/            # Core services (auth, i18n, mock API)
│   ├── features/                # Feature modules (lazy-loaded)
│   │   ├── auth/                # Login
│   │   ├── dashboard/           # Dashboard with stats
│   │   ├── birth/               # Birth registration
│   │   ├── death/               # Death registration
│   │   ├── applications/        # Application management
│   │   ├── certificates/        # Certificate issue & verify
│   │   ├── search/              # Citizen search
│   │   ├── reports/             # Reports & analytics
│   │   ├── admin/               # Administration
│   │   ├── settings/            # User settings
│   │   └── help/                # Help & documentation
│   ├── layout/                  # Layout components
│   │   ├── app-shell/           # Main layout shell
│   │   ├── header/              # Top navigation
│   │   ├── sidebar/             # Side navigation
│   │   └── breadcrumbs/         # Breadcrumb navigation
│   ├── shared/                  # Shared components and utilities
│   │   ├── components/          # Reusable components
│   │   └── utils/               # Utility functions
│   ├── app.config.ts            # App configuration
│   └── app.routes.ts            # Route definitions
├── assets/
│   └── i18n/                    # Translation files (en, ps, fa)
├── environments/                # Environment configs
└── styles.scss                  # Global styles

```

## Available Scripts

```bash
# Development
npm start              # Start dev server (ng serve)
npm run build          # Production build
npm run watch          # Build with watch mode
npm test               # Run unit tests

# Linting
npm run lint           # Run ESLint
```

## Key Features & Usage

### Language Switching

Click the language buttons in the header to switch between English, Pashto, and Dari. The interface will update immediately, and the preference is persisted in localStorage.

### RTL Toggle

Use the RTL toggle button in the header to switch text direction. This is independent of language selection.

### Birth Registration

1. Navigate to **Civil Registry → Birth Registration**
2. Fill out the multi-step form:
   - Child Details (name, sex, date of birth, place)
   - Parents Details (father/mother names, NIDs, residence)
   - Informant Details (name, relation)
   - Review & Submit
3. Submit the application for approval

### Certificate Verification

1. Navigate to **Certificates → Verify Certificate**
2. Enter the certificate number (e.g., `BC-2024-12345`)
3. View verification status and certificate details
4. Print if needed

### Print Certificates

Certificates are designed for A4 printing with:
- Official header with ministry name and seal
- QR code for verification
- Watermark
- Page breaks for multi-page documents

Use the browser's print function (Ctrl+P / Cmd+P) or the Print button.

## Architecture Decisions

### Standalone Components

All components use Angular's standalone API for better tree-shaking and simpler dependency management.

### Signals

State management uses Angular signals for reactive, fine-grained updates without zone.js overhead.

### No Animations

Per government requirements, all animations and transitions are disabled for instant, predictable UI changes.

### Mock Services

The application uses mock services (`MockApiService`) for development. Replace with real HTTP calls in production by updating the service implementations.

### Route Guards

- `authGuard`: Protects all routes except login
- `roleGuard`: Restricts access based on user roles

### Interceptors

- `authInterceptor`: Adds authentication tokens to requests
- `errorInterceptor`: Handles HTTP errors globally

## Internationalization (i18n)

Translation files are located in `src/assets/i18n/`:
- `en.json` - English
- `ps.json` - Pashto (پښتو)
- `fa.json` - Dari (دری)

To add new translations, update these JSON files with the appropriate keys and values.

## Validation

Forms use a combination of:
- Angular's built-in validators (`Validators.required`, etc.)
- Custom validators (`nidValidator`, `phoneValidator`, `pastDateValidator`)
- Zod schemas (optional, via `zodValidator` utility)

## Testing

Unit tests are written using Jasmine and Karma. Run tests with:

```bash
npm test
```

Key test files:
- `auth.guard.spec.ts` - Auth guard tests
- `i18n.service.spec.ts` - i18n service tests
- Component tests for critical features

## Performance Targets

- **Lighthouse Performance**: ≥ 95
- **Lighthouse Accessibility**: ≥ 95
- **CSS Bundle**: < 50KB gzipped
- **Initial Route Bundle**: < 150KB gzipped
- **Navigation**: Instant (no animations)

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Security Considerations

### Current Implementation (Development)
- Mock authentication with localStorage
- Client-side role checks
- No real API endpoints

### Production Requirements
- Implement server-side authentication (JWT recommended)
- Add CSRF protection
- Validate all inputs server-side
- Use HTTPS only
- Implement rate limiting
- Add audit logging
- Encrypt sensitive data at rest
- Follow OWASP security guidelines

## Deployment

### Build for Production

```bash
npm run build
```

Build artifacts will be in the `dist/` directory.

### Environment Variables

Update `src/environments/environment.prod.ts` with production values:
- `apiUrl`: Backend API URL
- `appName`: Application name
- `buildVersion`: Version number

### Server Configuration

Ensure your web server:
- Serves `index.html` for all routes (for Angular routing)
- Enables gzip compression
- Sets appropriate cache headers
- Serves over HTTPS

## Extension Points

### Adding Real API Integration

1. Update `MockApiService` to use `HttpClient`
2. Replace mock delays with real HTTP calls
3. Update environment files with API URLs
4. Implement proper error handling

### Adding New Languages

1. Add translation JSON file in `src/assets/i18n/`
2. Update `I18nService.getAvailableLanguages()`
3. Add font support if needed (in `tailwind.config.js`)

### Adding New Features

1. Create feature component in `src/app/features/`
2. Add route in `app.routes.ts`
3. Add menu item in `sidebar.component.ts`
4. Add translations in i18n files

## License

Government of Afghanistan - Mokalama

## Support

For technical support, contact:
- Email: support@mokalama.com
- Phone: +93 (0) 20 123 4567
