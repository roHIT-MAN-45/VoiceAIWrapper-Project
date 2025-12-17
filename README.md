## Setup

### Prerequisites

- Docker & Docker Compose
- Python 3.12+

### Environment Configuration

Both the **server** and **client** ship with a `.env.example` file.

Before running the project, create `.env` files by copying the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

## Run with Docker

Build and start all services using Docker Compose:

```bash
docker compose up --build
```

## Run Tests Locally

Tests must be executed from inside the `src` directory.

```bash
cd server
source venv/bin/activate
cd src
pytest
```

## Switch Organizations (Multi-Tenancy)

The client determines the active organization using an organization slug.

Update the client environment variable:

```env
VITE_ORG_SLUG=acme
VITE_ORG_SLUG=globex
# or
VITE_ORG_SLUG=initech
```

```bash
docker compose restart client
```

## List of Seeded Organizations

The backend automatically seeds organizations using a Django management command.

| Organization Name | Slug    |
| ----------------- | ------- |
| Acme Corporation  | acme    |
| Globex Inc        | globex  |
| Initech           | initech |

**Total organizations loaded:** 3
