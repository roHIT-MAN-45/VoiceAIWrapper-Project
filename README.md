# Project Manager

A full-stack project management application built with Django (GraphQL API) and React (TypeScript). This application allows you to manage projects, tasks, and comments with a clean, modern interface.

## 🏗️ Project Structure

```
VoiceAIWrapper-Project/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── graphql/       # GraphQL queries and mutations
│   │   ├── apollo/        # Apollo Client configuration
│   │   └── types.ts       # TypeScript type definitions
│   ├── package.json       # Frontend dependencies
│   └── Dockerfile         # Frontend Docker configuration
│
├── server/                # Django backend application
│   ├── src/
│   │   ├── config/        # Django settings and configuration
│   │   ├── orgs/          # Organization app
│   │   ├── projects/      # Project app (models, schema, mutations)
│   │   ├── tasks/         # Task app (models, schema, mutations)
│   │   └── core/          # Core middleware
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile         # Backend Docker configuration
│   └── pytest.ini        # Pytest configuration
│
├── docker-compose.yml     # Docker Compose configuration for all services
├── server/
│   └── .env.example      # Backend environment variables template
├── client/
│   └── .env.example      # Frontend environment variables template
└── README.md             # This file
```

## 🚀 Quick Start with Docker

The easiest way to run the entire application is using Docker Compose. **One command to run everything!**

### Prerequisites

- Docker and Docker Compose installed
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VoiceAIWrapper-Project
   ```

2. **Create environment files**
   ```bash
   # Backend environment file
   cp server/.env.example server/.env
   
   # Frontend environment file
   cp client/.env.example client/.env
   ```
   Edit the `.env` files if you need to change any values.

3. **Start all services with one command**
   ```bash
   docker compose up -d
   ```

   This will start:
   - PostgreSQL database
   - Django backend server
   - React frontend development server

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - GraphQL Playground: http://localhost:8000/graphql/

5. **View logs** (optional)
   ```bash
   docker compose logs -f
   ```

### Docker Commands

```bash
# start all services in detached mode (one command to run everything!)
docker compose up -d

# view logs from all services
docker compose logs -f

# view logs from specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# stop all services
docker compose down

# stop and remove volumes (clean slate - removes database data)
docker compose down -v

# rebuild containers after code changes
docker compose up -d --build

# restart a specific service
docker compose restart backend
docker compose restart frontend

# check service status
docker compose ps

# execute command in running container
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py migrate
```

## 💻 Local Development Setup

If you prefer to run the application locally without Docker:

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the `server/` directory:
   ```bash
   cp server/.env.example server/.env
   ```
   
   The file should contain:
   ```env
   POSTGRES_DB=postgres
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ```

5. **Set up PostgreSQL database**
   Make sure PostgreSQL is running and create the database:
   ```bash
   createdb postgres
   ```

6. **Run migrations**
   ```bash
   cd src
   python manage.py migrate
   ```

7. **Create a superuser** (optional)
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

   The backend will be available at http://localhost:8000

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `client/` directory:
   ```bash
   cp client/.env.example client/.env
   ```
   
   The file should contain:
   ```env
   VITE_GRAPHQL_URI=http://localhost:8000/graphql/
   VITE_ORG_SLUG=acme
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:5173

## 🧪 Running Tests

### Backend Tests

The backend uses `pytest` and `pytest-django` for testing.

#### Running Tests Locally

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Activate virtual environment** (if not already active)
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Run all tests**
   ```bash
   cd src
   pytest
   ```

4. **Run tests with coverage**
   ```bash
   pytest --cov=. --cov-report=html
   ```
   Coverage report will be generated in `htmlcov/index.html` - open it in your browser to view detailed coverage.

5. **Run specific test file**
   ```bash
   pytest orgs/tests.py
   pytest projects/tests.py
   pytest tasks/tests.py
   ```

6. **Run tests in verbose mode**
   ```bash
   pytest -v
   ```

7. **Run tests with output**
   ```bash
   pytest -s
   ```

8. **Run specific test class or method**
   ```bash
   pytest orgs/tests.py::OrganizationModelTest
   pytest orgs/tests.py::OrganizationModelTest::test_organization_creation
   ```

