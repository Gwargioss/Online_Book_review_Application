# BookVerse - Online Book Review Application

## Project Black-Box Overview

BookVerse is a full-stack web application for managing books and user reviews.
From an end-user perspective, the system provides:

- account creation and login,
- secure access to protected actions,
- book listing and search,
- creating and managing reviews,
- a dashboard and profile management experience.

The application consists of:

- **Backend API** (Node.js + Express + MongoDB)
- **Frontend SPA** (React + React Router)

The API is exposed under `/api/v1`, and the frontend consumes it through Axios.

## Main User Flows (Black-Box)

1. **Registration/Login Flow**
   - User creates account or logs in.
   - System returns an access token and sets a refresh cookie.
   - Protected routes/actions require authenticated token.

2. **Books Flow**
   - User views paginated books list.
   - User searches books by ISBN, title, or author.
   - User can publish a new book.

3. **Reviews Flow**
   - User opens book details and sees reviews.
   - Authenticated user can add/update/delete their review.

4. **Dashboard/Profile Flow**
   - Authenticated user opens dashboard for quick actions.
   - User edits profile data (name, email, profile picture).

## Modules Summary (What each module does)

### Backend (`src/`)

- `app.js`: creates Express app, mounts middleware/routes, 404 + error handlers.
- `server.js`: connects DB and starts HTTP server.
- `config/env.js`: loads and validates environment variables.
- `config/db.js`: MongoDB connection.
- `routes/`: HTTP route definitions grouped by domain (`auth`, `book`, `review`).
- `controllers/`: request/response orchestration per feature.
- `services/`: core business logic for auth/books/reviews.
- `repositories/`: DB access layer for users/books/reviews.
- `models/`: Mongoose schemas and indexes.
- `validators/`: request validation schemas (Zod).
- `middleware/`: security/auth/validation/error middlewares.
- `utils/`: JWT helpers, password hashing, API response formatting, app errors.

### Frontend (`client/src/`)

- `main.jsx`: app bootstrap (Router + Providers + styles).
- `app/`: app routes/providers.
- `api/http-client.js`: Axios instance and auth refresh interceptor.
- `features/auth/`: login/register/auth-context/auth service.
- `features/courses/`: home, details, publish page, and book card.
- `features/reviews/`: reviews service + list component.
- `features/dashboard/`: authenticated dashboard page.
- `features/profile/`: profile page with edit form.
- `shared/`: route constants, layout, protected route, utilities, UI helpers.
- `styles/index.css`: app styling + responsive behavior.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Zod
- **Security**: helmet, cors, express-rate-limit, cookie-parser
- **Frontend**: React, React Router, Axios, Formik, Bootstrap
- **Quality**: Vitest, Supertest, ESLint, Prettier

