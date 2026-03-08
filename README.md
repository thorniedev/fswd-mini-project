# ShopNext - Next.js E-Commerce App

A Next.js App Router e-commerce project using TypeScript, Tailwind CSS, React Hook Form, and Zod, built on top of the Escuelajs API.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Zustand (auth/cart state)
- Nuqs (query-state utilities available)

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_BASE_URL=https://api.escuelajs.co/api/v1
```

## Current Architecture

```txt
src/
  app/
    (admin)/
      dashboard/
    cart/
    products/
    users/
  components/
  features/
    auth/
      actions.ts
      schema.ts
      types.ts
    products/
      actions.ts
      queries.ts
      schema.ts
      types.ts
    users/
      queries.ts
      types.ts
    cart/
      types.ts
  lib/
    api/
      client.ts
      endpoints.ts
      errors.ts
    utils/
      cn.ts
      currency.ts
      image.ts
      query.ts
    constants/
      app.ts
  store/
  types/
```

## Features Implemented

- Public catalog pages (`/`, `/products`, `/products/[productId]`)
- User list/detail (`/users`, `/users/[userId]`)
- Cart with auth-gated add-to-cart
- Admin dashboard with product CRUD and users list
- Route-level loading pages and global error/not-found fallbacks
- Centralized API wrapper in `src/lib/api/client.ts`
- Feature-based API/query/action modules in `src/features/*`

## API Endpoints Used

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /categories`
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `POST /auth/login`
- `GET /auth/profile`
- `POST /auth/refresh-token`

## Routes

- `/`
- `/products`
- `/products/[productId]`
- `/users`
- `/users/[userId]`
- `/cart`
- `/dashboard`
- `/dashboard/products`
- `/dashboard/users`

## Setup

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Known Limitations

- Auth still uses client-side token state for admin/cart actions.
- Admin routes are currently under `/dashboard/*` instead of `/admin/*`.
- TanStack Query, shadcn CLI scaffolding, sonner, and next-themes are not fully wired yet.

## Future Improvements

- Move auth token persistence to secure cookies via route handlers (`/api/auth/*`).
- Introduce TanStack Query in admin mutation tables/forms.
- Finish route-group migration to `(public)` and `(dashboard)/admin`.
- Add full screenshots and deployment URL section.
