# Fistum Portfolio Website

A production-style personal portfolio and admin dashboard built with Node.js, Express.js, PostgreSQL, and Sequelize. The project is designed to showcase a fullstack developer's work, support recruiter-friendly portfolio content, and provide a secure admin backend for managing projects and service requests.

## Overview

This project combines:

- a premium public portfolio landing page served from Express static files
- a versioned REST API under `/api/v1`
- JWT-based admin authentication
- PostgreSQL persistence with Sequelize migrations and seeders
- a clean MVC architecture with validation, rate limiting, and error handling
- an admin dashboard for managing projects and incoming service requests

The main goal is to demonstrate that the developer can build a full professional web application with backend structure, security, API design, and deployment-ready configuration.

## Features

- Public portfolio homepage with sections for intro, expertise, projects, and contact CTA
- Admin-only login and protected dashboard area
- CRUD operations for portfolio projects
- Service request form for employers or clients
- Request status management from the dashboard
- JWT authentication with protected routes
- Password hashing with bcrypt
- Input validation using Express Validator
- Helmet, CORS, gzip compression, and request rate limiting
- PostgreSQL database setup using Sequelize migration files
- Static asset hosting for the public frontend and uploaded images

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM + Sequelize CLI
- JWT
- bcrypt
- dotenv
- Express Validator
- Helmet
- CORS
- Express Rate Limit
- Morgan
- Multer
- Nodemailer
- Vanilla HTML, CSS, and JavaScript for the frontend

## MVC + Project Structure

```text
.
├── public/
│   ├── admin/
│   │   ├── login.html
│   │   └── dashboard.html
│   ├── css/
│   │   ├── admin.css
│   │   └── style.css
│   ├── js/
│   │   ├── admin.js
│   │   └── main.js
│   ├── images/
│   ├── uploads/
│   └── index.html
├── src/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── serviceRequestController.js
│   ├── middlewares/
│   │   ├── authenticate.js
│   │   ├── authorizeRole.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   ├── rateLimiter.js
│   │   ├── upload.js
│   │   └── validate.js
│   ├── migrations/
│   │   ├── 20261028000001-create-users.js
│   │   ├── 20261028000002-create-projects.js
│   │   └── 20261028000003-create-service-requests.js
│   ├── models/
│   │   ├── index.js
│   │   ├── project.js
│   │   ├── servicerequest.js
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── index.js
│   │   ├── projectRoutes.js
│   │   └── serviceRequestRoutes.js
│   ├── seeders/
│   │   ├── 20261028000001-admin-user.js
│   │   └── 20261028000002-sample-projects.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   ├── mailer.js
│   │   └── response.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── projectValidator.js
│   │   └── serviceRequestValidator.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── .sequelizerc
├── package.json
├── README.md
└── docs/
    └── postman/
        └── portfolio-api-collection.json
```

### Folder responsibilities

- `src/config`: database config and environment handling
- `src/models`: Sequelize models + table definitions
- `src/migrations`: schema versioning and database changes
- `src/seeders`: initial data such as the admin user and example projects
- `src/controllers`: request logic kept thin and focused
- `src/routes`: API endpoints grouped by feature
- `src/middlewares`: auth, validation, upload handling, and error flows
- `src/validators`: sanitization and request validation
- `src/utils`: reusable helper logic and response formatting
- `public`: static portfolio and admin pages

## Setup Instructions

### 1. Clone the project

```bash
git clone <repo-url>
cd Fistum's-Personal-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the PostgreSQL database

Create a local database in PostgreSQL before running the app:

```sql
CREATE DATABASE "Fise-web_development";
```

### 4. Configure environment variables

Copy the example file and update the values:

```bash
cp .env.example .env
```

Then modify your `.env` file with your local database and app config:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Fise-web_development
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CLIENT_URL=http://localhost:3000
ADMIN_NAME=Fistum
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password
```

### 5. Run migrations

```bash
npm run db:migrate
```

### 6. Seed the database

```bash
npm run db:seed
```

This creates the admin user and sample projects.

### 7. Start the app

For development:

```bash
npm run dev
```

Or run production mode:

```bash
npm start
```

Then open:

- public portfolio: `http://localhost:5000/`
- admin login: `http://localhost:5000/admin/login.html`

## API Documentation

Base URL: `/api/v1`

| Method | Route                          | Access     | Description                               |
| ------ | ------------------------------ | ---------- | ----------------------------------------- |
| GET    | `/health`                      | Public     | Liveness check for the app                |
| POST   | `/auth/login`                  | Public     | Login with email/password and receive JWT |
| GET    | `/auth/me`                     | Admin only | Get the current authenticated user        |
| GET    | `/projects`                    | Public     | List portfolio projects                   |
| GET    | `/projects/:slug`              | Public     | Fetch a single project by slug            |
| POST   | `/projects`                    | Admin only | Create a new project                      |
| PUT    | `/projects/:id`                | Admin only | Update a project                          |
| DELETE | `/projects/:id`                | Admin only | Delete a project                          |
| POST   | `/service-requests`            | Public     | Submit a contact / service request        |
| GET    | `/service-requests`            | Admin only | List service requests                     |
| GET    | `/service-requests/stats`      | Admin only | Return dashboard stats                    |
| GET    | `/service-requests/:id`        | Admin only | View one request                          |
| PATCH  | `/service-requests/:id/status` | Admin only | Update request status                     |
| DELETE | `/service-requests/:id`        | Admin only | Delete a request                          |

