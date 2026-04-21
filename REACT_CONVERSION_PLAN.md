# React Conversion Plan - Inventory Management System

## Overview
Convert the existing HTML-based inventory management system into a modern React application with full API integration using the AlMuthannaPrecast API v1.

---

## Phase 1: Project Setup & Architecture

### 1.1 Create React Project Structure
```
src/
├── api/                          # API integration layer
│   ├── client.js                 # Axios/Fetch configuration
│   └── endpoints.js              # API endpoint definitions
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── AppShell.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── VoucherForm.jsx
│   │   ├── SearchVoucher.jsx
│   │   ├── AllVouchers.jsx
│   │   ├── ItemsManagement.jsx
│   │   └── ProjectsManagement.jsx
│   ├── forms/
│   │   ├── VoucherForm.jsx       # Main form
│   │   ├── ItemForm.jsx          # New: Inline unit/manufacturer forms
│   │   ├── UnitForm.jsx          # NEW: Create/manage units
│   │   ├── ManufactureForm.jsx   # NEW: Create/manage manufactures
│   │   └── ProjectForm.jsx
│   ├── modals/
│   │   ├── UnitModal.jsx         # Modal to add units
│   │   ├── ManufactureModal.jsx  # Modal to add manufactures
│   │   └── ConfirmDialog.jsx
│   └── shared/
│       ├── Button.jsx
│       ├── FormGroup.jsx
│       ├── Card.jsx
│       ├── Table.jsx
│       └── Notification.jsx
├── hooks/
│   ├── useAPI.js                 # Custom hook for API calls
│   ├── useLanguage.js            # Language management
│   ├── useNotification.js        # Toast notifications
│   └── useForm.js                # Form state management
├── styles/
│   ├── variables.css             # Design tokens from original
│   ├── layout.css
│   ├── forms.css
│   ├── components.css
│   └── responsive.css
├── context/
│   ├── LanguageContext.js        # Global language state
│   ├── NotificationContext.js    # Global notifications
│   └── DataContext.js            # Shared data state (items, projects, etc)
├── utils/
│   ├── i18n.js                   # Translation utilities
│   ├── formatters.js             # Date, number formatting
│   └── validators.js             # Form validation
├── types/                        # TypeScript interfaces (if using TS)
│   └── index.d.ts
├── App.jsx
└── index.js
```

### 1.2 Dependencies to Install
```
react-router-dom          # Navigation
axios                     # HTTP client
react-icons             # Icons (replace SVG)
date-fns                # Date utilities
react-hook-form         # Form management
zod or yup              # Validation
zustand or Redux        # State management (optional)
i18next                 # Localization
```

---

## Phase 2: API Integration

### 2.1 Create API Client Layer
- **File:** `src/api/client.js`
- Configure base URL from environment variables
- Setup interceptors for authentication (if needed)
- Error handling middleware

### 2.2 Define API Endpoints
- **File:** `src/api/endpoints.js`
- Map all v1.json endpoints:
  - Items (GET all, POST, PUT, DELETE)
  - Manufactures (GET all, POST, PUT, DELETE) **← KEY ENDPOINT**
  - Projects (GET all, POST, PUT, DELETE)
  - Units (GET all, POST, PUT, DELETE) **← KEY ENDPOINT**
  - Vouchers (GET all, POST, PUT, DELETE, export to Excel)

### 2.3 Create Custom Hook for API
- **File:** `src/hooks/useAPI.js`
- Encapsulate all API calls
- Handle loading, error, and success states
- Automatic data caching and refresh

---

## Phase 3: Component Development

### 3.1 Layout Components
**3.1.1 Sidebar.jsx**
- Navigation items with active state
- Language toggle button
- Logo and branding

**3.1.2 Topbar.jsx**
- Page title and subtitle
- Action buttons
- Search bar (if applicable)

**3.1.3 AppShell.jsx**
- Main layout wrapper
- Routes configuration
- Context providers

### 3.2 Page Components
**3.2.1 Dashboard.jsx**
- Stat cards (items, vouchers, projects, alerts)
- Recent vouchers list
- Low stock alerts
- Call API endpoints to populate data

**3.2.2 VoucherForm.jsx** (MAIN FOCUS FOR ENHANCEMENT)
- Voucher type selector (Import/Export)
- Item selection dropdown (synced with API)
- **NEW: Quick Add Unit Button** → Opens UnitModal
- **NEW: Quick Add Manufacture Button** → Opens ManufactureModal
- Project dropdown
- Date picker
- Quantity, Price inputs
- Save to API

**3.2.3 SearchVoucher.jsx**
- Search input
- Display results
- Details view with edit/delete options

**3.2.4 AllVouchers.jsx**
- Table with all vouchers
- Filters: Type, Project, Search text
- Pagination (if needed)
- Edit/Delete actions
- Export to Excel button

