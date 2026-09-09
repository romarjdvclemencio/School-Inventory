# 🏫 School Inventory Management System

A complete, production-quality web-based inventory management system for schools. Built with vanilla HTML, CSS, and JavaScript, backed by Firebase (Authentication, Firestore, Storage, Hosting).

---

## Features

- **Authentication** — Firebase Auth with role-based access control
- **Dashboard** — Summary stats, charts, quick actions, recent activity
- **Inventory** — Full CRUD, search, filters, pagination, image upload
- **Categories** — Manage and organize inventory categories
- **Locations** — Track rooms and storage locations
- **Borrowing** — Complete borrow/return system with overdue tracking
- **Maintenance** — Damage reports, repair tracking, missing item tracking
- **Reports** — 9 report types with CSV export and print
- **Activity Logs** — Immutable audit trail
- **User Management** — Role management, user status control
- **Settings** — School info, system preferences, demo data seeding
- **Responsive** — Full mobile, tablet, and desktop support

---

## Roles & Permissions

| Feature               | Admin | Officer | Teacher | Viewer |
|----------------------|-------|---------|---------|--------|
| View Inventory       | ✅    | ✅      | ✅      | ✅     |
| Add/Edit Inventory   | ✅    | ✅      | ❌      | ❌     |
| Delete Inventory     | ✅    | ❌      | ❌      | ❌     |
| Manage Borrowing     | ✅    | ✅      | Request | ❌     |
| Manage Maintenance   | ✅    | ✅      | Report  | ❌     |
| View Reports         | ✅    | ✅      | ✅      | ✅     |
| Manage Users         | ✅    | ❌      | ❌      | ❌     |
| Change Settings      | ✅    | ❌      | ❌      | ❌     |
| View Activity Logs   | ✅    | ✅      | ❌      | ❌     |

---

## Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **Charts**: Chart.js 4.x (CDN)
- **Fonts**: Inter (Google Fonts)
- **Icons**: Inline SVG (Feather-style)
- **No build tools required** — runs directly in the browser

---

## Project Structure

```
school-inventory/
│
├── index.html              Login page
├── dashboard.html          Main dashboard
├── inventory.html          Inventory list + CRUD
├── categories.html         Category management
├── locations.html          Location/room management
├── borrowing.html          Borrowing + returns
├── maintenance.html        Damage + repair reports
├── reports.html            Report generation
├── users.html              User management
├── logs.html               Activity audit logs
├── settings.html           System settings
│
├── css/
│   ├── style.css           Design system + components
│   └── responsive.css      Mobile/tablet breakpoints
│
├── js/
│   ├── firebase-config.js  Firebase configuration
│   ├── auth.js             Authentication + RBAC
│   ├── layout.js           Shared sidebar/header
│   └── utils.js            Shared utilities
│
├── assets/
│   ├── images/
│   └── icons/
│
├── firestore.rules         Firestore security rules
├── firestore.indexes.json  Firestore composite indexes
├── storage.rules           Storage security rules
├── firebase.json           Firebase hosting config
└── README.md               This file
```

---

## Installation & Setup

### Prerequisites

- A Google account
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deployment)
- A modern web browser (Chrome, Firefox, Edge, Safari)

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → Enter your project name → Create
3. Enable **Google Analytics** if desired

### Step 2: Set Up Firebase Authentication

1. In Firebase Console → **Authentication** → **Get started**
2. Under **Sign-in method**, enable **Email/Password**
3. Click **Save**

### Step 3: Set Up Firestore Database

1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **Start in production mode**
3. Select your preferred region → **Enable**
4. Go to **Rules** tab → Paste the contents of `firestore.rules` → **Publish**
5. Go to **Indexes** tab → You can manually create indexes or deploy via CLI

### Step 4: Set Up Firebase Storage

1. In Firebase Console → **Storage** → **Get started**
2. Choose **Start in production mode** → **Done**
3. Go to **Rules** tab → Paste the contents of `storage.rules` → **Publish**

### Step 5: Register Your Web App

1. In Firebase Console → Project Overview → **Add app** → Web (</> icon)
2. Enter a nickname → **Register app**
3. Copy the `firebaseConfig` object

### Step 6: Configure the Application

Open `js/firebase-config.js` and replace the placeholder values:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## Creating Demo Accounts

After configuring Firebase, create accounts manually in Firebase Authentication:

1. Go to **Authentication** → **Users** → **Add user**
2. Create these accounts:

| Email                     | Password    | Role            |
|--------------------------|-------------|-----------------|
| admin@school.edu.ph      | Admin@123   | Administrator   |
| officer@school.edu.ph    | Officer@123 | Inventory Officer|
| teacher@school.edu.ph    | Teacher@123 | Teacher / Staff |
| viewer@school.edu.ph     | Viewer@123  | Viewer          |

