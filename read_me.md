# IT Inventory Management System

> Last updated: July 12, 2026  
> Stack: TypeScript · NestJS 11 · TypeORM · MySQL · JWT · Vite

## Overview

This repository contains a full-stack IT asset management system for tracking inventory, users, assignments, maintenance, and audit activity. The backend exposes REST APIs, while the frontend provides a web interface for operating the system.

## What is in this project

- Backend: NestJS application under the src folder
- Frontend: Vite-based web app under the frontend folder
- Database: MySQL connection managed with TypeORM
- Authentication: JWT-based login for admin access
- Audit trail: audit logging for major actions

## Backend structure

The backend is organized by feature modules:

- auth
  - login endpoint and JWT authentication
- modules/organization
  - role, user, department, location
- modules/sourcing
  - manufacturer, vendor, category, model
- modules/inventory
  - asset
- modules/operations
  - asset-assignment, maintenance-log, audit-log

### Main backend files

- src/main.ts — starts the NestJS server
- src/app.module.ts — registers the app modules
- src/database/database.module.ts — TypeORM connection setup
- src/database/data-source.ts — TypeORM data source for migrations
- src/auth/auth.controller.ts — login endpoint
- src/common/guards/jwt-auth.guard.ts — JWT guard for protected routes

## Frontend structure

The frontend is a Vite app with static HTML pages and JavaScript modules:

- frontend/index.html — dashboard page
- frontend/login.html — login page
- frontend/assets.html — assets page
- frontend/assignments.html — assignments page
- frontend/maintenance.html — maintenance page
- frontend/audit-logs.html — audit log page
- frontend/setup/ — admin setup pages for users, departments, etc.

## Database model

The current TypeORM entities include:

- Role
- User
- Department
- Location
- Manufacturer
- Vendor
- Category
- Model
- Asset
- AssetAssignment
- MaintenanceLog
- AuditLog

### Core database design

The database is designed around an IT inventory management workflow with these main concepts:

- Organization entities: Role, User, Department, Location
- Sourcing entities: Manufacturer, Vendor, Category, Model
- Inventory entities: Asset
- Operations entities: AssetAssignment, MaintenanceLog, AuditLog

### Entity relationships

- User belongs to a Role and may belong to a Department
- Asset belongs to a Model, Location, and Vendor
- AssetAssignment links an Asset to a User for checkout/checkin tracking
- MaintenanceLog records repair or maintenance work against an Asset
- AuditLog stores changes and actions performed in the system

### Important database tables

| Table | Purpose |
|-------|---------|
| roles | Stores access roles such as admin and employee |
| users | Stores system users and employee records |
| departments | Stores organizational departments |
| locations | Stores physical locations |
| manufacturers | Stores hardware manufacturers |
| vendors | Stores external vendors |
| categories | Stores item categories |
| models | Stores device models |
| assets | Stores inventory assets |
| asset_assignments | Tracks checkout and return history |
| maintenance_logs | Tracks maintenance and repair records |
| audit_logs | Stores system change logs |

### Table-level relationships

| From | Relation | To | Notes |
|------|----------|----|-------|
| users.role_id | N:1 | roles.id | Users belong to a role |
| users.department_id | N:1 | departments.id | Users may belong to a department |
| departments.location_id | N:1 | locations.id | Departments may be tied to a location |
| models.manufacturer_id | N:1 | manufacturers.id | Models are linked to manufacturers |
| models.category_id | N:1 | categories.id | Models belong to a category |
| assets.model_id | N:1 | models.id | Assets reference a model |
| assets.location_id | N:1 | locations.id | Assets may be assigned to a location |
| assets.vendor_id | N:1 | vendors.id | Assets may be linked to a vendor |
| asset_assignments.asset_id | N:1 | assets.id | Assignments belong to an asset |
| asset_assignments.assigned_to_id | N:1 | users.id | Assignment recipient |
| asset_assignments.assigned_by_id | N:1 | users.id | Assignment creator or issuer |
| maintenance_logs.asset_id | N:1 | assets.id | Maintenance records belong to an asset |
| maintenance_logs.performed_by_id | N:1 | users.id | Who performed the maintenance |
| maintenance_logs.vendor_id | N:1 | vendors.id | Optional service vendor |
| audit_logs.user_id | N:1 | users.id | User who triggered the action |

### Relationship map

```text
roles ──< users >── departments
  │               │
  │               └── locations
  │
  └── asset_assignments ──> assets ──> models ──> categories
                                      │
                                      ├── locations
                                      └── vendors

assets ──< maintenance_logs >── users
assets ──< asset_assignments >── users

audit_logs ──> users
```

### Entity reference summary

#### roles
Stores role definitions such as admin and employee.

#### users
Stores system users and employee records. These are used for authentication and assignment tracking.

#### departments
Stores departments within the organization.

#### locations
Stores physical locations such as offices, warehouses, or branches.

#### manufacturers
Stores hardware or device manufacturers.

#### vendors
Stores external vendors or suppliers.

#### categories
Stores categories for inventory items.

#### models
Stores product models and their associated manufacturer and category.

#### assets
Stores the actual inventory assets tracked by the system.

#### asset_assignments
Tracks the checkout and return history of each asset.

#### maintenance_logs
Tracks maintenance and repair activities performed on assets.

#### audit_logs
Stores audit-style records for important system events and changes.

## Environment variables

Create a .env file in the backend project root with values similar to:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password_here
DB_DATABASE=it_asset_mgmt
JWT_SECRET=replace_with_a_long_random_string
PORT=3000
NODE_ENV=development
```

## Running the project

### Backend

```bash
cd it-inventory-mgmt
npm install
npm run start:dev
```

The backend API runs on http://localhost:3000 by default.

### Frontend

```bash
cd it-inventory-mgmt/frontend
npm install
npm run dev
```

The frontend dev server runs on http://localhost:5173 by default.

## Useful commands

```bash
# Build backend
cd it-inventory-mgmt
npm run build

# Run tests
npm test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint
```

## Current status

The project already includes:

- NestJS backend with modular structure
- TypeORM connection to MySQL
- JWT authentication flow
- CRUD-oriented API modules for inventory and operations
- Frontend pages connected to the backend API

If you want, I can also add a short section describing the exact API routes exposed by each module.
