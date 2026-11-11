# StockFlow – Inventory Management System

StockFlow is a full-stack inventory management application I built as part of my **Codveda Technologies Full Stack Development Internship**.

The idea behind StockFlow is to give businesses a straightforward way to manage their inventory, keep track of stock levels, monitor product values and manage user access from one dashboard.

The project started with a basic product management API and gradually grew into a complete application with a React frontend, user authentication, administrative features and real-time notifications. It is now deployed and accessible online.

## About the Project

StockFlow is built with React, Node.js, Express.js and MySQL. It uses a client-server architecture, with the frontend communicating with a backend REST API and a database responsible for storing application data.

Some of the main things users can do with StockFlow include:

- Add, view, update and delete inventory products.
- Monitor stock levels and inventory value.
- View statistics on the dashboard.
- Register and log in securely.
- Access features based on their assigned user roles.
- Manage user accounts through an administrator interface.
- Receive real-time notifications without refreshing the application.



## Technologies and Tools

These are the main technologies I used while building the application.

### Frontend

- **React.js** – Used to build the user interface and reusable components.
- **Vite** – Used as the frontend development and build tool.
- **JavaScript** – Used for application logic and interactions.
- **HTML5 and CSS3** – Used to structure and style the interface.
- **[Socket.IO](http://Socket.IO) Client** – Handles real-time communication with the backend.



### Backend

- **Node.js** – Provides the server-side runtime.
- **Express.js** – Used to build the REST API and handle application routes.
- **[Socket.IO](http://Socket.IO)** – Enables real-time communication and notifications.
- **JSON Web Tokens (JWT)** – Used for user authentication.
- **bcryptjs** – Used to hash passwords before storing them.
- **Multer** – Handles file uploads.
- **dotenv** – Loads configuration values from environment variables.
- **mysql2** – Connects the backend to the database.



### Database

- **MySQL** – Used for local development and database management.
- **TiDB Cloud** – Provides the MySQL-compatible cloud database used in production.



### Development and Deployment

- **Cursor IDE** – Used for writing and managing the project code.
- **Git and GitHub** – Used for version control and source code hosting.
- **Postman and browser-based testing** – Used to test API endpoints and application functionality.
- **Render** – Used to host the frontend and backend.
- **TiDB Cloud** – Used to host the production database.

---



# Internship Tasks and Implementation

The internship work was divided into three levels, with each level building on the previous one.

## Level 1 – Basic



### Task 1: Development Environment Setup

I started by preparing the development environment and making sure all the tools needed for the project were installed and working.

This involved:

- Installing and configuring Node.js and npm.
- Setting up Cursor IDE.
- Configuring Git and GitHub.
- Installing and configuring MySQL.
- Connecting a Node.js application to a MySQL database.
- Using dotenv to manage environment variables.



### Task 2: Express.js REST API Development

Once the environment was ready, I built a product management API using Express.js and MySQL.

The API supports the main CRUD operations:

- Creating new products.
- Retrieving product records.
- Updating existing products.
- Deleting products.

I also connected the API to the MySQL database and added error handling and appropriate HTTP status responses.

## Level 2 – Intermediate

At this stage, I expanded the project by introducing a React frontend, authentication and a more complete inventory dashboard.

### Task 1: Frontend Development and API Integration

I built a React-based interface and connected it to the Express.js backend.

The frontend includes:

- Reusable React components.
- An inventory dashboard.
- A product management interface.
- Communication with the backend API.
- Dynamic rendering of database information.
- Loading and error states.
- Product search and filtering.



### Task 2: Authentication and Role-Based Access Control

I added an authentication system that separates administrator accounts from ordinary user accounts.

The authentication system includes:

- User registration and login.
- Password hashing using bcryptjs.
- JWT-based authentication.
- HTTP-only authentication cookies.
- Protected API endpoints.
- Role-based authorization.
- Session validation.
- Account activation and deactivation.
- Access restrictions for deactivated accounts.



#### Administrator access

Administrators have additional permissions that allow them to:

- View registered users.
- Manage user accounts.
- Activate and deactivate accounts.
- Manage inventory products.
- Access administrator-only functionality.



#### Ordinary user access

Ordinary users can log in and use the inventory features permitted by their assigned role.

They cannot access administrator-only functionality or view administrative user-management data.

### Task 3: Dashboard and Inventory Management

I also developed a dashboard that retrieves information from the database and presents a summary of the current inventory.

The dashboard displays:

- Total number of products.
- Total number of product categories.
- Total inventory value.
- Number of low-stock products.

Other inventory features include:

- Adding, editing and deleting products.
- Updating dashboard statistics after product changes.
- Calculating inventory values dynamically.
- Searching and filtering products.
- Handling an empty inventory.
- Displaying accurate zero-value statistics when no products exist.



### Security and Access Control Testing

I tested the authentication and authorization features to make sure users could only access functionality permitted by their roles.

The tests covered:

1. Successful user registration and login.
2. Access to protected routes after authentication.
3. Separation of administrator and ordinary user permissions.
4. Restriction of administrative data from ordinary users.
5. Activation and deactivation of user accounts.
6. Blocking access for deactivated accounts.
7. HTTP 403 Forbidden responses for unauthorized or deactivated account access.
8. Dashboard updates after product modifications.
9. Correct dashboard statistics when all products are deleted.



## Level 3 – Advanced

For the final level, I extended StockFlow with cloud deployment and real-time communication.

### Task 1: Full-Stack Application Deployment

I deployed StockFlow so that the frontend, backend and database could work together in a production environment.

The deployment uses:

- **Render Static Site** for the React frontend.
- **Render Web Service** for the Express.js backend.
- **TiDB Cloud Starter** for the production database.

Some of the work involved:

- Building the frontend for production.
- Deploying the Express.js backend.
- Connecting the backend to the cloud database.
- Configuring production environment variables.
- Setting up SSL/TLS for secure database connections.
- Configuring Cross-Origin Resource Sharing (CORS).
- Configuring authentication cookies for production.
- Connecting the deployed frontend to the backend.
- Testing login, dashboard statistics and application connectivity in production.



### Task 2: Real-Time Communication Using [Socket.IO](http://Socket.IO)

I integrated [Socket.IO](http://Socket.IO) to allow the server and connected users to communicate in real time.

This made it possible for administrators to send notifications to users without requiring them to refresh the application.

The notification system includes:

- [Socket.IO](http://Socket.IO) integration on the backend and frontend.
- Authenticated socket connections.
- User-specific notification rooms.
- Real-time administrator-to-user notifications.
- Saving notifications in the database.
- A notification dropdown in the interface.
- Unread notification counts.
- Notification read-state management.
- Live notification updates without manually refreshing the page.
- Socket connection status indicators.
- Notification toast messages and sound alerts.



### Level 3 Production Testing

After deployment, I tested the live application to make sure the features worked outside the local development environment.

The tests confirmed:

1. Successful login and authentication in production.
2. Communication between the deployed frontend and backend.
3. Successful retrieval of dashboard statistics.
4. Product creation, editing and deletion.
5. Category management.
6. Administrator user management.
7. Real-time notification delivery.
8. Notification read-state functionality.
9. Protected route access.
10. Successful logout and restriction of unauthenticated access.

---



## Application Architecture

StockFlow uses a client-server architecture. The React frontend communicates with the Express.js backend through REST API requests, while [Socket.IO](http://Socket.IO) handles real-time communication.

The backend also connects to the database to retrieve and store application information.

```
StockFlow
│
├── Frontend
│   ├── React
│   ├── Vite
│   ├── Components
│   ├── Dashboard
│   └── Socket.IO Client
│
├── Backend
│   ├── Node.js
│   ├── Express.js
│   ├── REST API Routes
│   ├── Authentication Middleware
│   ├── Authorization Middleware
│   └── Socket.IO Server
│
└── Database
    ├── Users
    ├── Products
    └── Notifications
```



## Repository Structure

The GitHub repository contains the three internship levels. The following shows the main structure of the Level 3 project:

```
Codveda-Full-Stack/
│
├── Level-1-Basic/
│
├── Level-2-Intermediate/
│   ├── backend/
│   ├── client/
│   └── README.md
│
├── Level-3-Advanced/
│   ├── backend/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── db.js
│   │   ├── server.js
│   │   ├── socket.js
│   │   ├── create-notifications.sql
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   ├── client/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── vite.config.js
│   │
│   └── README.md
│
└── .gitignore
```



## Database

StockFlow uses MySQL for local development and TiDB Cloud for its production database.

The database stores information about:

- User accounts and authentication-related data.
- Inventory products.
- Notifications.

The production database is hosted on TiDB Cloud and communicates with the backend through a secure SSL/TLS connection.

Database credentials and other sensitive configuration values are managed through environment variables. They are not included in the public GitHub repository.

## Running StockFlow Locally

If you want to run the Level 3 application on your own computer, you will need Node.js, npm, MySQL and Git installed.

### Prerequisites

- Node.js and npm.
- MySQL Server.
- Git.
- Cursor IDE or another code editor.



### 1. Clone the repository

Open a terminal and run:

```
git clone https://github.com/semahle2000/Codveda-Full-Stack.git
cd Codveda-Full-Stack
```



### 2. Set up the backend

Navigate to the Level 3 backend directory:

```
cd Level-3-Advanced/backend
```

Install the required dependencies:

```
npm install
```

Create a `.env` file inside the backend directory and add your local database configuration:

```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=my_mysql_Username
DB_PASSWORD=my_password
DB_NAME=codveda_db
DB_SSL=false
JWT_SECRET=my_secure_jwt_secret
CLIENT_URL=http://localhost:5173
```

Make sure MySQL is running and that the required database and tables have been created.

Start the backend server:

```
npm start
```



### 3. Set up the frontend

Open a second terminal and navigate to the Level 3 client directory:

```
cd Level-3-Advanced/client
```

Install the frontend dependencies:

```
npm install
```

Create a `.env` file inside the client directory with the backend API address:

```
VITE_API_URL=http://localhost:4000
```

Start the frontend development server:

```
npm run dev
```

Vite will display a local URL in the terminal. Open that address in your browser to access StockFlow.

**Important:** The backend and frontend must both be running. The backend must also have a valid database connection.

Never commit `.env` files or expose database passwords, JWT secrets or other sensitive credentials.

## Production Deployment

StockFlow is hosted using Render and TiDB Cloud.


| Component | Hosting platform   |
| --------- | ------------------ |
| Frontend  | Render Static Site |
| Backend   | Render Web Service |
| Database  | TiDB Cloud Starter |


The deployed backend is available at:

[https://stockflow-backend-pto1.onrender.com](https://stockflow-backend-pto1.onrender.com)

The backend also provides a database connectivity test endpoint:

[https://stockflow-backend-pto1.onrender.com/api/test-db](https://stockflow-backend-pto1.onrender.com/api/test-db)

The production frontend address can be found in the Render Static Site dashboard.

Production settings, including database credentials and authentication secrets, are configured through the deployment platform's environment variables.

## Security

Security was an important part of building StockFlow, particularly because the application supports different user roles and stores account information.

The application uses:

- bcryptjs for password hashing.
- JWT-based authentication.
- HTTP-only authentication cookies.
- Secure production cookie settings.
- Protected API endpoints.
- Role-based authorization.
- Server-side access validation.
- User account activation and deactivation.
- SSL/TLS database connections.
- Environment variables for sensitive configuration.
- Git exclusions for `.env` files and `node_modules`.



## Possible Future Improvements

Although the main internship requirements have been implemented, there is still room to improve StockFlow.

Some possible additions include:

- More advanced inventory analytics and reporting.
- Persistent cloud storage for uploaded profile pictures.
- Automated database backups.
- Further performance optimization.
- Additional notification preferences.



## Internship Information

**Organization:** Codveda Technologies

**Program:** Full Stack Development Internship

**Project:** StockFlow – Inventory Management System

**Completed Levels:**

- Level 1 – Basic
- Level 2 – Intermediate
- Level 3 – Advanced



## Author

Built as part of the Codveda Technologies Full Stack Development Internship.

**GitHub Repository:**

[https://github.com/semahle2000/Codveda-Full-Stack](https://github.com/semahle2000/Codveda-Full-Stack)
