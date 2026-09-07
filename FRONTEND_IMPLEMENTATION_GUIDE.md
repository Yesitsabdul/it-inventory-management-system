# IT Inventory Management System — Frontend Implementation Guide

**Backend Stack:** NestJS + TypeORM + MySQL  
**API Base URL:** `http://localhost:3000`  
**Authentication:** JWT Bearer Token  
**Database:** MySQL 9.7

---

## Table of Contents

1. [Authentication](#authentication)
2. [Data Models](#data-models)
3. [API Endpoints](#api-endpoints)
4. [Checkout & Checkin Workflow](#checkout--checkin-workflow)
5. [Pagination](#pagination)
6. [Error Handling](#error-handling)
7. [Frontend Architecture](#frontend-architecture)
8. [Default Credentials](#default-credentials)

---

## Authentication

### Login (Only Public Route)
```
POST /auth/login
```

**Request:**
```json
{
  "email": "superadmin@example.com",
  "password": "Admin@1234"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "superadmin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "timestamp": "2026-07-01T10:00:00.000Z",
  "path": "/auth/login"
}
```

### Using the Token
Every request except `/auth/login` requires this header:
```
Authorization: Bearer <access_token>
```

Token expires after **8 hours**. On expiry, the API returns `401` — redirect user to login.

---

## Data Models

### 1. User
```typescript
{
  id: number;
  first_name: string;
  last_name: string;
  email: string;            // unique
  employee_number?: string; // unique, optional
  is_active: boolean;       // default: true
  role: { id, name };       // relation
  department?: { id, name }; // relation, optional
  created_at: timestamp;
  updated_at: timestamp;
  deleted_at?: timestamp;
  // NOTE: password is NEVER returned in any response
}
```

### 2. Role
```typescript
{
  id: number;
  name: string;        // unique, e.g. 'admin', 'employee'
  description?: string;
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 3. Department
```typescript
{
  id: number;
  name: string;
  location?: { id, name }; // relation, optional
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 4. Location
```typescript
{
  id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 5. Manufacturer
```typescript
{
  id: number;
  name: string;
  support_url?: string;   // NOT 'website'
  support_email?: string; // NOT 'phone'
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 6. Vendor
```typescript
{
  id: number;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 7. Category
```typescript
{
  id: number;
  name: string;
  type?: string; // 'asset' | 'accessory' | 'component' — NOT 'description'
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 8. Model
```typescript
{
  id: number;
  name: string;
  model_number?: string;
  unique_id: string;       // unique
  manufacturer?: { id, name }; // relation, optional
  category: { id, name };      // relation, required
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 9. StatusLabel
```typescript
{
  id: number;
  name: string;
  type?: string;  // 'deployable' | 'pending' | 'archived' | 'undeployable'
  color?: string; // e.g. '#00FF00'
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 10. Asset ⭐ (Central Entity)
```typescript
{
  id: number;
  asset_tag: string;         // unique, e.g. 'ASSET-001'
  name?: string;
  serial_number?: string;    // unique
  purchase_cost?: number;    // decimal
  purchase_date?: date;      // ISO string e.g. '2026-01-15'
  warranty_expiry?: date;    // ISO string
  notes?: string;
  model: { id, name };           // relation, required
  status_label: { id, name };    // relation, required
  location?: { id, name };       // relation, optional
  vendor?: { id, name };         // relation, optional
  created_at: timestamp;
  updated_at: timestamp;
  deleted_at?: timestamp;
}
```

### 11. Accessory
```typescript
{
  id: number;
  name: string;
  quantity: number;          // default: 0
  min_quantity: number;      // default: 0
  purchase_cost?: number;
  notes?: string;
  category?: { id, name };       // relation, optional
  manufacturer?: { id, name };   // relation, optional
  location?: { id, name };       // relation, optional
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 12. Component
```typescript
{
  id: number;
  name: string;
  serial_number?: string;
  quantity: number;          // default: 0
  min_quantity: number;      // default: 0
  purchase_cost?: number;
  notes?: string;
  category?: { id, name };       // relation, optional
  manufacturer?: { id, name };   // relation, optional
  location?: { id, name };       // relation, optional
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 13. AssetAssignment 🔀
```typescript
{
  id: number;
  action_type: string;       // 'checkout' | 'checkin'
  checkout_at?: timestamp;
  checkin_at?: timestamp;    // null = still checked out
  expected_checkin?: date;
  notes?: string;
  asset: { id, asset_tag };          // relation, required
  assigned_to: { id, first_name };   // user receiving asset, required
  assigned_by?: { id, first_name };  // admin performing action, optional
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 14. MaintenanceLog
```typescript
{
  id: number;
  title: string;             // required — NOT 'description'
  type?: string;             // 'maintenance' | 'repair' | 'upgrade'
  start_date?: date;         // NOT 'maintenance_date'
  completion_date?: date;    // NOT 'next_maintenance'
  cost?: number;
  notes?: string;            // NOT a separate 'description' field
  asset: { id, asset_tag };          // relation, required
  performed_by?: { id, first_name }; // relation to User — NOT a plain string
  vendor?: { id, name };             // relation, optional
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 15. AuditLog 🔷
```typescript
{
  id: number;
  action: string;            // 'CREATE' | 'UPDATE' | 'DELETE'
  entity_type: string;       // e.g. 'assets', 'locations'
  entity_id: number;
  old_values?: object;       // snapshot before change — NOT 'changes'
  new_values?: object;       // snapshot after change — NOT 'changes'
  ip_address?: string;
  user?: { id, first_name, last_name, email }; // who made the change
  created_at: timestamp;
  updated_at: timestamp;
}
```

---

## API Endpoints

### Headers Required (all except login)
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

### Auth
```
POST   /auth/login          ← PUBLIC, no token needed
```

---

### Users `/users`
```
GET    /users               → { data: User[], meta }
GET    /users/:id           → User
POST   /users               → User (201)
PATCH  /users/:id           → User
DELETE /users/:id           → 204 No Content
```

**Create User request body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "employee_number": "EMP001",
  "role_id": 1,
  "department_id": 1
}
```

---

### Roles `/roles`
```
GET    /roles               → { data: Role[], meta }
GET    /roles/:id           → Role
POST   /roles               → Role (201)
PATCH  /roles/:id           → Role
DELETE /roles/:id           → 204
```

**Create Role request body:**
```json
{
  "name": "manager",
  "description": "Department manager"
}
```

---

### Departments `/departments`
```
GET    /departments         → { data: Department[], meta }
GET    /departments/:id     → Department
POST   /departments         → Department (201)
PATCH  /departments/:id     → Department
DELETE /departments/:id     → 204
```

**Create Department request body:**
```json
{
  "name": "IT Support",
  "location_id": 1
}
```

---

### Locations `/locations`
```
GET    /locations           → { data: Location[], meta }
GET    /locations/:id       → Location
POST   /locations           → Location (201)
PATCH  /locations/:id       → Location
DELETE /locations/:id       → 204
```

**Create Location request body:**
```json
{
  "name": "Head Office",
  "address": "123 Main St",
  "city": "Karachi",
  "country": "Pakistan"
}
```

---

### Manufacturers `/manufacturers`
```
GET    /manufacturers       → { data: Manufacturer[], meta }
GET    /manufacturers/:id   → Manufacturer
POST   /manufacturers       → Manufacturer (201)
PATCH  /manufacturers/:id   → Manufacturer
DELETE /manufacturers/:id   → 204
```

**Create Manufacturer request body:**
```json
{
  "name": "Dell",
  "support_url": "https://dell.com/support",
  "support_email": "support@dell.com"
}
```
⚠️ Fields are `support_url` and `support_email` — NOT `website` or `phone`.

---

### Vendors `/vendors`
```
GET    /vendors             → { data: Vendor[], meta }
GET    /vendors/:id         → Vendor
POST   /vendors             → Vendor (201)
PATCH  /vendors/:id         → Vendor
DELETE /vendors/:id         → 204
```

**Create Vendor request body:**
```json
{
  "name": "Tech Supplies Co.",
  "contact_name": "John Smith",
  "email": "john@techsupplies.com",
  "phone": "+92-21-1234567"
}
```

---

### Categories `/categories`
```
GET    /categories          → { data: Category[], meta }
GET    /categories/:id      → Category
POST   /categories          → Category (201)
PATCH  /categories/:id      → Category
DELETE /categories/:id      → 204
```

**Create Category request body:**
```json
{
  "name": "Laptops",
  "type": "asset"
}
```
⚠️ Field is `type` (values: `asset`, `accessory`, `component`) — NOT `description`.

---

### Models `/models`
```
GET    /models              → { data: Model[], meta }
GET    /models/:id          → Model
POST   /models              → Model (201)
PATCH  /models/:id          → Model
DELETE /models/:id          → 204
```

**Create Model request body:**
```json
{
  "name": "Latitude 5420",
  "model_number": "LAT-5420",
  "unique_id": "DELL-LAT-5420",
  "manufacturer_id": 1,
  "category_id": 1
}
```
⚠️ `unique_id` is required and must be unique. `category_id` is required.

---

### Status Labels `/status-labels`
```
GET    /status-labels       → { data: StatusLabel[], meta }
GET    /status-labels/:id   → StatusLabel
POST   /status-labels       → StatusLabel (201)
PATCH  /status-labels/:id   → StatusLabel
DELETE /status-labels/:id   → 204
```

**Create StatusLabel request body:**
```json
{
  "name": "Ready to Deploy",
  "type": "deployable",
  "color": "#00FF00"
}
```
⚠️ `type` must be one of: `deployable`, `pending`, `archived`, `undeployable`.

---

### Assets `/assets`
```
GET    /assets              → { data: Asset[], meta }
GET    /assets/:id          → Asset
POST   /assets              → Asset (201)
PATCH  /assets/:id          → Asset
DELETE /assets/:id          → 204
```

**Create Asset request body:**
```json
{
  "asset_tag": "ASSET-001",
  "name": "Dell Laptop",
  "serial_number": "DEL123456",
  "purchase_cost": 899.99,
  "purchase_date": "2026-01-15",
  "warranty_expiry": "2028-01-15",
  "notes": "Assigned to dev team",
  "model_id": 1,
  "status_label_id": 1,
  "location_id": 1,
  "vendor_id": 1
}
```
⚠️ `model_id` and `status_label_id` are **required**. All others are optional.  
⚠️ Dates must be ISO strings: `"2026-01-15"`.

---

### Accessories `/accessories`
```
GET    /accessories         → { data: Accessory[], meta }
GET    /accessories/:id     → Accessory
POST   /accessories         → Accessory (201)
PATCH  /accessories/:id     → Accessory
DELETE /accessories/:id     → 204
```

**Create Accessory request body:**
```json
{
  "name": "USB-C Cable",
  "quantity": 50,
  "min_quantity": 10,
  "purchase_cost": 15.99,
  "notes": "For MacBooks",
  "category_id": 1,
  "manufacturer_id": 1,
  "location_id": 1
}
```

---

### Components `/components`
```
GET    /components          → { data: Component[], meta }
GET    /components/:id      → Component
POST   /components          → Component (201)
PATCH  /components/:id      → Component
DELETE /components/:id      → 204
```

**Create Component request body:**
```json
{
  "name": "Samsung 980 Pro SSD 1TB",
  "serial_number": "SSD123456",
  "quantity": 20,
  "min_quantity": 5,
  "purchase_cost": 120.00,
  "category_id": 1,
  "manufacturer_id": 2,
  "location_id": 1
}
```

---

### Asset Assignments `/asset-assignments`
```
GET    /asset-assignments          → { data: AssetAssignment[], meta }
GET    /asset-assignments/:id      → AssetAssignment
POST   /asset-assignments          → AssetAssignment (generic create)
PATCH  /asset-assignments/:id      → AssetAssignment
DELETE /asset-assignments/:id      → 204

POST   /asset-assignments/checkout → checkout an asset ← BUSINESS LOGIC
POST   /asset-assignments/checkin  → checkin an asset  ← BUSINESS LOGIC
```

⚠️ For actual checkout/checkin workflow, use the dedicated endpoints below — not the generic `POST /asset-assignments`.

---

### Maintenance Logs `/maintenance-logs`
```
GET    /maintenance-logs    → { data: MaintenanceLog[], meta }
GET    /maintenance-logs/:id → MaintenanceLog
POST   /maintenance-logs    → MaintenanceLog (201)
PATCH  /maintenance-logs/:id → MaintenanceLog
DELETE /maintenance-logs/:id → 204
```

**Create MaintenanceLog request body:**
```json
{
  "title": "Hard drive replacement",
  "type": "repair",
  "start_date": "2026-07-01",
  "completion_date": "2026-07-02",
  "cost": 150.00,
  "notes": "Replaced with 1TB SSD",
  "asset_id": 1,
  "performed_by_id": 2,
  "vendor_id": 1
}
```
⚠️ Field names: `title` (not `description`), `start_date` (not `maintenance_date`), `performed_by_id` (FK to User, not a plain string).

---

### Audit Logs `/audit-logs`
```
GET    /audit-logs          → { data: AuditLog[], meta }
GET    /audit-logs/:id      → AuditLog
```
⚠️ Audit logs are **read-only** from the frontend perspective. They are written automatically by the backend interceptor on every `POST`, `PATCH`, `DELETE` request.

---

## Checkout & Checkin Workflow

This is the **core business workflow** of the system. Use these dedicated endpoints — not the generic `POST /asset-assignments`.

### Checkout an Asset
```
POST /asset-assignments/checkout
```

**Request body:**
```json
{
  "asset_id": 1,
  "assigned_to_id": 3,
  "assigned_by_id": 2,
  "expected_checkin": "2026-08-01",
  "notes": "Assigned for project work",
  "status_label_id": 2
}
```

| Field | Required | Description |
|---|---|---|
| `asset_id` | ✅ | ID of asset to check out |
| `assigned_to_id` | ✅ | ID of user receiving the asset |
| `assigned_by_id` | ❌ | ID of admin performing the action |
| `expected_checkin` | ❌ | Expected return date (ISO string) |
| `notes` | ❌ | Any notes |
| `status_label_id` | ❌ | Status to set on the asset (e.g. "Deployed") |

**Success Response (201):** Full `AssetAssignment` object

**Error — asset already checked out (409):**
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Asset 1 is already checked out (assignment #5)"
}
```

---

### Checkin an Asset
```
POST /asset-assignments/checkin
```

**Request body:**
```json
{
  "asset_id": 1,
  "notes": "Returned in good condition",
  "status_label_id": 1
}
```

| Field | Required | Description |
|---|---|---|
| `asset_id` | ✅ | ID of asset to check in |
| `notes` | ❌ | Any notes |
| `status_label_id` | ❌ | Status to set on asset after checkin (e.g. "Ready to Deploy") |

**Success Response (201):** Updated `AssetAssignment` object with `checkin_at` filled in

**Error — no active checkout (400):**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "No active checkout found for asset 1"
}
```

---

### Checking if an Asset is Currently Checked Out

To show "checked out" status on an asset detail page, check the asset's assignments:

```
GET /asset-assignments?page=1&limit=100
```

Filter results in the frontend where:
- `asset.id === targetAssetId`
- `checkin_at === null`

If such a record exists, the asset is currently checked out.

---

## Pagination

All list endpoints (`GET /assets`, `GET /users`, etc.) support pagination:

```
GET /assets?page=1&limit=20
```

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | integer | 1 | Current page (min: 1) |
| `limit` | integer | 20 | Items per page (min: 1, max: 100) |

**Response Format (all list endpoints):**
```json
{
  "data": [ /* array of items */ ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "lastPage": 8
  }
}
```

---

## Error Handling

### Error Response Shape
Every error from this API follows this consistent format:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Human readable message here",
  "timestamp": "2026-07-01T10:00:00.000Z",
  "path": "/assets"
}
```

In development, some errors also include a `detail` field with the raw database error message (useful for debugging, never shown in production).

### HTTP Status Codes

| Code | Meaning | When it happens |
|---|---|---|
| `200` | OK | Successful GET, PATCH |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Validation failed, bad FK reference |
| `401` | Unauthorized | Missing or invalid/expired JWT token |
| `404` | Not Found | Resource with that ID doesn't exist |
| `409` | Conflict | Duplicate unique value, double checkout |
| `500` | Internal Server Error | Unexpected server error |

### Common Scenarios

**Validation error (400):**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "name should not be empty, type must be one of: asset, accessory, component",
  "timestamp": "2026-07-01T10:00:00.000Z",
  "path": "/categories"
}
```

**Duplicate value (409):**
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "A record with this value already exists."
}
```

**Token expired (401):**
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

**Not found (404):**
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Asset 999 not found",
  "timestamp": "2026-07-01T10:00:00.000Z",
  "path": "/assets/999"
}
```

---

## Frontend Architecture

### Recommended Pages

```
/login                  → Login form (only public page)
/dashboard              → Overview stats
/assets                 → Asset list + search/filter
/assets/new             → Create asset form
/assets/:id             → Asset detail + assignment history
/users                  → User list
/users/new              → Create user form
/assignments            → Checkout/checkin interface
/maintenance            → Maintenance log list
/audit-logs             → Read-only audit trail
/setup/locations        → Locations CRUD
/setup/departments      → Departments CRUD
/setup/roles            → Roles CRUD
/setup/categories       → Categories CRUD
/setup/manufacturers    → Manufacturers CRUD
/setup/vendors          → Vendors CRUD
/setup/models           → Models CRUD
/setup/status-labels    → Status labels CRUD
```

### Token Storage & Management

```javascript
// After login
const { access_token, user } = await loginResponse.json();
localStorage.setItem('token', access_token);
localStorage.setItem('user', JSON.stringify(user));

// Every API call
const token = localStorage.getItem('token');
fetch('http://localhost:3000/assets', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Handle 401 — token expired
if (response.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

// Logout
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login';
```

### Suggested API Helper (vanilla JS)

```javascript
const API_BASE = 'http://localhost:3000';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Something went wrong');
  }

  return data;
}

// Usage examples
const { data: assets, meta } = await apiFetch('/assets?page=1&limit=20');
const asset = await apiFetch('/assets/1');
const newAsset = await apiFetch('/assets', {
  method: 'POST',
  body: JSON.stringify({ asset_tag: 'ASSET-002', model_id: 1, status_label_id: 1 }),
});
await apiFetch('/assets/1', { method: 'DELETE' });
```

### Important Frontend Rules

1. **Never send `password` in GET responses** — the backend already excludes it, but don't try to display it either.
2. **Dates must be ISO strings** — `"2026-07-01"` not `"01/07/2026"`.
3. **IDs are integers** — always send `model_id: 1` not `model_id: "1"`.
4. **Use checkout/checkin endpoints** for asset assignment workflow — not the generic `POST /asset-assignments`.
5. **Audit logs are read-only** — never try to create/update/delete them from the frontend.
6. **Soft-deleted records** are automatically hidden by the API — no need to filter them on the frontend.

---

## Default Credentials

```
Email:    superadmin@example.com
Password: Admin@1234
Role:     admin
```

⚠️ There are **no seed migration files** — the admin user was created via the API. If you reset the database, you must recreate the admin user manually via `POST /users` (you'll need to temporarily make it public or insert directly via MySQL).

---

## Backend Run Commands

```bash
npm run start:dev     # Development with auto-reload
npm run start         # Production
npm run build         # Compile TypeScript
npm test              # Unit tests
npm run test:e2e      # End-to-end tests
```

## Migration Commands

```bash
# Generate migration from entity changes
$env:TS_NODE_PROJECT="tsconfig.cli.json"; npx typeorm-ts-node-commonjs migration:generate src/database/migrations/MigrationName -d src/database/data-source.ts

# Run pending migrations
$env:TS_NODE_PROJECT="tsconfig.cli.json"; npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts

# Revert last migration
$env:TS_NODE_PROJECT="tsconfig.cli.json"; npx typeorm-ts-node-commonjs migration:revert -d src/database/data-source.ts
```

---

*Last Updated: July 2026 | Backend Version: 0.0.1*
