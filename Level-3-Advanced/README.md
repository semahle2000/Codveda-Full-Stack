# StockFlow – Inventory Management System

A full-stack inventory management application developed as part of the **Codveda Technologies Full Stack Development Internship**.

StockFlow helps businesses manage products, monitor inventory levels, track stock values, and manage user access through an authenticated dashboard.

## Project Overview

StockFlow is a web-based inventory management system built using React, Node.js, Express.js, and MySQL.

The application provides product management functionality, user authentication, role-based access control, and an administrative dashboard.

## Technologies Used

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt password hashing

### Database

- MySQL
- mysql2
- dotenv

### Development Tools

- Cursor IDE
- Git
- GitHub
- Postman / browser-based testing

---

# Internship Tasks

## Level 1 – Basic

### Task 1: Development Environment Setup

Configured the full-stack development environment.

Completed:

- Installed and configured Node.js and npm.
- Set up Cursor IDE.
- Configured Git and GitHub.
- Installed and configured MySQL.
- Established a MySQL database connection using Node.js.
- Configured environment variables using dotenv.

### Task 2: Express.js REST API Development

Developed a product management REST API using Express.js and MySQL.

Implemented:

- REST API endpoints.
- Product creation.
- Retrieving product records.
- Updating product information.
- Deleting products.
- Database integration.
- Error handling and HTTP status responses.

---

## Level 2 – Intermediate

### Task 1: Frontend Development and API Integration

Developed a React-based frontend and integrated it with the Express.js backend.

Implemented:

- React components and reusable application layouts.
- Dashboard interface.
- Product management interface.
- Frontend-to-backend API communication.
- Dynamic data rendering.
- Loading and error states.
- Product search and filtering functionality.

### Task 2: Authentication and Role-Based Access Control

Implemented an authentication system with administrator and ordinary user roles.

Features include:

- User registration.
- User login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected application routes.
- Role-based authorization.
- Administrator-only functionality.
- User account activation and deactivation.
- Session validation.
- Access restriction for deactivated accounts.

### Administrator Functionality

Administrators have access to administrative features, including:

- Viewing registered users.
- Managing user accounts.
- Activating and deactivating accounts.
- Managing inventory products.
- Accessing administrative functionality unavailable to ordinary users.

### Ordinary User Functionality

Ordinary users can:

- Access the application using their credentials.
- View and interact with permitted inventory functionality.
- Manage products according to their assigned permissions.

Ordinary users cannot access administrator-only functionality or view administrative user-management data.

### Task 3: Dashboard and Inventory Management

Developed a dynamic inventory dashboard that displays information retrieved from the database.

Dashboard statistics include:

- Total products.
- Total inventory value.
- Low-stock products.
- Product categories.

Implemented:

- Automatic dashboard updates after product changes.
- Dynamic inventory calculations.
- Product addition, editing, and deletion.
- Empty inventory handling.
- Accurate zero-value statistics when no products exist.

### Security and Access Control Testing

The following scenarios were tested:

1. Successful user registration and login.
2. Authentication and protected route access.
3. Separation of administrator and ordinary user permissions.
4. Restriction of administrative data from ordinary users.
5. Administrator account activation and deactivation.
6. Access restriction when an account is deactivated.
7. HTTP 403 Forbidden responses for unauthorized or deactivated account access.
8. Dashboard updates after product modifications.
9. Accurate dashboard statistics when all products are deleted.

---

## Application Architecture

The application follows a client-server architecture.

```
StockFlow
│
├── Client
│   ├── React
│   ├── Vite
│   ├── Components
│   └── Dashboard
│
├── Backend
│   ├── Node.js
│   ├── Express.js
│   ├── REST API
│   ├── Authentication Middleware
│   └── Authorization Middleware
│
└── Database
    └── MySQL
```

## Project Structure

```
Level-2-Intermediate/
│
├── backend/
│
├── client/
│
└── README.md
```

## Database

Database name:

codveda_db

MySQL is used to store application data, including product information and user account records.

Database credentials are configured through environment variables and should not be included in the public repository.

## Running the Application

### Prerequisites

- Node.js and npm.
- MySQL Server.
- Cursor IDE or another code editor.

### Backend Setup

1. Open a terminal.
2. Navigate to the backend directory:

```
cd backend
```

1. Install dependencies:

```
npm install
```

1. Configure the database connection in your .env file.
2. Start the backend server:

```
node server.js
```

### Frontend Setup

1. Open another terminal.
2. Navigate to the client directory:

```
cd client
```

1. Install dependencies:

```
npm install
```

1. Start the development server:

```
npm run dev
```

1. Open the local URL provided by Vite in your browser.

**Note:** Ensure that your database is running and that the frontend is configured to communicate with the backend API.

## Security

The application incorporates several security measures:

- Password hashing with bcrypt.
- JWT-based authentication.
- Protected API endpoints.
- Role-based authorization.
- Server-side access validation.
- Environment variables for sensitive configuration.
- Exclusion of .env and node_modules from version control.

## Internship Information

**Organization:** Codveda Technologies

**Program:** Full Stack Development Internship

**Project:** StockFlow – Inventory Management System

**Completed Levels:** Level 1 (Basic) and Level 2 (Intermediate)

## Future Enhancements

Potential future improvements include:

- Real-time inventory notifications.
- Live updates using Socket.io
- Advanced reporting and analytics.
- Application deployment.
- Further performance optimization.

## Author

Developed as part of the Codveda Technologies Full Stack Development Internship.