#### Running Tests in Docker

```bash
# run tests in backend container
docker compose exec backend python -m pytest

# run tests with coverage
docker compose exec backend python -m pytest --cov=. --cov-report=html

# run specific test file
docker compose exec backend python -m pytest orgs/tests.py
```

### Test Structure

Tests are located in each app's `tests.py` file:
- `server/src/orgs/tests.py` - Organization model tests
- `server/src/projects/tests.py` - Project model tests
- `server/src/tasks/tests.py` - Task and TaskComment model tests

### Writing New Tests

1. Create test classes that inherit from `django.test.TestCase`
2. Use `setUp()` method to create test data
3. Write test methods starting with `test_`
4. Use assertions like `assertEqual()`, `assertTrue()`, etc.

Example:
```python
from django.test import TestCase
from orgs.models import Organization

class OrganizationTest(TestCase):
    def setUp(self):
        self.org = Organization.objects.create(
            name="Test Org",
            slug="test",
            contact_email="test@example.com"
        )
    
    def test_organization_creation(self):
        self.assertEqual(self.org.name, "Test Org")
```

## 📚 API Documentation

### GraphQL Endpoint

The GraphQL API is available at `/graphql/` endpoint.

### Available Queries

- `projects` - Get all projects for the current organization
- `projectStats(projectId: ID!)` - Get statistics for a project
- `tasks(projectId: ID!)` - Get tasks for a project
- `taskComments(taskId: ID!)` - Get comments for a task

### Available Mutations

- `createProject(name: String!, status: String!, description: String, dueDate: Date)` - Create a new project
- `updateProject(projectId: ID!, name: String, status: String, description: String, dueDate: Date)` - Update a project
- `createTask(projectId: ID!, title: String!, status: String!, description: String, assigneeEmail: String)` - Create a new task
- `updateTask(taskId: ID!, title: String, status: String, description: String, assigneeEmail: String)` - Update a task
- `addTaskComment(taskId: ID!, content: String!, authorEmail: String!)` - Add a comment to a task

### Organization Header

All requests must include the `X-ORG-SLUG` header to specify which organization's data to access.

Example:
```bash
curl -X POST http://localhost:8000/graphql/ \
  -H "Content-Type: application/json" \
  -H "X-ORG-SLUG: acme" \
  -d '{"query": "{ projects { id name } }"}'
```

## 🛠️ Technology Stack

### Backend
- **Django 5.2.9** - Web framework
- **Graphene-Django 3.2.3** - GraphQL integration
- **PostgreSQL** - Database
- **pytest** - Testing framework

### Frontend
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Apollo Client 4.0.10** - GraphQL client
- **Tailwind CSS 4.1.18** - Styling
- **Vite 7.2.4** - Build tool

## 📝 Environment Variables

### Backend Environment File (`server/.env`)

Create a `.env` file in the `server/` directory:

```bash
cp server/.env.example server/.env
```

The file should contain:

```env
# database configuration
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# django configuration
SECRET_KEY=django-insecure-dev-key-change-in-production
DEBUG=True
```

### Frontend Environment File (`client/.env`)

Create a `.env` file in the `client/` directory:

```bash
cp client/.env.example client/.env
```

The file should contain:

```env
# frontend configuration
VITE_GRAPHQL_URI=http://localhost:8000/graphql/
VITE_ORG_SLUG=acme
```

Docker Compose automatically loads these `.env` files from their respective directories and injects the variables into the containers.

## 🐛 Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Check what's using the port
lsof -i :8000  # or :5173, :5432
# Stop the service using the port or change ports in docker-compose.yml
```

**Database connection errors:**
- Ensure PostgreSQL container is healthy: `docker compose ps`
- Check database credentials in `server/.env` file
- Wait for database to be ready before starting backend

**Container won't start:**
```bash
# View logs
docker compose logs backend
docker compose logs frontend

# Rebuild containers
docker compose up -d --build
```

### Local Development Issues

**Migration errors:**
```bash
cd server/src
python manage.py makemigrations
python manage.py migrate
```

**Module not found errors:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

**Frontend build errors:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```


