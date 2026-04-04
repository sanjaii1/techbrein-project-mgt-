# Techbrein Project Management System

A robust, enterprise-grade project management platform built with a modern tech stack and Clean Architecture principles.

---

## 🏛️ Architecture Overview

The system is designed using a **Layered Architecture (Controller-Service-Repository)** to ensure scalability, maintainability, and clear separation of concerns.

### Backend Architecture (Node.js/Express)
- **Controller Layer**: Handles HTTP requests, validates input, and orchestrates the flow.
- **Service Layer**: Contains core business logic and rules.
- **Repository Layer**: Abstracts data access using Prisma ORM, providing a clean interface for database operations.
- **Role-Based Access Control (RBAC)**: Secure access restricted to roles: `admin`, `manager`, and `user`.
- **Validation Middleware**: Centralized validation for request bodies using standard middleware.
- **Swagger Integration**: Interactive API documentation for easy testing.
- **Standardized Responses**: All API responses follow a consistent format for success and error scenarios, including pagination metadata.

### Frontend Architecture (Next.js)
- **App Router**: Modern React framework with server-side rendering capabilities.
- **Component-Driven UI**: Reusable, modular components for dashboards, sidebars, and data tables.
- **Direct API Integration**: Axios-based client for seamless communication with the backend.
- **Dynamic Styling**: Tailored experience with Tailwind CSS 4 and Ant Design.

---

## 📊 Database Schema (ER Diagram)

The system uses a PostgreSQL database with the following entity relationships:

```mermaid
erDiagram
    USER ||--o{ TASK : "assigned to"
    USER ||--o{ PROJECT : "creates (ProjectCreator)"
    USER ||--o{ PROJECT : "manages (ProjectManager)"
    PROJECT ||--o{ TASK : "contains"

    USER {
        int id PK
        string name
        string email UK
        string password
        string role
    }

    PROJECT {
        int id PK
        string name
        string description
        int createdBy FK
        int managerId FK
    }

    TASK {
        int id PK
        string title
        string description
        string status
        int projectId FK
        int assignedTo FK
        datetime dueDate
    }
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- npm or yarn

### 1. Backend Setup
```bash
cd backend
# Install dependencies
npm install

# Configure Environment Variables
# Create a .env file with:
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
# JWT_SECRET="your_secret_key"
# PORT=5000

# Initialize Database (Prisma)
npx prisma generate
npx prisma db push

# Start Development Server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Start Development Server
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

---

## 📑 API Documentation

The API follows RESTful principles and uses Bearer Token authentication for secured endpoints.

### 🌐 Interactive Swagger UI
The full interactive API documentation is available at:
👉 **`http://localhost:5000/api-docs`**

### Core Modules
| Module | Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Create a new user account | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate and receive JWT | Public |
| **Projects** | `GET` | `/api/projects` | Get all projects (paginated) | `admin`, `manager`, `user` |
| **Projects** | `POST` | `/api/projects` | Create a new project | `admin`, `manager` |
| **Tasks** | `GET` | `/api/tasks` | Filterable list of tasks | `admin`, `manager`, `user` |
| **Tasks** | `PATCH` | `/api/tasks/:id/status` | Update task status | `admin`, `manager`, `user` |
| **Users** | `GET` | `/api/users` | List all system users | `admin` |
| **Users** | `DELETE` | `/api/users/:id` | Remove a user | `admin` |

> [!TIP]
> A complete Postman collection is available in the root directory: `Techbrein_Project_Mgt.postman_collection.json`. Import it for quick testing.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15+, React 19, Tailwind CSS 4, Ant Design
- **Backend**: Node.js, Express 5, Prisma ORM
- **Database**: PostgreSQL
- **Security**: JWT (JSON Web Tokens), Bcrypt.js, RBAC
- **Documentation**: Swagger/OpenAPI, Postman
