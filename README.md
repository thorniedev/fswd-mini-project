# I-Shop (Next.js E-Commerce)

Modern e-commerce app built with Next.js App Router, TypeScript, Tailwind CSS, and a feature-based architecture on top of Escuelajs Fake Store API.

## Table of Contents

- Overview
- Product Scope
- Technical Stack
- Architecture
- State Management
- Authentication and Authorization
- Routing
- API Integration
- UI/UX Notes
- Environment Variables
- Local Development
- Build and Production
- Troubleshooting
- Known Limitations

## Overview

This project includes:

- Public shopping flow (home, products, product detail, cart, contact)
- Role-based admin dashboard for product/user management
- Authentication with role-aware redirects
- User-scoped cart persistence
- Profile management for both customer and admin
- Theme toggle (light/dark) and animated notification popups

## Product Scope

### Public user flow

- Browse products and details
- Filter by category and price
- Add/remove items in cart
- Checkout (simulated, with success/fail notifications)
- Manage own profile

### Admin flow

- Access admin-only dashboard
- Manage products (create, update, delete, image upload)
- Manage users (create, update, delete with role restrictions)
- Access admin profile page
- Cannot shop or use cart

## Technical Stack

- **Next.js 16 (App Router + Turbopack)**: routing, server/client rendering, build/runtime
- **TypeScript**: type-safe domain models and API contracts
- **Tailwind CSS v4**: utility-first styling with theme tokens
- **React Hook Form + Zod**: form state + validation
- **Zustand (persist middleware)**: client state management
  - `useAuthStore`
  - `useCartStore` (user-scoped cart)
  - `useNotificationStore` (global popup notifications)
- **Lucide React**: icon system
- **Magic UI Animated List**: animated popup notification list

## Architecture

Feature-first structure:

```txt
src/
  app/
    api/
      auth/
        session/route.ts
    (admin)/
      dashboard/
        page.tsx
        loading.tsx
        error.tsx
        products/page.tsx
        products/loading.tsx
        products/error.tsx
        users/page.tsx
        users/loading.tsx
        users/error.tsx
        profile/page.tsx
    cart/page.tsx
    contact/page.tsx
    products/
      page.tsx
      error.tsx
      [productId]/page.tsx
      [productId]/error.tsx
    users/
      error.tsx
      page.tsx           # admin-only list
      [userId]/page.tsx  # profile detail
      [userId]/loading.tsx
      [userId]/error.tsx
  components/
    layout/
    products/
    users/
    cart/
    shared/
    ui/
  features/
    auth/
    products/
    users/
    cart/
  lib/
    api/
    auth/
    utils/
  proxy.ts
  store/
    index.ts
```

### Layer responsibilities

- `src/features/*`: business/domain logic and API calls grouped by feature
- `src/lib/api/*`: shared API client (`apiFetch`), endpoint constants, normalized API errors
- `src/components/*`: reusable UI + route-specific client interactions
- `src/app/*`: route files, server-side data loading orchestration, layouts
- `src/store/index.ts`: global Zustand stores

## State Management

Zustand is used for app-wide client state:

- **Auth state** (`useAuthStore`)
  - current user, tokens, role checks
- **Cart state** (`useCartStore`)
  - cart separated by user ID
  - admin role cannot use cart
- **Notification state** (`useNotificationStore`)
  - success/error/info popup messages

### Store behavior details

- Auth `setAuth`, `setUser`, and `logout` trigger cart sync to avoid data leakage across users.
- Cart storage uses owner-scoped records (`itemsByOwner`) and an active `items` view.
- Admin role always resolves to empty cart.

## Authentication and Role Rules

- **Admin**
  - redirected to `/dashboard`
  - restricted to dashboard flow
  - cannot use shopping cart
  - has admin profile at `/dashboard/profile`
- **Customer/User**
  - uses public flow (`/`, `/products`, `/cart`, etc.)
  - cannot access admin routes
- **Users list page** (`/users`)
  - admin-only access

### Session and route protection

- Login/register syncs role + user session into secure cookies via `POST /api/auth/session`.
- Logout clears session cookies via `DELETE /api/auth/session`.
- `src/proxy.ts` enforces:
  - only admins can access `/dashboard/*`
  - admins are redirected away from public shopping routes
  - non-admins are redirected away from `/users`

### Role matrix

