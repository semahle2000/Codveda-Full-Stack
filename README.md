# Codveda Full Stack Development Internship

## About

This repository documents my progress during the Codveda Technologies Full Stack Development Internship.

For my first task, I focused on setting up my development environment and getting the tools I need for full-stack development working together.

I wanted to understand the setup process properly, from running my first JavaScript file to connecting a Node.js application to a MySQL database.

## Technologies Used

- **Node.js** – Running JavaScript outside the browser.
- **npm** – Managing project dependencies.
- **Cursor** – Writing and managing my code.
- **Git** – Tracking changes and managing versions.
- **GitHub** – Hosting my project.
- **MySQL 8.0** – Managing the database.
- **mysql2** – Connecting Node.js to MySQL.
- **dotenv** – Managing database configuration securely.

## Setting Up the Project

I started by creating a project directory called `Codveda-Full-Stack` and initialising it as a Node.js project.

To make sure Node.js was working, I created a simple `app.js` file and ran it from the terminal.

The application printed:

Hello Codveda!

My Full Stack Development journey starts here.

After that, I initialised npm and installed the packages required for database connectivity.

## Working with MySQL

I installed MySQL 8.0 and created a database named `codveda_db`.

I then installed the `mysql2` package to allow my Node.js application to communicate with the database.

I created a separate `db.js` file to test the connection. After configuring the database credentials using `dotenv`, I successfully connected to MySQL and retrieved the server version.

Getting this connection to work was an important part of the task because it gave me practical experience with how Node.js and MySQL interact.

## Project Structure

```
Codveda-Full-Stack/
│
├── app.js
├── db.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

The `.env` file is kept locally and excluded from the repository because it contains database credentials.

The `node_modules` directory is also excluded because project dependencies can be installed again through npm.

## Git and GitHub

I initialised Git in my project directory, tracked my files and created an initial commit.

I then created a GitHub repository and pushed my project to it.

I also configured `.gitignore` to prevent sensitive credentials and unnecessary dependency files from being uploaded.

**Repository:** [hodveda-Full-Stttps://github.com/semahle2000/Codveda-Full-StackC](https://github.com/semahle2000/Codveda-Full-Stack) 

## What I Took Away From This Task

This task gave me a practical introduction to preparing a development environment for full-stack development.

I worked with Node.js and npm, learned how to manage a project using Git, published my code on GitHub and connected a Node.js application to MySQL.

I also became more familiar with environment variables and the importance of keeping database credentials out of a public repository.

Although this was an environment setup task, it gave me a foundation to build on as I move towards developing backend applications and working with databases.

## Internship Information

**Organisation:** Codveda Technologies

**Programme:** Full Stack Development Internship

**Level:** Level 1

**Task:** Task 1 – Setup Development Environment

This is the beginning of my journey with Codveda Technologies. I'm looking forward to applying what I've learned and improving my development skills through the upcoming tasks.