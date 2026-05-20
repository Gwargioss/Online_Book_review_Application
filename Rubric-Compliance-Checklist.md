# Rubric Compliance Checklist

## Documentation

- [X] Project Overview Document
  - File: `Project-Overview-Document.md`
- [X] Functional Requirements Document (FRD)
  - File: `Functional-Requirements-Document-FRD.md`
- [X] Technical Requirements Document (TRD)
  - File: `Technical-Requirements-Document-TRD.md`
- [X] Database Schema Documentation
  - File: `Database-Schema-Documentation.md`
- [X] API Documentation
  - File: `API-Documentation.md`
- [X] README with installation + usage + requirement mapping
  - File: `ReadMe.md`

## Common - Setup and Architecture

- [X] Scalable project structure with separated modules
  - Paths: `src/routes`, `src/controllers`, `src/services`, `src/repositories`, `src/middleware`, `src/utils`
- [X] Tests in separate folder
  - Path: `tests/api`
- [X] npm project with dependencies and devDependencies
  - Files: `package.json`, `client/package.json`
- [X] Scripts for start/test/lint/build
  - File: `package.json` -> `start`, `dev`, `test`, `lint`, `build`, `format:check`
- [X] Build runs without errors
  - Commands: `npm run build`, `cd client && npm run build`

## Common - JWT

- [X] JWT generated per user
  - Files: `src/services/auth-service.js`, `src/utils/jwt.js`
- [X] JWT returned in HTTP response
  - File: `src/controllers/auth-controller.js`
- [X] JWT validated on secure routes
  - File: `src/middleware/require-auth.js`
  - Usage: `src/routes/auth-routes.js`, `src/routes/review-routes.js`

## Backend

- [X] Express configured and start script runs
  - Files: `src/app.js`, `src/server.js`, `app.js`
- [X] Root endpoint opens with 200
  - Endpoint: `GET /` in `src/app.js`
- [X] Middlewares configured
  - Files: `src/middleware/security.js`, `src/middleware/validate.js`, `src/middleware/error-handler.js`, `src/middleware/not-found.js`, `src/middleware/async-handler.js`
- [X] Database connected and used
  - Files: `src/config/db.js`, `src/models/*.js`
- [X] Password encrypted with bcrypt + salt
  - Files: `src/utils/password.js`, `src/services/auth-service.js`
- [X] CRUD-style endpoints grouped in route files
  - Files: `src/routes/auth-routes.js`, `src/routes/book-routes.js`, `src/routes/review-routes.js`

## Frontend

- [X] Dashboard for authenticated users
  - File: `client/src/features/dashboard/pages/dashboard-page.jsx`
  - Route: `client/src/app/routes.jsx`
- [X] Profile view and edit (`name`, `email`, `profile picture`)
  - UI: `client/src/features/profile/pages/profile-page.jsx`
  - API: `PUT /api/v1/auth/profile` in backend auth module
- [X] Component-based architecture
  - Paths: `client/src/features/*`, `client/src/shared/components/*`
- [X] Responsive design
  - Files: `client/src/styles/index.css`, `client/src/main.jsx` (Bootstrap import)
- [X] SPA routing with redirects/protected routing
  - Files: `client/src/app/routes.jsx`, `client/src/shared/components/layout/protected-route.jsx`
- [X] Forms with Formik and validation
  - Files:
    - `client/src/features/auth/pages/login-page.jsx`
    - `client/src/features/auth/pages/register-page.jsx`
    - `client/src/features/profile/pages/profile-page.jsx`
    - `client/src/features/courses/pages/studio-page.jsx`
- [X] State management using React built-ins
  - Files: `client/src/features/auth/auth-context.jsx` + local `useState` in pages
- [X] User-facing error handling
  - Files: `client/src/shared/utils/response.js`, `client/src/api/http-client.js`, form/page components

## Bonus (Implemented)

- [X] Environment variables for sensitive configuration
  - File: `src/config/env.js`
- [X] Endpoint tests
  - Files:
    - `tests/api/app-root.test.js`
    - `tests/api/auth-routes.test.js`
    - `tests/api/book-routes.test.js`
    - `tests/api/review-routes.test.js`

## Bonus (Documentation Artifacts Added)

- [X] Swagger spec file
  - File: `swagger.json`
- [X] Postman collection file
  - File: `postman_collection.json`
