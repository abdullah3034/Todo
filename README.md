# Todo Application

A full-stack Todo application built with React, Express.js, and PostgreSQL, fully containerized with Docker.

## 🚀 Features

- ✅ Create, read, update, and delete todos
- 🏷️ Categorize todos by priority and category
- 📱 Responsive design with Tailwind CSS
- 🐳 Fully dockerized with Docker Compose
- 🔄 Real-time updates
- 💾 Persistent data storage

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Express.js** - Web application framework
- **Node.js** - JavaScript runtime
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
Todo/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── TodoForm.js
│   │   │   └── TodoList.js
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── server/                 # Express backend
│   ├── db.js              # Database connection
│   ├── index.js           # Server entry point
│   ├── database.sql       # Database schema
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## 🐳 Docker Setup (Recommended)

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Todo
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Docker Commands

```bash
# Start all containers
docker-compose up --build

# Start in background (detached mode)
docker-compose up -d --build

# Stop all containers
docker-compose down

# View logs
docker-compose logs

# Rebuild specific service
docker-compose up --build frontend
```

## 🖥️ Local Development Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed
- npm or yarn package manager

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb todo_app
   
   # Run schema
   psql -d todo_app -f database.sql
   ```

4. **Update database configuration**
   Edit `server/db.js` with your PostgreSQL credentials:
   ```javascript
   const pool = new Pool({
       user: 'your_username',
       password: 'your_password',
       host: 'localhost',
       port: 5432,
       database: 'todo_app'
   });
   ```

5. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos |
| POST | `/todos` | Create a new todo |
| GET | `/todos/:id` | Get a specific todo |
| PUT | `/todos/:id` | Update a todo |
| DELETE | `/todos/:id` | Delete a todo |

### Example API Usage

```javascript
// Create a todo
POST /todos
{
  "title": "Learn Docker",
  "description": "Master containerization",
  "priority": "high",
  "category": "learning"
}

// Update a todo
PUT /todos/1
{
  "title": "Learn Docker",
  "description": "Master containerization",
  "priority": "high",
  "category": "learning",
  "completed": true
}
```

## 🗄️ Database Schema

```sql
CREATE TABLE todos (
    todo_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    category VARCHAR(50) DEFAULT 'general',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Environment Variables

### Docker Environment Variables

The application uses the following environment variables in Docker:

```yaml
# Database
DB_HOST=database
DB_PORT=5432
DB_NAME=todo_app
DB_USER=postgres
DB_PASSWORD=Dita8220#

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

### Local Development Environment Variables

For local development, you can create a `.env` file in the server directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app
DB_USER=your_username
DB_PASSWORD=your_password
```

## 🚀 Deployment

### Production Docker Setup

1. **Update environment variables for production**
   ```yaml
   # In docker-compose.yml
   environment:
     - NODE_ENV=production
     - DB_PASSWORD=your_secure_password
   ```

2. **Build and deploy**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```


## 🧪 Testing

```bash
# Test frontend
cd client
npm test

# Test backend (if tests are added)
cd server
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes using ports
   npx kill-port 3000 5000 5432
   ```

2. **Database connection failed**
   - Check if PostgreSQL is running
   - Verify database credentials
   - Ensure database exists

3. **Docker build fails**
   ```bash
   # Clean Docker cache
   docker system prune -a
   docker-compose build --no-cache
   ```

4. **Frontend can't connect to backend**
   - Check if backend is running on port 5000
   - Verify CORS settings
   - Check network connectivity

### Getting Help

If you encounter any issues:
1. Check the logs: `docker-compose logs`
2. Verify all services are running: `docker-compose ps`
3. Check the troubleshooting section above
4. Open an issue on GitHub



---