3. After the accounts exist in Firebase Auth, sign in with each one — a basic user profile will be auto-created in Firestore with the `viewer` role.
4. Sign in as Admin → Go to **Users** → Set the appropriate role for each account.

**Alternatively**, use the Login page demo buttons to sign in, then update roles via the Users page.

---

## Seeding Demo Data

1. Sign in as Administrator
2. Go to **Settings**
3. Click **Seed Demo Data** — this adds 15 realistic sample inventory items

---

## Local Development

Since the app uses ES Modules and Firebase CDN, you need to serve it over HTTP (not file://).

**Option A: VS Code Live Server**
1. Install the "Live Server" extension
2. Right-click `index.html` → Open with Live Server

**Option B: Python HTTP Server**
```bash
# Python 3
python -m http.server 8080

# Then open: http://localhost:8080
```

**Option C: Node.js serve**
```bash
npx serve .
```

---

## Firebase Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (from project directory)
firebase init

# Select: Hosting, Firestore, Storage
# Use existing project → select your project
# Public directory: . (dot)
# Single-page app: No
# Overwrite index.html: No

# Deploy
firebase deploy
```

---

## Firestore Database Structure

```
users/{uid}
  - uid, email, name, role, status, department, createdAt

inventory/{itemId}
  - assetCode, name, category, description
  - quantity, unit, minStock
  - brand, model, serialNumber
  - location, department, assignedTo
  - purchasePrice, currentValue, dateAcquired, supplier
  - condition, status, warrantyExpiration
  - imageUrl, notes
  - createdBy, createdAt, updatedAt

categories/{catId}
  - name, description, createdAt

locations/{locId}
  - name, building, description, personResponsible, createdAt

borrowings/{borrowId}
  - borrowerName, borrowerDept, itemId, itemName, itemAssetCode
  - quantity, dateBorrowed, expectedReturnDate, actualReturnDate
  - purpose, conditionBefore, conditionAfter
  - approvedBy, status, notes, recordedBy, createdAt

maintenance/{reportId}
  - itemId, itemName, itemAssetCode
  - reportedBy, dateReported, priority
  - problem, description, reportType, repairStatus
  - assignedTechnician, repairCost, dateRepaired, resolution
  - notes, recordedBy, createdAt

activityLogs/{logId}
  - userId, userName, userRole
  - action, description, itemId, itemName
  - timestamp

settings/general
  - schoolName, schoolAddress, schoolPhone, schoolEmail
  - defaultCurrency, lowStockThreshold, itemsPerPage, academicYear
```

---

## Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (shows error)
- [ ] Logout works
- [ ] Protected pages redirect to login when not authenticated
- [ ] Remember me persists session

### Inventory
- [ ] Add new item with all required fields
- [ ] Validation prevents empty required fields
- [ ] Duplicate asset codes are rejected
- [ ] Edit existing item
- [ ] Delete item (with confirmation)
- [ ] Search by name, code, brand
- [ ] Filter by category, location, status, condition
- [ ] Pagination works
- [ ] Export CSV
- [ ] Image upload

### Borrowing
- [ ] Record new borrowing
- [ ] Return item with condition
- [ ] Overdue items flagged correctly
- [ ] Cancel pending borrowing
- [ ] Damaged item on return suggests maintenance report

### Maintenance
- [ ] Create damage/maintenance report
- [ ] Update repair status
- [ ] Delete report
- [ ] Priority filtering

### Reports
- [ ] All 9 report types generate correctly
- [ ] Category/location filters work
- [ ] Export CSV
- [ ] Print

### Users (Admin only)
- [ ] View all users
- [ ] Change user role
- [ ] Enable/disable user
- [ ] Non-admin cannot access Users page

### Settings
- [ ] Save school information
- [ ] Seed demo data
- [ ] Clear inventory (with confirmation)

### Responsive Design
- [ ] 320px — very small mobile
- [ ] 375px — standard mobile
- [ ] 768px — tablet
- [ ] 1024px — laptop
- [ ] 1440px+ — desktop

---

## Security Notes

- Firebase credentials in `js/firebase-config.js` are **client-side visible** — this is normal for Firebase web apps
- Security is enforced by **Firestore Security Rules** and **Storage Security Rules**
- User roles cannot be changed from the client by non-admins (enforced by Firestore rules)
- Activity logs are write-only from clients (no update/delete except by admin)
- Never use `allow read, write: if true` in production rules

---

## Support

For issues or questions, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
#   S c h o o l - I n v e n t o r y  
 