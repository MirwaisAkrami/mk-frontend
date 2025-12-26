# Getting Started with Civil Registry System

## Installation & Running

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Angular 20.3.0
- Tailwind CSS
- @ngx-translate/core for i18n
- Angular CDK for data tables
- Zod for validation
- And all other dependencies

### 2. Start Development Server

```bash
npm start
```

The application will be available at: **http://localhost:4200/**

### 3. Login

Use one of these demo credentials:

| Role       | Username     | Password   |
|------------|--------------|------------|
| Admin      | `admin`      | `password` |
| Supervisor | `supervisor1`| `password` |
| Officer    | `officer1`   | `password` |

## Key Commands

```bash
# Development
npm start              # Start dev server
npm run build          # Production build
npm run watch          # Build with watch mode
npm test               # Run unit tests
npm run lint           # Run ESLint

# Build for production
npm run build
# Output will be in dist/ directory
```

## Project Features Implemented

### ✅ Core Infrastructure
- [x] Angular 18+ with standalone components
- [x] Signals for state management
- [x] Route-level code splitting
- [x] Auth guards and role-based access
- [x] HTTP interceptors
- [x] No animations (instant navigation)

### ✅ Layout & Navigation
- [x] App shell with header, sidebar, breadcrumbs
- [x] Collapsible sidebar with persistence
- [x] Role-based menu visibility
- [x] Language switcher (EN/PS/FA)
- [x] RTL/LTR toggle

### ✅ Feature Modules
- [x] **Login** - Mock authentication with role selection
- [x] **Dashboard** - Stats cards and application queue
- [x] **Birth Registration** - Multi-step form with validation
- [x] **Death Registration** - Multi-step form with validation
- [x] **Applications** - List, filter, approve/reject
- [x] **Certificates** - Issue and verify certificates
- [x] **Search** - Citizen registry search
- [x] **Reports** - Report generation interface
- [x] **Administration** - User management, reference data
- [x] **Settings** - Language, RTL, date format, print settings
- [x] **Help** - Documentation and support

### ✅ Shared Components
- [x] DataTable with sorting, pagination, actions
- [x] Stepper (no animations)
- [x] Status chips
- [x] Form controls
- [x] Print-friendly certificate templates

### ✅ Internationalization
- [x] English translations
- [x] Pashto (پښتو) translations
- [x] Dari (دری) translations
- [x] Runtime language switching
- [x] RTL support with layout mirroring

### ✅ Validation
- [x] NID validator (10 digits)
- [x] Phone validator (+93XXXXXXXXX)
- [x] Past date validator
- [x] Zod schema support

### ✅ Testing
- [x] Auth guard tests
- [x] I18n service tests
- [x] Validator tests
- [x] Test infrastructure setup

## File Structure Overview

```
src/app/
├── core/
│   ├── guards/              # authGuard, roleGuard
│   ├── interceptors/        # authInterceptor, errorInterceptor
│   ├── models/              # TypeScript interfaces
│   └── services/            # AuthService, I18nService, MockApiService
├── features/
│   ├── auth/                # LoginComponent
│   ├── dashboard/           # DashboardComponent
│   ├── birth/               # BirthNewComponent
│   ├── death/               # DeathNewComponent
│   ├── applications/        # ApplicationsListComponent
│   ├── certificates/        # CertificateVerify, CertificateIssue
│   ├── search/              # SearchComponent
│   ├── reports/             # ReportsComponent
│   ├── admin/               # AdminComponent
│   ├── settings/            # SettingsComponent
│   └── help/                # HelpComponent
├── layout/
│   ├── app-shell/           # Main layout container
│   ├── header/              # Top navigation
│   ├── sidebar/             # Side navigation
│   └── breadcrumbs/         # Breadcrumb trail
├── shared/
│   ├── components/          # DataTable, Stepper, StatusChip
│   └── utils/               # Validators, date utilities
└── assets/i18n/             # Translation files
```

## Quick Feature Tour

### 1. Switch Languages
- Click **English**, **پښتو**, or **دری** in the header
- Interface updates immediately
- Preference saved to localStorage

### 2. Toggle RTL
- Click the RTL toggle button in header
- Layout mirrors for right-to-left languages
- Independent of language selection

### 3. Register a Birth
1. Navigate to **Civil Registry → Birth Registration**
2. Fill multi-step form:
   - Child details
   - Parents details
   - Informant details
3. Review and submit

### 4. Verify a Certificate
1. Go to **Certificates → Verify Certificate**
2. Enter certificate number (e.g., `BC-2024-10000`)
3. View validation status

### 5. Manage Applications
1. Go to **Applications**
2. Filter by status, type, or search
3. Approve/reject applications
4. View details

## Styling & Theming

### Government Color Palette
- **Navy**: `#0B1F3B` - Primary brand color
- **Blue**: `#1E3A8A` - Interactive elements
- **Gray**: `#4B5563` - Secondary text
- **Gold**: `#C1A24A` - Accents
- **Background**: `#F8FAFC` - Page background

### Typography
- **Latin**: System UI stack
- **Arabic**: Noto Naskh Arabic

### No Animations
All transitions and animations are disabled via:
- Global CSS: `* { transition: none !important; }`
- Angular: `provideNoopAnimations()`

## Mock Data

The application uses `MockApiService` with:
- 25 mock applications (15 birth, 10 death)
- 10 mock certificates
- 3 mock users
- Reference data (provinces, districts, hospitals, causes of death)

All data includes realistic delays (300ms) to simulate network latency.

## Next Steps for Production

1. **Install Dependencies**: Run `npm install`
2. **Replace Mock Services**: Update `MockApiService` with real HTTP calls
3. **Configure Backend**: Set API URL in `environment.prod.ts`
4. **Implement Real Auth**: Replace localStorage auth with JWT/OAuth
5. **Add Server-Side Validation**: Validate all inputs on backend
6. **Enable HTTPS**: Configure SSL certificates
7. **Setup CI/CD**: Automate builds and deployments
8. **Add Monitoring**: Implement error tracking and analytics
9. **Security Audit**: Review and fix security vulnerabilities
10. **Load Testing**: Test performance under load

## Troubleshooting

### TypeScript Errors
The project has lint errors for missing dependencies (`@ngx-translate/core`, `@angular/cdk`). These will be resolved after running `npm install`.

### Port Already in Use
If port 4200 is busy, specify a different port:
```bash
ng serve --port 4300
```

### Build Errors
Clear cache and rebuild:
```bash
rm -rf node_modules .angular
npm install
npm start
```

## Support

For questions or issues:
- Review the main [README.md](./README.md)
- Check the Help section in the app
- Contact: support@civilregistry.gov.af

---

**Built with ❤️ for the Government of Afghanistan**
