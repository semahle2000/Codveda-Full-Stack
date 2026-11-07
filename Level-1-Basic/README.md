# Codveda Full Stack Development Internship

## About

This repository documents my progress during the Codveda Technologies Full Stack Development Internship.

Throughout this internship, I am developing practical skills in full-stack development by setting up development tools, building backend applications, working with databases and learning how different technologies work together.

For my first two tasks, I focused on setting up my development environment and building a Product Management REST API using Node.js, Express.js and MySQL.

I wanted to understand the development process properly, from running my first JavaScript file to creating API endpoints that communicate with a database.

## Technologies Used

- **Node.js** – Running JavaScript outside the browser.
- **npm** – Managing project dependencies.
- **Express.js** – Building REST APIs and handling HTTP requests.
- **Cursor** – Writing and managing my code.
- **Git** – Tracking changes and managing versions.
- **GitHub** – Hosting my project.
- **MySQL 8.0** – Managing the database.
- **mysql2** – Connecting Node.js to MySQL.
- **dotenv** – Managing database configuration securely.



# Level 1 – Task 1: Setup Development Environment



## Setting Up the Project

I started by creating a project directory called `Codveda-Full-Stack` and initialising it as a Node.js project.

To make sure Node.js was working, I created a simple `app.js` file and ran it from the terminal.

The application printed:

```
Hello Codveda!
My Full Stack Development journey starts here.
```

After that, I initialised npm and installed the packages required for database connectivity.

## Working with MySQL

I installed MySQL 8.0 and created a database named `codveda_db`.

I then installed the `mysql2` package to allow my Node.js application to communicate with the database.

I created a separate `db.js` file to manage the database connection. After configuring the database credentials using `dotenv`, I successfully connected to MySQL and retrieved database records.

Getting this connection to work was an important part of the task because it gave me practical experience with how Node.js and MySQL interact.

## Git and GitHub

I initialised Git in my project directory, tracked my files and created an initial commit.

I then created a GitHub repository and pushed my project to it.

I also configured `.gitignore` to prevent sensitive credentials and unnecessary dependency files from being uploaded.

# Level 1 – Task 2: Build a REST API Using Express.js



## Project Overview

For my second task, I developed a Product Management REST API using Node.js, Express.js and MySQL.

The purpose of this application is to manage product records stored in a MySQL database. It allows users to create, retrieve, update and delete products through HTTP requests.

This task helped me understand how a backend application receives requests, processes information and communicates with a database before returning responses.

## Database Design

I used the existing `codveda_db` database and created a table called `products`.

The products table contains the following fields:


| Field      | Description                |
| ---------- | -------------------------- |
| `id`       | Unique product identifier  |
| `name`     | Product name               |
| `price`    | Product price              |
| `quantity` | Available product quantity |


I inserted sample products into the database to test the API.

## REST API Endpoints

I implemented the four main CRUD operations:


| HTTP Method | Endpoint            | Description                |
| ----------- | ------------------- | -------------------------- |
| GET         | `/api/products`     | Retrieve all products      |
| GET         | `/api/products/:id` | Retrieve a product by ID   |
| POST        | `/api/products`     | Create a new product       |
| PUT         | `/api/products/:id` | Update an existing product |
| DELETE      | `/api/products/:id` | Delete a product           |




## Error Handling and Validation

I implemented input validation to prevent invalid product information from being inserted into the database.

The API also handles situations such as invalid product IDs and products that do not exist.

The following HTTP status codes are used:

- **200 – OK:** Request completed successfully.
- **201 – Created:** A new product was created successfully.
- **400 – Bad Request:** Invalid input or product ID.
- **404 – Not Found:** Requested product or endpoint does not exist.
- **500 – Internal Server Error:** Unexpected server or database errors.



## Testing

I tested the API using PowerShell HTTP requests.

The tests included:

- Retrieving all products.
- Retrieving an individual product by ID.
- Creating a new product.
- Updating an existing product.
- Deleting a product.
- Testing invalid product IDs.
- Testing requests for products that do not exist.
- Submitting invalid product information.

The CRUD operations and error-handling tests produced the expected results.

# Project Structure

The project contains the following main files:

```
Codveda-Full-Stack/
│
├── app.js
├── server.js
├── db.js
├── test-db.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

The `.env` file is kept locally and excluded from the repository because it contains database credentials.

The `node_modules` directory is also excluded because project dependencies can be installed again through npm.

## Running the Project Locally



### 1. Clone the repository

```
git clone https://github.com/semahle2000/Codveda-Full-Stack.git
```



### 2. Navigate into the project directory

```
cd Codveda-Full-Stack
```



### 3. Install dependencies

```
npm install
```



### 4. Configure environment variables

Create a `.env` file in the project root:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mypassword
DB_NAME=codveda_db
```



### 5. Create the database and products table

Run the following SQL commands in MySQL:

```
CREATE DATABASE codveda_db;

USE codveda_db;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0
);
```



### 6. Start the API server

```
node server.js
```

The server runs on:

```
http://localhost:3000
```

The products endpoint is:

```
http://localhost:3000/api/products
```



# What I Took Away From These Tasks

These tasks gave me practical experience with preparing a development environment and building a backend application.

I worked with Node.js and npm, learned how to manage a project using Git, published my code on GitHub, connected a Node.js application to MySQL and developed REST API endpoints using Express.js.

One of the most important things I learned was how different parts of a backend application work together, from receiving an HTTP request to executing a database query and returning a response.

I also gained a better understanding of CRUD operations, input validation, HTTP status codes, error handling and database connectivity.

These experiences have given me a foundation to continue developing my backend and full-stack development skills.

# Internship Information

**Organisation:** Codveda Technologies

**Programme:** Full Stack Development Internship

**Level:** Level 1

**Completed Tasks:**

- Task 1 – Setup Development Environment
- Task 2 – Build a REST API Using Express.js

**GitHub Repository: [https://github.com/semahle2000/Codveda-Full-Stack.git**C](https://github.com/semahle2000/Codveda-Full-Stack.git)

This is part of my development journey with Codveda Technologies. I look forward to applying what I have learned, taking on more challenging development projects and continuously improving my programming skills.