## API Endpoints

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me` (protected)
- `PUT /api/v1/auth/profile` (protected)
- `POST /api/v1/auth/logout` (protected)

### Books

- `GET /api/v1/books`
- `POST /api/v1/books` (protected)
- `DELETE /api/v1/books/:id` (protected)
- `POST /api/v1/books/byISBN`
- `POST /api/v1/books/byTitle`
- `POST /api/v1/books/byAuthor`

### Reviews

- `GET /api/v1/books/:id/reviews`
- `PUT /api/v1/books/:id/reviews` (protected)
- `DELETE /api/v1/books/:id/reviews/:reviewId` (protected)

## Rubric Mapping (PDF requirements -> exact code locations)

## A) Common - Setup and Architecture

- **Scalable project structure / separated modules**
  - `src/routes/`, `src/controllers/`, `src/services/`, `src/repositories/`, `src/middleware/`, `src/utils/`
- **Tests in separate folder**
  - `tests/api/`
- **NPM project with dependencies + devDependencies**
  - root `package.json`
  - client `client/package.json`
- **Scripts for start/test/lint/build**
  - root `package.json` scripts:
    - `start`
    - `dev`
    - `test`
    - `lint`
    - `build`
    - `format:check`
- **Build runs without errors**
  - root: `npm run build` (env validation)
  - client: `npm run build` (Vite build)

## B) Common - JWT functionality

- **JWT generated per user**
  - `src/services/auth-service.js` (`login`, `refresh`)
  - `src/utils/jwt.js` (`signAccessToken`, `signRefreshToken`)
- **JWT returned in HTTP response**
  - `src/controllers/auth-controller.js` (`login`, `refresh`)
- **JWT validated on protected routes**
  - `src/middleware/require-auth.js`
  - Used in `src/routes/auth-routes.js` and `src/routes/review-routes.js`

## C) Backend requirements

- **Express setup and start script**
  - `src/app.js`, `src/server.js`, root `app.js`
  - root `package.json` -> `start`
- **Endpoint opens with 200**
  - `GET /` in `src/app.js`
- **Middlewares configured**
  - `src/middleware/security.js`
  - `src/middleware/validate.js`
  - `src/middleware/not-found.js`
  - `src/middleware/error-handler.js`
  - `src/middleware/async-handler.js`
- **Database create/connect**
  - `src/config/db.js`
  - models: `src/models/user.js`, `src/models/book.js`, `src/models/review.js`
- **Password hashing with bcrypt + salt**
  - `src/utils/password.js`
  - used by `src/services/auth-service.js`
- **CRUD endpoints for models + grouped route files**
  - routes grouped in:
    - `src/routes/auth-routes.js`
    - `src/routes/book-routes.js`
    - `src/routes/review-routes.js`
  - handlers in matching controllers/services/repositories.

## D) Frontend requirements

- **Dashboard page for authenticated users**
  - `client/src/features/dashboard/pages/dashboard-page.jsx`
  - protected route in `client/src/app/routes.jsx`
- **Profile view + edit (name/email/profile picture)**
  - UI: `client/src/features/profile/pages/profile-page.jsx`
  - API support: `PUT /auth/profile`
    - `src/routes/auth-routes.js`
    - `src/controllers/auth-controller.js`
    - `src/services/auth-service.js`
    - `src/repositories/user-repository.js`
    - `src/models/user.js`
- **Component-based architecture / modular reusable components**
  - `client/src/features/*`, `client/src/shared/components/*`
- **Responsive design**
  - app responsive styles in `client/src/styles/index.css`
  - Bootstrap imported in `client/src/main.jsx`
- **Client-side routing (SPA, redirects, protected routes)**
  - `client/src/app/routes.jsx`
  - `client/src/shared/components/layout/protected-route.jsx`
- **Forms with Formik + validation + errors**
  - `client/src/features/auth/pages/login-page.jsx`
  - `client/src/features/auth/pages/register-page.jsx`
  - `client/src/features/profile/pages/profile-page.jsx`
  - `client/src/features/courses/pages/studio-page.jsx`
- **State management with React built-in state/context**
  - local state across pages with `useState`
  - auth global state in `client/src/features/auth/auth-context.jsx`
- **Error handling for network/server/input issues**
  - UI error messages in forms/pages
  - centralized API error extraction in `client/src/shared/utils/response.js`
  - Axios interceptor and refresh handling in `client/src/api/http-client.js`

## E) Bonus-related coding items already covered

- **Environment variables for sensitive data**
  - `src/config/env.js`
  - `.env` usage pattern in backend
- **Unit/endpoint tests**
  - `tests/api/app-root.test.js`
  - `tests/api/auth-routes.test.js`
  - `tests/api/book-routes.test.js`
  - `tests/api/review-routes.test.js`

## Run Instructions

## Backend

1. `npm install`
2. configure `.env` values (Mongo URI, JWT secrets, etc.)
3. `npm start`

## Frontend

1. `cd client`
2. `npm install`
3. `npm run dev`

## Quality Commands

- Root tests: `npm test`
- Root lint: `npm run lint`
- Root build check: `npm run build`
- Client build: `npm run build` (inside `client`)

## Final Note

This repository now includes the coding implementation mapped directly to the rubric requirements:

- authentication + access control,
- data management endpoints,
- search/filtering,
- user feedback (reviews),
- protected dashboard and profile management,
- modular architecture,
- tests and quality scripts.
