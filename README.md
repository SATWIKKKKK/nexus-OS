# NexusOS

A full-stack CRM dashboard built with React, Node.js, Express, and MongoDB Atlas.

## Features

- JWT Authentication with secure login and signup
- CRUD Operations for Leads, Tasks, and Users
- Responsive Design across desktop, tablet, mobile, and small screens
- Collapsible Sidebar on desktop with hamburger menu on mobile/tablet
- Lead Pipeline tracking: New, Contacted, Qualified, Negotiation, Closed Won, Closed Lost
- Task Management with priority levels and status tracking
- Dashboard Overview with stat cards, recent activity, and data tables
- Dark themed UI with custom fonts and CSS variables

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, React Router 6, Axios, Vite   |
| Backend  | Node.js, Express 4, Mongoose 8          |
| Database | MongoDB Atlas                           |
| Auth     | bcryptjs, jsonwebtoken                  |
| Styling  | Custom CSS with CSS variables           |

## Project Structure

```
backend/
  src/
    server.js
    config/db.js
    middleware/auth.js
    models/          (Lead, Task, User)
    controllers/     (auth, dashboard, lead, task, user)
    routes/          (auth, dashboard, leads, tasks, users)
    seed.js

frontend/
  src/
    App.jsx
    main.jsx
    index.css
    context/AuthContext.jsx
    pages/           (LoginPage, SignupPage, DashboardPage)
    components/      (ProtectedRoute)
    utils/api.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/SATWIKKKKK/nexus-OS.git
   cd nexus-OS
   ```

2. Install dependencies
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Configure environment variables

   Create `backend/.env`:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. Seed the database
   ```bash
   cd backend
   node src/seed.js
   ```

5. Run the app
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

   Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

## API Endpoints

### Auth
| Method | Endpoint             | Description       |
|--------|----------------------|-------------------|
| POST   | `/api/auth/register` | Create account    |
| POST   | `/api/auth/login`    | Login             |
| GET    | `/api/auth/me`       | Get current user  |
| POST   | `/api/auth/logout`   | Logout            |

### Dashboard
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/api/dashboard`  | Aggregated dashboard data |

### Leads
| Method | Endpoint          | Description     |
|--------|-------------------|-----------------|
| GET    | `/api/leads`      | List all leads  |
| POST   | `/api/leads`      | Create a lead   |
| PUT    | `/api/leads/:id`  | Update a lead   |
| DELETE | `/api/leads/:id`  | Delete a lead   |

### Tasks
| Method | Endpoint          | Description     |
|--------|-------------------|-----------------|
| GET    | `/api/tasks`      | List all tasks  |
| POST   | `/api/tasks`      | Create a task   |
| PUT    | `/api/tasks/:id`  | Update a task   |
| DELETE | `/api/tasks/:id`  | Delete a task   |

### Users
| Method | Endpoint          | Description     |
|--------|-------------------|-----------------|
| GET    | `/api/users`      | List all users  |
| PUT    | `/api/users/:id`  | Update a user   |
| DELETE | `/api/users/:id`  | Delete a user   |

## Seeded Accounts

| Name            | Email              | Password    |
|-----------------|--------------------|-------------|
| Satwik Chandra  | satwik@nexusos.com | satwik123   |
| Rahul Verma     | rahul@nexusos.com  | rahul123    |
| Priya Singh     | priya@nexusos.com  | priya123    |

## Deployment

The app is deployed on Vercel. The backend runs as a serverless Express app and the frontend is a static Vite build.

Environment variables required on Vercel:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret key for JWT tokens
- `NODE_ENV` — Set to `production`
- `VITE_API_URL` — Backend API URL (for frontend build)
