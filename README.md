# Codveda Full Stack Development Internship

## About This Project

This repository contains my work during the Codveda Technologies Full Stack Development Internship.

I started this project by setting up my development environment and making sure I had the tools needed to begin building full-stack applications.

My main focus for this task was getting Node.js, Git, GitHub and MySQL working together. I also wanted to understand how a Node.js application communicates with a database rather than just installing the tools without knowing what they do.

## Tools I Used

- **Node.js** – To run JavaScript outside the browser.
- **npm** – To install and manage project packages.
- **Cursor** – My code editor.
- **Git** – To track changes in my project.
- **GitHub** – To store and manage my code online.
- **MySQL 8.0** – To create and manage my database.
- **mysql2** – To connect Node.js to MySQL.
- **dotenv** – To keep database configuration in environment variables.

## Getting Started

I created a project folder called `Codveda-Full-Stack` and initialised it as a Node.js project.

I first tested Node.js by creating a simple `app.js` file:

```
console.log("Hello Codveda!");
console.log("My Full Stack Development journey starts here.");
```

I ran the file using:

```
node app.js
```

After confirming that it worked, I initialised npm and installed the packages needed for database connectivity.

## MySQL Database Setup

I installed MySQL 8.0 and created a database called `codveda_db`.

The SQL command I used was:

```
CREATE DATABASE codveda_db;
```

I then installed `mysql2` so that my Node.js application could communicate with MySQL.

I also installed `dotenv` to manage my database credentials separately from my JavaScript code.

## Testing the Database Connection

One of the important parts of this task was testing whether Node.js could actually connect to my MySQL database.

I created a `db.js` file and used it to establish the connection.

I successfully connected to MySQL and retrieved the database server version.

This helped me understand how a backend application communicates with a database.

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

The `.env` file is stored locally and is not included in the GitHub repository.

## Running the Project

If you want to run this project on your own computer:

**1. Clone the repository**

```
git clone https://github.com/semahle2000/Codveda-Full-Stack.git
```

**2. Open the project folder**

```
cd Codveda-Full-Stack
```

**3. Install the dependencies**

```
npm install
```

**4. Create a MySQL database**

```
CREATE DATABASE codveda_db;
```

**5. Create a** `.env` **file**

Add your own MySQL configuration:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mysql_password
DB_NAME=codveda_db
```



**6. Run the application**

```
node app.js
```

To test the database connection:

```
node db.js
```

## GitHub and Project Security

I used Git to track my project changes and pushed the repository to GitHub.

I also created a `.gitignore` file containing:

```
.env
node_modules/
```

This ensures that my database credentials and installed dependencies are not uploaded to GitHub.

## What I Learned

Working through this task gave me practical experience with setting up a development environment.

I learned how to:

- Install and verify Node.js and npm.
- Initialise and manage a Node.js project.
- Install packages using npm.
- Use Git to track changes.
- Create and manage a GitHub repository.
- Create a MySQL database.
- Connect a Node.js application to MySQL.
- Use environment variables to protect database credentials.
- Exclude unnecessary files from GitHub.

I also gained a better understanding of how the different tools used in full-stack development work together.

## Internship Details

**Organisation:** Codveda Technologies  
**Programme:** Full Stack Development Internship  
**Level:** Level 1  
**Task:** Task 1 – Setup Development Environment

**GitHub Repository:**  
[https://github.com/semahle2000/Codveda-Full-Stack](https://github.com/semahle2000/Codveda-Full-Stack)



This is my starting point in the Codveda Full Stack Development Internship. I look forward to building on this foundation as I work through the next tasks.