**3.2.5 ItemsManagement.jsx**
- Form to add items
- List of items
- Edit/Delete functionality

**3.2.6 ProjectsManagement.jsx**
- Form to add projects
- List of projects
- Edit/Delete functionality

### 3.3 Form Components (NEW/ENHANCED)

**3.3.1 UnitForm.jsx**
- Standalone form for creating units
- Name input
- Save to API via `POST /api/units`
- Validation

**3.3.2 UnitModal.jsx** (CRITICAL FOR VOUCHER FORM)
- Modal wrapper for UnitForm
- Used within VoucherForm
- On save: Close modal + Refresh units dropdown + Select newly created unit
- Error handling

**3.3.3 ManufactureForm.jsx**
- Standalone form for creating manufactures
- Name input
- Save to API via `POST /api/manufactures`
- Validation

**3.3.4 ManufactureModal.jsx** (CRITICAL FOR VOUCHER FORM)
- Modal wrapper for ManufactureForm
- Used within VoucherForm
- On save: Close modal + Refresh manufactures dropdown + Select newly created item
- Error handling

---

## Phase 4: Data Fetching & State Management

### 4.1 Fetch Data from API
- On component mount, fetch:
  - `/api/items` → populate item dropdowns
  - `/api/manufactures` → populate manufacture dropdowns (if field exists in voucher)
  - `/api/units` → populate unit dropdowns
  - `/api/projects` → populate project dropdowns
  - `/api/vouchers` → display in tables/lists

### 4.2 State Management Strategy
- **Local State:** Form values using `useState` or `react-hook-form`
- **Shared State:** Items, Projects, Units, Manufactures in Context or Zustand
- **Global State:** Language, Notifications, User preferences

### 4.3 Caching & Refresh
- Cache API responses to avoid excessive requests
- Implement refresh on create/update/delete
- Optimistic UI updates where applicable

---

## Phase 5: Forms Enhancement - Units & Manufactures in Voucher Form

### 5.1 VoucherForm Layout Updates

**Before (Current HTML):**
```
[Item Code Dropdown]          [Item Name Dropdown]
[Unit Dropdown]  [Qty]  [Price]
[Project Dropdown]            [Location Dropdown]
[Used In Dropdown]
[Notes Textarea]
[Save Button]
```

**After (Enhanced React):**
```
[Item Code Dropdown] [+ NEW ITEM]  [Item Name Dropdown]
[Unit Dropdown] [+ ADD UNIT] [Qty] [Price]
[Manufacture Dropdown] [+ ADD MANUFACTURE]
[Project Dropdown]  [Location Dropdown]
[Used In Dropdown]
[Notes Textarea]
[Save Button]  [Clear Button]
```

### 5.2 Implementation Steps

**Step 1: Add buttons next to dropdowns**
```jsx
<div className="form-group">
  <div className="form-group-header">
    <label>الوحدة</label>
    <button onClick={openUnitModal} className="btn btn-small">+ إضافة</button>
  </div>
  <select value={unit} onChange={(e) => setUnit(e.target.value)}>
    {units.map(u => <option key={u.id}>{u.name}</option>)}
  </select>
</div>
```

**Step 2: Create UnitModal component**
- Opens when "+ Add Unit" button clicked
- Contains UnitForm inside
- On success: 
  - Closes modal
  - Fetches updated units list
  - Sets newly created unit as selected value
  - Shows success notification

**Step 3: Create ManufactureModal component**
- Same pattern as UnitModal
- Integrated into VoucherForm
- On success: Refreshes manufactures list

**Step 4: Form Validation**
- Validate all required fields before submission
- Show error messages inline
- Prevent submission if validation fails

**Step 5: API Integration**
- POST `/api/vouchers` with all form data
- Include: voucherNumber, itemId, quantity, price, unitId, manufacturerId, projectId, createdAt
- Handle errors and show user-friendly messages

---

## Phase 6: Internationalization (i18n)

### 6.1 Translation Structure
- Create translation objects for AR and EN
- Use context to manage current language
- All UI strings from translation object
- Support for:
  - Labels and placeholders
  - Error messages
  - Success notifications
  - Empty states

### 6.2 Direction (RTL/LTR)
- Add `dir` attribute based on language
- CSS adjustments for RTL layout
- Text alignment adjustments

---

## Phase 7: Styling & UI

### 7.1 Design System
- Extract CSS variables from original design
- Create reusable component styles
- Maintain original design tokens (colors, spacing, typography)

### 7.2 Responsive Design
- Mobile-first approach
- Tablet and desktop layouts
- Adjust grid layouts for smaller screens
- Touch-friendly form controls

