# Rubric Compliance Checklist

## Documentation

- [x] Project Overview Document  
  - File: `Project-Overview-Document.md`
- [x] Functional Requirements Document (FRD)  
  - File: `Functional-Requirements-Document-FRD.md`
- [x] Technical Requirements Document (TRD)  
  - File: `Technical-Requirements-Document-TRD.md`
- [x] Database Schema Documentation  
  - File: `Database-Schema-Documentation.md`
- [x] API Documentation  
  - File: `API-Documentation.md`
- [x] README with installation + usage + requirement mapping  
  - File: `ReadMe.md`

## Common - Setup and Architecture

- [x] Scalable project structure with separated modules  
  - Paths: `src/routes`, `src/controllers`, `src/services`, `src/repositories`, `src/middleware`, `src/utils`
- [x] Tests in separate folder  
  - Path: `tests/api`
- [x] npm project with dependencies and devDependencies  
  - Files: `package.json`, `client/package.json`
- [x] Scripts for start/test/lint/build  
  - File: `package.json` -> `start`, `dev`, `test`, `lint`, `build`, `format:check`
- [x] Build runs without errors  
  - Commands: `npm run build`, `cd client && npm run build`

## Common - JWT

- [x] JWT generated per user  
  - Files: `src/services/auth-service.js`, `src/utils/jwt.js`
- [x] JWT returned in HTTP response  
  - File: `src/controllers/auth-controller.js`
- [x] JWT validated on secure routes  
  - File: `src/middleware/require-auth.js`
  - Usage: `src/routes/auth-routes.js`, `src/routes/review-routes.js`

## Backend

- [x] Express configured and start script runs  
  - Files: `src/app.js`, `src/server.js`, `app.js`
- [x] Root endpoint opens with 200  
  - Endpoint: `GET /` in `src/app.js`
- [x] Middlewares configured  
  - Files: `src/middleware/security.js`, `src/middleware/validate.js`, `src/middleware/error-handler.js`, `src/middleware/not-found.js`, `src/middleware/async-handler.js`
- [x] Database connected and used  
  - Files: `src/config/db.js`, `src/models/*.js`
- [x] Password encrypted with bcrypt + salt  
  - Files: `src/utils/password.js`, `src/services/auth-service.js`
- [x] CRUD-style endpoints grouped in route files  
  - Files: `src/routes/auth-routes.js`, `src/routes/book-routes.js`, `src/routes/review-routes.js`

## Frontend

- [x] Dashboard for authenticated users  
  - File: `client/src/features/dashboard/pages/dashboard-page.jsx`
  - Route: `client/src/app/routes.jsx`
- [x] Profile view and edit (`name`, `email`, `profile picture`)  
  - UI: `client/src/features/profile/pages/profile-page.jsx`
  - API: `PUT /api/v1/auth/profile` in backend auth module
- [x] Component-based architecture  
  - Paths: `client/src/features/*`, `client/src/shared/components/*`
- [x] Responsive design  
  - Files: `client/src/styles/index.css`, `client/src/main.jsx` (Bootstrap import)
- [x] SPA routing with redirects/protected routing  
  - Files: `client/src/app/routes.jsx`, `client/src/shared/components/layout/protected-route.jsx`
- [x] Forms with Formik and validation  
  - Files:
    - `client/src/features/auth/pages/login-page.jsx`
    - `client/src/features/auth/pages/register-page.jsx`
    - `client/src/features/profile/pages/profile-page.jsx`
    - `client/src/features/courses/pages/studio-page.jsx`
- [x] State management using React built-ins  
  - Files: `client/src/features/auth/auth-context.jsx` + local `useState` in pages
- [x] User-facing error handling  
  - Files: `client/src/shared/utils/response.js`, `client/src/api/http-client.js`, form/page components

## Bonus (Implemented)

- [x] Environment variables for sensitive configuration  
  - File: `src/config/env.js`
- [x] Endpoint tests  
  - Files:
    - `tests/api/app-root.test.js`
    - `tests/api/auth-routes.test.js`
    - `tests/api/book-routes.test.js`
    - `tests/api/review-routes.test.js`

## Bonus (Documentation Artifacts Added)

- [x] Swagger spec file  
  - File: `swagger.json`
- [x] Postman collection file  
  - File: `postman_collection.json`
