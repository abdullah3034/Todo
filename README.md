# Todo Docker Application

This project is a Todo application that utilizes Docker to run both client and server components in separate containers. The client is built using React, while the server is built with Node.js and Express.

## Project Structure

```
TODO
├── client/                # Contains the client application
│   ├── Dockerfile         # Dockerfile for building the client image
│   ├── package.json       # npm configuration for the client
│   ├── postcss.config.js  # PostCSS configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── public/
│   │   └── index.html     # Main HTML file for the client
│   └── src/
│       ├── App.js         # Main React component
│       ├── index.css      # Global styles
│       ├── index.js       # Entry point for the React application
│       ├── components/
│       │   ├── TodoForm.js # Component for adding todos
│       │   └── TodoList.js # Component for displaying todos
│       └── services/
│           └── api.js     # API call functions
├── server/                # Contains the server application
│   ├── Dockerfile         # Dockerfile for building the server image
│   ├── database.sql       # SQL commands for database setup
│   ├── db.js              # Database connection logic
│   ├── index.js           # Entry point for the server application
│   ├── migrate.js         # Database migration logic
│   └── package.json       # npm configuration for the server
├── docker-compose.yml      # Defines services for Docker
├── .dockerignore           # Files to ignore when building Docker images
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TODO
   ```

2. Build and run the containers:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Client: `http://localhost:3000`
   - Server: `http://localhost:5000`

### Usage

- Use the client interface to add, view, and manage your todo items.
- The server handles API requests and interacts with the database.

### Contributing

Feel free to submit issues or pull requests for improvements and bug fixes.

### License

This project is licensed under the MIT License.