### Example request payloads

#### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "replace-with-your-admin-password"
  }'
```

#### Submit service request

```bash
curl -X POST http://localhost:5000/api/v1/service-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+123456789",
    "serviceType": "Website Development",
    "budgetRange": "$2k - $5k",
    "message": "I want to build a custom portfolio site."
  }'
```

#### Create project (admin)

```bash
curl -X POST http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "title=API Platform" \
  -F "description=Modern backend platform" \
  -F "longDescription=A production-ready platform for managing operations and analytics." \
  -F "featured=true" \
  -F "displayOrder=1" \
  -F "liveUrl=https://example.com" \
  -F "repoUrl=https://github.com/example/api-platform" \
  -F "techStack=Node.js" \
  -F "techStack=PostgreSQL" \
  -F "techStack=Express" \
  -F "image=@./path/to/project-image.jpg"
```

## Security Measures

This project includes the following protections:

- JWT authentication for admin routes
- bcrypt password hashing before storing user credentials
- Helmet for HTTP header hardening
- CORS configuration with a defined client origin
- express-rate-limit to reduce abuse and brute-force attempts
- input validation middleware for login, projects, and service requests
- role-based authorization for admin-only endpoints
- structured error responses instead of raw stack traces in production

## What This Project Demonstrates

This portfolio is designed to communicate the following to recruiters and hiring managers:

- strong backend architecture and clean separation of concerns
- real-world API design with versioning and route grouping
- production-minded practices such as validation, auth, and security
- relational database modeling and migration workflows
- ability to build both a public-facing product and an internal admin dashboard
- understanding of fullstack integration: frontend static pages calling a backend API
- practical experience with deployment-oriented configuration and environment management

## Screenshot Placeholders

Add your own screenshots here once the project is ready to present:

- Homepage hero section
- Portfolio project cards section
- Project detail or modal view
- Admin login screen
- Admin dashboard overview
- Project manager modal
- Service request management table

```text
[Homepage Screenshot Placeholder]
[Admin Dashboard Screenshot Placeholder]
[Project CRUD Screenshot Placeholder]
```

## Future Improvements

- Move uploaded images to Cloudinary or S3 for reliable asset storage
- Add project categories and filtering by technology
- Add pagination and search to the admin project and request views
- Introduce email templates and richer notification flows
- Add automated tests with Jest or Supertest
- Add CI/CD pipeline for linting and deployment checks
- Improve analytics and admin KPIs for portfolio traffic
- Add a public contact form with honeypot protection and spam filtering

## Deployment Guide: Render

This app is deployment-ready for Render with a web service and a managed PostgreSQL database.

### 1. Prepare the codebase

Ensure the project is committed and the `.env` file is not pushed. Your `.gitignore` already excludes `.env`.

### 2. Create a Render Web Service

1. Log into Render.
2. Click New + > Web Service.
3. Connect your GitHub repository.
4. Select the repository containing this project.
5. Set the build command:

```bash
npm install
npm run db:migrate
```

6. Set the start command:

```bash
npm start
```

### 3. Add Render environment variables

In the Render dashboard, add these environment variables:

```env
PORT=10000
NODE_ENV=production
DB_HOST=<your-render-postgres-host>
DB_PORT=5432
DB_NAME=<your-database-name>
DB_USER=<your-database-user>
DB_PASSWORD=<your-database-password>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CLIENT_URL=https://your-render-app-url.onrender.com
ADMIN_NAME=Fistum
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password
```

### 4. Create a managed PostgreSQL database on Render

1. In Render, click New + > PostgreSQL.
2. Choose a plan and create the database.
3. Copy the hostname, database name, user, and password.
4. Paste those values into the web service environment variables.

### 5. Run migrations on deploy

Render executes the start command when the app is launched. You should also run migrations automatically as part of deployment by adding this build step:

```bash
npm install
npm run db:migrate
npm run db:seed
```

If you do not want automatic seed data on production, remove the seed step and only run migrations on first deployment.

### 6. Important storage note

Render's filesystem is ephemeral. That means files uploaded via `multer` and stored under `public/uploads` may disappear after a deploy or restart. For production, move uploaded images to a durable asset service such as:

- Cloudinary
- AWS S3
- DigitalOcean Spaces

This project is already structured so you can swap the local upload directory for a remote CDN later.

### 7. Post-deploy checklist

- Confirm the app boots without errors
- Test `/api/v1/health`
- Test admin login
- Verify project CRUD works
- Verify service request submission and admin review works
- Check CORS and API access rules in production

## Final Review Checklist Before GitHub Push

Before pushing to GitHub, confirm the following:

- [ ] `.env` is not committed and is listed in `.gitignore`
- [ ] `.env.example` contains safe placeholders only
- [ ] The database is created and migrations run successfully from a clean state
- [ ] `npm run db:seed` works on a fresh PostgreSQL database
- [ ] The app starts with `npm run dev` or `npm start`
- [ ] `/api/v1/health` returns success
- [ ] Admin login returns a JWT and dashboard routes work
- [ ] Public portfolio page loads correctly
- [ ] Project creation, update, delete, and listing work
- [ ] Service request submission works and admin status updates work
- [ ] All routes are protected correctly by JWT or public access as intended
- [ ] No hardcoded secrets remain in the repository
- [ ] Screenshots and demo assets are ready if needed for recruiter presentations

## License

This project is licensed under the MIT License.

## Author

Fistum