### 7.3 Theme Colors
```css
--primary: #1D9E75
--primary-light: #E1F5EE
--primary-dark: #085041
--accent: #378ADD
--danger: #E24B4A
--warning: #BA7517
--bg: #f8faf9
--surface: #ffffff
```

---

## Phase 8: Error Handling & Validation

### 8.1 Form Validation
- Required field checks
- Data type validation (numbers, dates, etc)
- Min/Max length checks
- Email/phone validation (if applicable)

### 8.2 API Error Handling
- Network error messages
- API error codes mapping
- User-friendly error messages
- Retry mechanism

### 8.3 Notification System
- Toast notifications for:
  - Success (Create, Update, Delete)
  - Error (API failures, validation)
  - Warning (Low stock alerts)
  - Info (Loading states)

---

## Phase 9: Testing

### 9.1 Unit Tests
- Component rendering
- State updates
- Form submissions
- API calls (mocked)

### 9.2 Integration Tests
- Full form submission flow
- Modal open/close with data update
- Navigation between pages

### 9.3 E2E Tests
- Critical user journeys:
  - Create voucher with new unit
  - Create voucher with new manufacture
  - Search and filter vouchers

---

## Phase 10: Deployment

### 10.1 Build Optimization
- Code splitting
- Lazy loading for pages
- Image optimization
- Tree shaking

### 10.2 Environment Configuration
- API base URL from env variables
- Feature flags
- Debug mode

### 10.3 Production Checklist
- Remove console logs
- Error boundary implementation
- Performance monitoring
- SEO optimization (if applicable)

---

## Key Implementation Details

### Voucher Form API Mapping
```javascript
// Form data to API payload
const voucherPayload = {
  createdAt: new Date().toISOString(),
  voucherNumber: formData.voucherNumber,
  itemId: parseInt(formData.itemId),
  quantity: parseInt(formData.quantity),
  price: parseFloat(formData.price),
  manufacturerId: parseInt(formData.manufacturerId),
  unitId: parseInt(formData.unitId),
  projectId: parseInt(formData.projectId)
};

// POST /api/vouchers
const response = await axios.post('/api/vouchers', voucherPayload);
```

### Unit & Manufacture Addition Flow
```
User in VoucherForm
  ↓
Clicks "+ ADD UNIT" button
  ↓
UnitModal Opens
  ↓
User fills UnitForm (name only)
  ↓
Clicks Save in Modal
  ↓
POST /api/units (with name)
  ↓
Success Response (returns unit with id)
  ↓
Modal Closes
  ↓
Units dropdown refreshes from API
  ↓
Newly created unit selected automatically
  ↓
User continues with voucher form
```

---

## File Checklist

- [x] Phase 1: Project structure created
- [x] Phase 2: API client and endpoints configured
- [x] Phase 3: Layout components built
- [x] Phase 4: Page components implemented
- [x] Phase 5: Enhanced VoucherForm with modals
- [x] Phase 6: i18n setup and translations
- [x] Phase 7: Styling applied
- [x] Phase 8: Validation and error handling
- [ ] Phase 9: Tests written
- [ ] Phase 10: Deploy to production

### Current Implementation Notes
- React + Vite scaffold is now in place with the folder structure described above.
- API integration is wired to the AlMuthannaPrecast v1 schema using `VITE_API_BASE_URL` with a fallback to `https://localhost:7071`.
- The voucher form supports inline unit and manufacture creation through React modals and auto-selects the newly created record.
- AR/EN UI strings and RTL/LTR direction switching are implemented.
- Lint and production build pass successfully.
- The OpenAPI schema provided in `v1.json` does not expose voucher type in the voucher response model, so the Import/Export selector is currently treated as a UI-only field inside the form.

---

## Timeline Estimate
- **Phase 1-2:** 1-2 days (Setup)
- **Phase 3-4:** 3-4 days (Components & API)
- **Phase 5:** 2-3 days (Unit/Manufacture Enhancement)
- **Phase 6-7:** 2 days (i18n & Styling)
- **Phase 8-9:** 2 days (Testing)
- **Phase 10:** 1 day (Deployment)

**Total:** 2-3 weeks

---

## Dependencies Summary

### Core
- react, react-dom
- react-router-dom

### HTTP & Data
- axios

### Forms & Validation
- react-hook-form
- zod or yup

### UI/Icons
- react-icons

### Utilities
- date-fns
- i18next
- i18next-react

### State Management (Optional)
- zustand or Context API (already planned)

### Development
- vite (or create-react-app)
- eslint
- prettier
- vitest or jest (testing)

---

## Success Criteria
✅ All CRUD operations functional via API
✅ Unit and Manufacture can be created inline during voucher form
✅ RTL/LTR support working
✅ All original features preserved
✅ Responsive design working
✅ No console errors
✅ Performance optimized