| Capability | Customer | Admin |
| --- | --- | --- |
| Browse products | Yes | Restricted to dashboard flow |
| Use cart | Yes | No |
| Access `/dashboard/*` | No | Yes |
| Access `/users` list | No | Yes |
| Edit own profile | Yes | Yes |
| Manage products/users | No | Yes |

## Environment Variables

Copy and configure env:

```bash
cp .env.example .env.local
```

Required:

```env
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
```

Notes:

- API base URL is **env-only** (no hardcoded fallback in source).
- Missing `NEXT_PUBLIC_API_BASE_URL` will throw runtime error when API is called.
- Recommended value for Escuelajs: `https://api.escuelajs.co/api/v1`

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - ESLint checks

## Routing

Public:

- `/`
- `/products`
- `/products/[productId]`
- `/cart`
- `/contact`
- `/users/[userId]` (profile detail)

Admin:

- `/dashboard`
- `/dashboard/products`
- `/dashboard/users`
- `/dashboard/profile`

### Redirect behavior

- Admin login defaults to `/dashboard`.
- Non-admin login defaults to `/`.
- Invalid role route targets are ignored:
  - Admin is not sent to cart path from `next=...`.
  - Customer is not sent to dashboard path from `next=...`.

## Core Functional Highlights

- Product listing with category + price filtering
- Grid/List view toggle with improved category selection UX
- Product CRUD in admin dashboard
- User management in admin dashboard
- Checkout button with animated popup notification (success/fail)
- Cart clear on successful checkout
- Register flow supports profile image file upload (`/files/upload`)

## API Integration

### Shared client

- `src/lib/api/client.ts`
  - centralized request handling
  - auth header support
  - revalidation options
  - consistent API error conversion

### Feature modules

- `features/products/*`
  - `queries.ts`: read operations
  - `actions.ts`: write operations + image upload
- `features/users/*`
  - `queries.ts`: list/detail/create/update/delete + avatar upload
- `features/auth/*`
  - login/profile actions
  - Zod schemas for auth forms

### Security-oriented integration improvements

- API base URL is env-only and validated in one place (`getRequiredApiBaseUrl`).
- Session role is enforced server-side in middleware (not only client-side UI guards).
- Cookie-backed session sync route centralizes auth boundary for Next.js routing.

## API Endpoints Used

- `POST /auth/login`
- `GET /auth/profile`
- `POST /auth/refresh-token`
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /categories`
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `POST /files/upload`

## UI/UX Notes

- Theme toggle uses smooth animated transition and token-based dark mode.
- Category selector on products page is sanitized and scrollable (malicious/noisy category names are filtered out).
- Checkout uses animated popup notifications with success/fail outcomes.
- Profile editing is modal-based for cleaner UX.
- Core pages now use theme tokens (`text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`) for better light/dark consistency.

## Loading and Error Handling

- Global boundaries:
  - `src/app/error.tsx`
  - `src/app/not-found.tsx`
- Route-level boundaries:
  - `src/app/products/error.tsx`
  - `src/app/products/[productId]/error.tsx`
  - `src/app/users/error.tsx`
  - `src/app/users/[userId]/error.tsx`
  - `src/app/(admin)/dashboard/error.tsx`
  - `src/app/(admin)/dashboard/products/error.tsx`
  - `src/app/(admin)/dashboard/users/error.tsx`
- Route-level loading UI:
  - products list/detail
  - users list/detail
  - dashboard root/products/users

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure env:

```bash
cp .env.example .env.local
```

3. Set env value in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.escuelajs.co/api/v1
```

3. Start development:

```bash
npm run dev
```

4. Open:

- `http://localhost:3000`

## Build and Production

```bash
npm run build
npm run start
```

If Next.js warns about multiple lockfiles, set `turbopack.root` in `next.config.ts` or remove unrelated lockfiles outside this project.

## Troubleshooting

### Error: `Missing NEXT_PUBLIC_API_BASE_URL environment variable`

- Ensure `.env.local` exists in project root.
- Ensure key name is exactly:
  - `NEXT_PUBLIC_API_BASE_URL`
- Restart dev server after env changes.

### Admin profile link not working

- Admin profile is available at `/dashboard/profile`.
- Admin routes are restricted to `/dashboard/*`.

### Cart shared between users

- Cart is owner-scoped in Zustand store.
- Re-login should switch to correct cart scope automatically.

## Known Limitations

- Checkout is simulated on client side.
- Some secondary pages still have legacy color classes and can be further standardized.
