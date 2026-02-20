# Micro Marketplace (Backend + Web + Mobile)

Full-stack micro marketplace app with:
- Node.js + Express + MongoDB + JWT backend
- React web client (Vite)
- React Native mobile client (Expo)

The project is structured as a monorepo:
- `backend/` – API server
- `web/` – React web app
- `mobile/` – React Native app

---

## 1. Prerequisites

- Node.js 18+
- npm
- MongoDB instance (local or hosted)

---

## 2. Environment variables

Create a `.env` file inside `backend/` with:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/micro-marketplace
JWT_SECRET=change_this_to_a_long_random_secret
```

Notes:
- `PORT` is the HTTP port for the backend.
- `MONGODB_URI` must point to a reachable MongoDB instance.
- `JWT_SECRET` is used to sign JWT access tokens.

The web and mobile clients are currently configured to talk to:

```text
http://localhost:4000/api
```

If you deploy the backend, update the base URL in:
- `web/src/utils/apiClient.js`
- `mobile/src/apiClient.js`

---

## 3. Backend (API server)

Location: `backend/`

### Install dependencies

```bash
cd backend
npm install
```

### Run database seed

This clears and repopulates products and users:

```bash
npm run seed
```

Seeded users:
- `Dhruv@example.com` / `password123`
- `Modi@example.com` / `password123`

### Run backend locally

```bash
npm start
```

This runs a single Node.js process (no auto-reload, no nodemon).

For local development you can also use:

```bash
npm run dev
```

`dev` and `start` both use `node src/server.js` so the backend does not restart automatically.

### Backend test command

```bash
npm test
```

This validates that the Express app and imports load correctly.

---

## 4. Web app (React + Vite)

Location: `web/`

### Install dependencies

```bash
cd web
npm install
```

### Run locally

```bash
npm run dev
```

The app will be available at the URL printed by Vite (usually `http://localhost:5173`).

You must have the backend running at `http://localhost:4000` or adjust `web/src/utils/apiClient.js`.

### Build for production

```bash
npm run build
```

The static build is output to `web/dist/`.

---

## 5. Mobile app (React Native / Expo)

Location: `mobile/`

### Install dependencies

```bash
cd mobile
npm install
```

### Run locally

Use Expo CLI or:

```bash
npm start
```

Ensure your device/emulator can reach the backend base URL configured in `mobile/src/apiClient.js`.

---

## 6. REST API Overview

Base URL (backend):

```text
http://<BACKEND_HOST>:<PORT>/api
```

### Auth

#### POST `/api/auth/register`

Registers a new user.

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Rules:
- `email` is required and must be unique.
- `password` is required and must be at least 6 characters.

Responses:
- `201 Created`:

  ```json
  {
    "user": { "id": "...", "email": "user@example.com" },
    "token": "<jwt-token>"
  }
  ```

- `400 Bad Request` – validation errors.
- `409 Conflict` – email already registered.

#### POST `/api/auth/login`

Authenticates an existing user.

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Responses:
- `200 OK`:

  ```json
  {
    "user": { "id": "...", "email": "user@example.com" },
    "token": "<jwt-token>"
  }
  ```

- `400 Bad Request` – missing email or password.
- `401 Unauthorized` – invalid credentials.

Use the returned `token` as a Bearer token:

```http
Authorization: Bearer <jwt-token>
```

---

### Products

All product routes are under `/api/products`.

#### GET `/api/products`

List products with optional search and pagination.

Query parameters:
- `search` (string, optional)
- `page` (number, optional, default `1`)
- `limit` (number, optional, default `10`)

Response:

```json
{
  "items": [ /* array of products */ ],
  "total": 10,
  "page": 1,
  "totalPages": 1
}
```

#### GET `/api/products/:id`

Get a single product by id.

Responses:
- `200 OK` – product document.
- `404 Not Found` – when product does not exist.

#### POST `/api/products` (authenticated)

Create a new product.

Headers:

```http
Authorization: Bearer <jwt-token>
```

Request body:

```json
{
  "title": "Product name",
  "price": 99.99,
  "description": "Optional description",
  "image": "https://example.com/image.jpg"
}
```

Validation:
- `title` required, non-empty string.
- `price` required, non-negative number.

Responses:
- `201 Created` – created product.
- `400 Bad Request` – validation failure.

#### PUT `/api/products/:id` (authenticated)

Update fields of an existing product.

Headers:

```http
Authorization: Bearer <jwt-token>
```

Request body (any subset of these fields):

```json
{
  "title": "Updated title",
  "price": 120,
  "description": "Updated description",
  "image": "https://example.com/new-image.jpg"
}
```

Responses:
- `200 OK` – updated product.
- `400 Bad Request` – invalid data.
- `404 Not Found` – product not found.

#### DELETE `/api/products/:id` (authenticated)

Delete a product.

Headers:

```http
Authorization: Bearer <jwt-token>
```

Responses:
- `204 No Content` – deleted.
- `404 Not Found` – product not found.

---

### Favorites

All favorites routes require authentication.

Headers:

```http
Authorization: Bearer <jwt-token>
```

#### POST `/api/products/:id/favorite`

Add a product to the authenticated user's favorites.

Response:

```json
{
  "favorites": ["<productId>", "..."]
}
```

Idempotent: adding the same product twice has no effect.

#### DELETE `/api/products/:id/favorite`

Remove a product from favorites.

Response:

```json
{
  "favorites": ["<remainingProductId>", "..."]
}
```

#### GET `/api/products/me/favorites`

Get the authenticated user's favorite products.

Response:

```json
{
  "items": [
    {
      "_id": "<productId>",
      "title": "Product",
      "price": 99.99,
      "description": "Description",
      "image": "https://...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---




## 8. Seed script and test credentials (quick reference)

- Seed script:

  ```bash
  cd backend
  npm run seed
  ```

- Test users:
  - `Dhruv@example.com` / `password123`
  - `Modi@example.com` / `password123`

